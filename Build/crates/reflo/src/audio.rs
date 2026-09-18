use crate::AudioMetadata;
use alloc::boxed::Box;
use alloc::string::String;
use alloc::string::ToString;
use alloc::vec::Vec;
use libflo_audio::{FloError, FloErrorKind, FloResult};
use symphonia::core::audio::GenericAudioBufferRef;
use symphonia::core::codecs::audio::{well_known, AudioDecoderOptions, CODEC_ID_NULL_AUDIO};
use symphonia::core::common::Limit;
use symphonia::core::formats::probe::Hint;
use symphonia::core::formats::FormatOptions;
use symphonia::core::io::{MediaSource, MediaSourceStream, SeekFrom};
use symphonia::core::meta::{MetadataOptions, StandardTag, StandardVisualKey};

#[cfg(feature = "std")]
use std::path::Path;

/// Wrap a symphonia error with a codec context into a [`FloError`].
fn codec_err(ctx: &str, e: impl core::fmt::Display) -> FloError {
    FloError::new(FloErrorKind::Codec, alloc::format!("{ctx}: {e}"))
}

/// Wrap an I/O error with a context into a [`FloError`].
#[cfg(feature = "std")]
fn io_err(ctx: &str, e: impl core::fmt::Display) -> FloError {
    FloError::new(FloErrorKind::Io, alloc::format!("{ctx}: {e}"))
}

pub(crate) struct ByteSource {
    data: Vec<u8>,
    pos: usize,
}

impl ByteSource {
    pub(crate) fn new(data: Vec<u8>) -> Self {
        ByteSource { data, pos: 0 }
    }
}

impl MediaSource for ByteSource {
    fn is_seekable(&self) -> bool {
        true
    }

    fn byte_len(&self) -> Option<u64> {
        Some(self.data.len() as u64)
    }

    fn read(&mut self, buf: &mut [u8]) -> Result<usize, symphonia::core::io::MediaError> {
        let remaining = self.data.len() - self.pos;
        let n = core::cmp::min(buf.len(), remaining);
        buf[..n].copy_from_slice(&self.data[self.pos..self.pos + n]);
        self.pos += n;
        Ok(n)
    }

    fn seek(&mut self, pos: SeekFrom) -> Result<u64, symphonia::core::io::MediaError> {
        let new_pos = match pos {
            SeekFrom::Start(p) => p as usize,
            SeekFrom::End(p) => (self.data.len() as i64 + p) as usize,
            SeekFrom::Current(p) => (self.pos as i64 + p) as usize,
        };
        self.pos = new_pos.min(self.data.len());
        Ok(self.pos as u64)
    }
}

/// Read an audio file and return (samples, sample_rate, channels, metadata)
/// Samples are interleaved f32 in range [-1.0, 1.0]
#[cfg(feature = "std")]
pub fn read_audio_file_with_metadata(
    path: &Path,
) -> FloResult<(Vec<f32>, u32, usize, AudioMetadata)> {
    let bytes = std::fs::read(path).map_err(|e| io_err("Failed to open audio file", e))?;
    read_audio_from_bytes(&bytes)
}

/// Read audio from bytes (for cross-platform/WASM support)
pub fn read_audio_from_bytes(bytes: &[u8]) -> FloResult<(Vec<f32>, u32, usize, AudioMetadata)> {
    let mss = MediaSourceStream::new(
        Box::new(ByteSource::new(bytes.to_vec())),
        Default::default(),
    );
    read_from_source_with_metadata(mss, None)
}

/// Read an audio file and return (samples, sample_rate, channels)
/// Samples are interleaved f32 in range [-1.0, 1.0]
#[cfg(feature = "std")]
#[allow(dead_code)]
pub fn read_audio_file(path: &Path) -> FloResult<(Vec<f32>, u32, usize)> {
    let (samples, sample_rate, channels, _) = read_audio_file_with_metadata(path)?;
    Ok((samples, sample_rate, channels))
}

fn read_from_source_with_metadata(
    mss: MediaSourceStream,
    extension: Option<&str>,
) -> FloResult<(Vec<f32>, u32, usize, AudioMetadata)> {
    // Create hint from file extension
    let mut hint = Hint::new();
    if let Some(ext) = extension {
        hint.with_extension(ext);
    }

    // Enable metadata reading
    let meta_opts = MetadataOptions::default()
        .limit_tag_bytes(Limit::Maximum(16 * 1024 * 1024)) // 16MB max
        .limit_visual_bytes(Limit::Maximum(16 * 1024 * 1024));

    // Probe the format
    let mut format = symphonia::default::get_probe()
        .probe(&hint, mss, FormatOptions::default(), meta_opts)
        .map_err(|e| codec_err("Unsupported audio format", e))?;

    // Extract metadata
    let mut metadata = AudioMetadata {
        source_format: extension.map(|ext| ext.to_uppercase()),
        ..Default::default()
    };

    // Check metadata from the format reader
    if let Some(current) = format.metadata().current() {
        extract_metadata_tags(current, &mut metadata);
    }

    // Find the first audio track
    let track = format
        .tracks()
        .iter()
        .find(|t| {
            t.codec_params
                .as_ref()
                .and_then(|p| p.audio())
                .is_some_and(|a| a.codec != CODEC_ID_NULL_AUDIO)
        })
        .ok_or_else(|| FloError::new(FloErrorKind::Codec, "No audio track found"))?;

    let codec_params = track
        .codec_params
        .as_ref()
        .ok_or_else(|| FloError::new(FloErrorKind::Codec, "No codec parameters"))?
        .audio()
        .ok_or_else(|| FloError::new(FloErrorKind::Codec, "No audio codec"))?;

    // If we didn't get format from extension, try to detect from codec
    if metadata.source_format.is_none() {
        let codec_type = codec_params.codec;
        metadata.source_format = Some(match codec_type {
            well_known::CODEC_ID_FLAC => "FLAC".to_string(),
            well_known::CODEC_ID_PCM_S16LE
            | well_known::CODEC_ID_PCM_S16BE
            | well_known::CODEC_ID_PCM_S24LE
            | well_known::CODEC_ID_PCM_S32LE => "WAV".to_string(),
            well_known::CODEC_ID_MP3 => "MP3".to_string(),
            well_known::CODEC_ID_VORBIS => "OGG".to_string(),
            well_known::CODEC_ID_AAC => "AAC".to_string(),
            _ => "UNKNOWN".to_string(),
        });
    }

    let track_id = track.id;
    let sample_rate = codec_params
        .sample_rate
        .ok_or_else(|| FloError::new(FloErrorKind::Codec, "Unknown sample rate"))?;
    let channels = codec_params
        .channels
        .clone()
        .ok_or_else(|| FloError::new(FloErrorKind::Codec, "Unknown channel count"))?
        .count();

    // Create decoder
    let mut decoder = symphonia::default::get_codecs()
        .make_audio_decoder(codec_params, &AudioDecoderOptions::default())
        .map_err(|e| codec_err("Failed to create decoder", e))?;

    let mut samples = Vec::new();

    // Decode all packets
    loop {
        let packet = match format.next_packet() {
            Ok(Some(packet)) => packet,
            Ok(None) => break,
            Err(symphonia::core::errors::Error::IoError(e))
                if e.kind() == symphonia::core::io::MediaErrorKind::Eof =>
            {
                break
            }
            Err(e) => return Err(codec_err("Error reading packet", e)),
        };

        if packet.track_id != track_id {
            continue;
        }

        let decoded = match decoder.decode(&packet) {
            Ok(decoded) => decoded,
            Err(symphonia::core::errors::Error::DecodeError(_)) => continue,
            Err(e) => return Err(codec_err("Error decoding packet", e)),
        };

        // Convert to f32
        append_samples(&decoded, &mut samples);
    }

    Ok((samples, sample_rate, channels, metadata))
}

fn extract_metadata_tags(
    meta: &symphonia::core::meta::MetadataRevision,
    metadata: &mut AudioMetadata,
) {
    for tag in &meta.media.tags {
        if let Some(std_tag) = &tag.std {
            match std_tag {
                StandardTag::TrackTitle(title) => metadata.title = Some(title.to_string()),
                StandardTag::Artist(artist) => metadata.artist = Some(artist.to_string()),
                StandardTag::Album(album) => metadata.album = Some(album.to_string()),
                StandardTag::AlbumArtist(artist) => {
                    metadata.album_artist = Some(artist.to_string())
                }
                StandardTag::RecordingYear(year) | StandardTag::ReleaseYear(year) => {
                    metadata.year = Some(*year as i32);
                }
                StandardTag::RecordingDate(date) | StandardTag::ReleaseDate(date) => {
                    if let Ok(year) = date.chars().take(4).collect::<String>().parse::<i32>() {
                        metadata.year = Some(year);
                    }
                }
                StandardTag::Genre(genre) => metadata.genre = Some(genre.to_string()),
                StandardTag::TrackNumber(n) => metadata.track_number = Some(*n as u32),
                StandardTag::TrackTotal(n) => metadata.track_total = Some(*n as u32),
                StandardTag::DiscNumber(n) => metadata.disc_number = Some(*n as u32),
                StandardTag::Composer(composer) => metadata.composer = Some(composer.to_string()),
                StandardTag::Comment(comment) => metadata.comment = Some(comment.to_string()),
                StandardTag::Bpm(bpm) => metadata.bpm = Some(*bpm as f32),
                _ => {}
            }
        }
    }

    // Extract cover art from visuals
    for visual in &meta.media.visuals {
        if matches!(visual.usage, Some(StandardVisualKey::FrontCover))
            || metadata.cover_art.is_none()
        {
            let mime = visual.media_type.clone().unwrap_or_default();
            metadata.cover_art = Some((mime, visual.data.to_vec()));
        }
    }
}

fn append_samples(decoded: &GenericAudioBufferRef, samples: &mut Vec<f32>) {
    let mut frame = Vec::new();
    decoded.copy_to_vec_interleaved(&mut frame);
    samples.extend_from_slice(&frame);
}

/// Write samples to a WAV file
#[cfg(feature = "std")]
pub fn write_wav(path: &Path, samples: &[f32], sample_rate: u32, channels: usize) -> FloResult<()> {
    let bytes = write_wav_to_bytes(samples, sample_rate, channels);
    std::fs::write(path, bytes).map_err(|e| io_err("Failed to write WAV file", e))
}

/// Write samples to WAV format in memory (for cross-platform/WASM support)
pub fn write_wav_to_bytes(samples: &[f32], sample_rate: u32, channels: usize) -> Vec<u8> {
    // WAV file format (RIFF)
    let mut buffer = Vec::new();

    let num_samples = samples.len();
    let bytes_per_sample = 4; // 32-bit float
    let data_size = num_samples * bytes_per_sample;
    let file_size = 36 + data_size; // 44 byte header - 8 + data_size

    // RIFF header
    buffer.extend_from_slice(b"RIFF");
    buffer.extend_from_slice(&(file_size as u32).to_le_bytes());
    buffer.extend_from_slice(b"WAVE");

    // fmt chunk
    buffer.extend_from_slice(b"fmt ");
    buffer.extend_from_slice(&16u32.to_le_bytes()); // chunk size
    buffer.extend_from_slice(&3u16.to_le_bytes()); // format = IEEE float
    buffer.extend_from_slice(&(channels as u16).to_le_bytes());
    buffer.extend_from_slice(&sample_rate.to_le_bytes());
    let byte_rate = sample_rate * channels as u32 * bytes_per_sample as u32;
    buffer.extend_from_slice(&byte_rate.to_le_bytes());
    let block_align = channels as u16 * bytes_per_sample as u16;
    buffer.extend_from_slice(&block_align.to_le_bytes());
    buffer.extend_from_slice(&32u16.to_le_bytes()); // bits per sample

    // data chunk
    buffer.extend_from_slice(b"data");
    buffer.extend_from_slice(&(data_size as u32).to_le_bytes());

    // Write samples
    for &sample in samples {
        buffer.extend_from_slice(&sample.to_le_bytes());
    }

    buffer
}
