/* tslint:disable */
/* eslint-disable */

/**
 * info about a flo file
 */
export class AudioInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly version: string;
    /**
     * Bits per sample
     */
    bit_depth: number;
    /**
     * Number of channels
     */
    channels: number;
    /**
     * Compression ratio (original / compressed)
     */
    compression_ratio: number;
    /**
     * Is CRC valid?
     */
    crc_valid: boolean;
    /**
     * Duration in seconds
     */
    duration_secs: number;
    /**
     * File size in bytes
     */
    file_size: number;
    /**
     * Is lossy compression mode?
     */
    is_lossy: boolean;
    /**
     * Lossy quality 0-4 (only valid if is_lossy)
     */
    lossy_quality: number;
    /**
     * Sample rate in Hz
     */
    sample_rate: number;
    /**
     * Total sample-frames (samples per channel). This is the number of sample
     * instants per channel (not interleaved samples). Use metadata.length_ms
     * for a quick duration lookup.
     */
    total_samples: bigint;
}

export class WasmStreamingDecoder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * how many frames ready to decode
     */
    available_frames(): number;
    /**
     * bytes currently buffered
     */
    buffered_bytes(): number;
    /**
     * current frame index
     */
    current_frame_index(): number;
    /**
     * decode all currently available samples
     */
    decode_available(): Float32Array;
    /**
     * feed data to the decoder, call as bytes come in from network
     */
    feed(data: Uint8Array): boolean;
    /**
     * Get audio information (available after header is parsed)
     *
     * Returns null if header hasn't been parsed yet.
     */
    get_info(): any;
    /**
     * Check if there was an error
     */
    has_error(): boolean;
    /**
     * stream done?
     */
    is_finished(): boolean;
    /**
     * Check if the decoder is ready to produce audio
     */
    is_ready(): boolean;
    /**
     * new streaming decoder
     */
    constructor();
    /**
     * Decode the next available frame
     *
     * Returns interleaved f32 samples for one frame, or null if no frame is ready.
     * This enables true streaming: decode and play frames as they arrive.
     *
     * Usage pattern:
     * ```js
     * while (true) {
     *     const samples = decoder.next_frame();
     *     if (samples === null) break; // No more frames ready
     *     playAudio(samples);
     * }
     * ```
     */
    next_frame(): any;
    /**
     * Reset the decoder to initial state
     *
     * Use this to start decoding a new stream.
     */
    reset(): void;
    /**
     * Get the current state as a string
     */
    state(): string;
}

/**
 * Encodes samples frame-by-frame as they arrive, returning encoded frames ready for transmission.
 * Use this for low-latency streaming encoding where you push samples and pull frames.
 */
export class WasmStreamingEncoder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Build a complete flo file from all accumulated frames
     *
     * Call flush() first, then this method to generate the complete file.
     * The file will contain all encoded frames with proper table-of-contents.
     *
     * # Arguments
     * * `metadata` - Optional metadata bytes (MessagePack encoded, use create_metadata())
     *
     * # Returns
     * Complete flo file as byte array
     */
    finalize(metadata?: Uint8Array | null): Uint8Array;
    /**
     * Flush remaining samples and finalize encoding
     *
     * Call this when done pushing samples. Encodes any remaining partial frame.
     * After this, call finalize() to get the complete flo file.
     *
     * # Returns
     * Error if encoding fails
     */
    flush(): void;
    /**
     * Create a new streaming encoder
     *
     * # Arguments
     * * `sample_rate` - Sample rate in Hz (e.g., 44100)
     * * `channels` - Number of channels (1 or 2)
     * * `bit_depth` - Bits per sample (16, 24, or 32)
     *
     * # Returns
     * New encoder instance
     */
    constructor(sample_rate: number, channels: number, bit_depth: number);
    /**
     * Get the next encoded frame if available
     *
     * Returns an object with: index, timestamp_ms, data (Uint8Array), samples
     * Returns null if no frames are ready yet.
     *
     * # Returns
     * Encoded frame object or null
     */
    next_frame(): any;
    /**
     * Get number of encoded frames ready for transmission
     *
     * # Returns
     * Number of ready frames
     */
    pending_frames(): number;
    /**
     * Get number of samples currently buffered
     *
     * # Returns
     * Number of sample frames in buffer
     */
    pending_samples(): number;
    /**
     * Push audio samples to the encoder
     *
     * Samples should be interleaved if multi-channel (e.g., [L0, R0, L1, R1, ...] for stereo).
     * Frames are encoded automatically when enough samples accumulate.
     *
     * # Arguments
     * * `samples` - Interleaved f32 audio samples (-1.0 to 1.0)
     *
     * # Returns
     * Error if encoding fails
     */
    push_samples(samples: Float32Array): void;
    /**
     * Set compression level (0-9)
     *
     * # Arguments
     * * `level` - Compression level (0=fast/large, 9=slow/small)
     *
     * # Returns
     * Self for method chaining
     */
    with_compression(level: number): WasmStreamingEncoder;
}

/**
 * Compute EBU R128 loudness metrics from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 *
 * # Returns
 * LoudnessMetrics object with integrated LUFS, loudness range LU, and true peak dBTP
 */
export function compute_loudness_metrics(samples: Float32Array, channels: number, sample_rate: number): any;

/**
 * Compute EBU R128 loudness metrics from audio samples
 */
export function compute_loudness_metrics_reflo(samples: Float32Array, channels: number, sample_rate: number): any;

/**
 * Create metadata from basic fields and serialize to MessagePack
 *
 * # Arguments
 * * `title` - Optional title
 * * `artist` - Optional artist
 * * `album` - Optional album
 *
 * # Returns
 * MessagePack bytes containing metadata
 */
export function create_metadata(title?: string | null, artist?: string | null, album?: string | null): Uint8Array;

/**
 * Create metadata from a JavaScript object
 *
 * Accepts an object with any of the supported metadata fields.
 * See FloMetadata for available fields.
 *
 * # Returns
 * MessagePack bytes containing metadata
 */
export function create_metadata_from_object(obj: any): Uint8Array;

/**
 * decode flo file to samples
 *
 * This automatically detects whether the file uses lossless or lossy encoding
 * and dispatches to the appropriate decoder.
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * Interleaved audio samples (f32, -1.0 to 1.0)
 */
export function decode(data: Uint8Array): Float32Array;

export function decode_flo_to_samples(flo_bytes: Uint8Array): any;

export function decode_flo_to_wav(flo_bytes: Uint8Array): Uint8Array;

/**
 * Decode a single frame by index without decoding the entire file
 *
 * # Arguments
 * * `flo_data` - Complete flo file bytes
 * * `frame_index` - Zero-based frame index
 *
 * # Returns
 * Interleaved audio samples for that frame (f32, -1.0 to 1.0)
 */
export function decode_frame_at(flo_data: Uint8Array, frame_index: number): Float32Array;

/**
 * encode samples to flo lossless
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of channels (1 or 2)
 * * `bit_depth` - Bits per sample (16, 24, or 32)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 *
 * # Note
 * For advanced usage with custom compression levels (0-9),
 * use the `Encoder` builder pattern directly.
 */
export function encode(samples: Float32Array, sample_rate: number, channels: number, bit_depth: number, metadata?: Uint8Array | null): Uint8Array;

export function encode_audio_to_flo(audio_bytes: Uint8Array, lossy: boolean, quality: number, level: number): Uint8Array;

/**
 * encode samples to flo lossy
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of audio channels (1 or 2)
 * * `bit_depth` - Bits per sample (typically 16)
 * * `quality` - Quality level 0-4 (0=low/~64kbps, 4=transparent/~320kbps)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 *
 * # Note
 * For advanced usage with continuous quality control (0.0-1.0) or custom settings,
 * use the `LossyEncoder` builder pattern directly.
 */
export function encode_lossy(samples: Float32Array, sample_rate: number, channels: number, _bit_depth: number, quality: number, metadata?: Uint8Array | null): Uint8Array;

/**
 * encode to flo lossy with target bitrate
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of audio channels
 * * `bit_depth` - Bits per sample (16, 24, or 32)
 * * `target_bitrate_kbps` - Target bitrate in kbps (e.g., 128, 192, 256, 320)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 */
export function encode_with_bitrate(samples: Float32Array, sample_rate: number, channels: number, _bit_depth: number, target_bitrate_kbps: number, metadata?: Uint8Array | null): Uint8Array;

/**
 * Extract dominant frequencies from spectral fingerprint
 *
 * # Arguments
 * * `fingerprint_js` - SpectralFingerprint JavaScript object
 * * `num_frequencies` - Number of dominant frequencies to extract per frame
 *
 * # Returns
 * JavaScript array of arrays containing dominant frequencies (Hz) for each frame
 */
export function extract_dominant_frequencies_from_fingerprint_wasm(fingerprint_js: any, num_frequencies: number): any;

/**
 * Extract dominant frequencies from audio samples (convenience function)
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `sample_rate` - Sample rate in Hz
 * * `channels` - Number of audio channels
 * * `num_frequencies` - Number of dominant frequencies to extract per frame
 * * `fft_size` - FFT window size (optional, will auto-select if None)
 * * `hop_size` - Hop size between frames (optional, will auto-select if None)
 *
 * # Returns
 * JavaScript array of arrays containing dominant frequencies (Hz) for each frame
 */
export function extract_dominant_frequencies_from_samples_wasm(samples: Float32Array, sample_rate: number, channels: number, num_frequencies: number, fft_size?: number | null, hop_size?: number | null): any;

/**
 * Extract dominant frequencies from spectral fingerprint
 */
export function extract_dominant_frequencies_reflo(fingerprint_js: any, num_frequencies: number): any;

/**
 * Extract dominant frequencies from spectral fingerprint
 */
export function extract_dominant_frequencies_wasm(fingerprint_js: any, num_frequencies: number): any;

/**
 * Extract spectral fingerprint from audio samples
 */
export function extract_spectral_fingerprint_reflo(samples: Float32Array, channels: number, sample_rate: number, fft_size?: number | null, hop_size?: number | null): any;

/**
 * Extract spectral fingerprint from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 * * `fft_size` - FFT window size (must be power of 2)
 * * `hop_size` - Hop size between consecutive frames
 *
 * # Returns
 * SpectralFingerprint object with frequency analysis
 */
export function extract_spectral_fingerprint_wasm(samples: Float32Array, channels: number, sample_rate: number, fft_size?: number | null, hop_size?: number | null): any;

/**
 * Extract waveform peaks from audio samples
 */
export function extract_waveform_peaks_reflo(samples: Float32Array, channels: number, sample_rate: number, peaks_per_second: number): any;

/**
 * Extract waveform peaks from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 * * `peaks_per_second` - Number of peak values to extract per second
 *
 * # Returns
 * WaveformData object with extracted peaks
 */
export function extract_waveform_peaks_wasm(samples: Float32Array, channels: number, sample_rate: number, peaks_per_second?: number | null): any;

/**
 * Format time in seconds to MM:SS or H:MM:SS string
 */
export function format_time(seconds: number): string;

/**
 * Format time in milliseconds to MM:SS or H:MM:SS string
 */
export function format_time_ms(milliseconds: number): string;

export function get_audio_file_info(audio_bytes: Uint8Array): any;

/**
 * Get cover art from a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * Object with `mime_type` and `data` (Uint8Array) or null if no cover
 */
export function get_cover_art(data: Uint8Array): any;

/**
 * Get encoding information from a flo file
 * Returns { originalFilename, encoderSettings, encoderVersion, encodingTime, sourceFormat, encodedBy }
 */
export function get_encoding_info(flo_bytes: Uint8Array): any;

export function get_flo_info(flo_bytes: Uint8Array): any;

/**
 * Extract metadata from a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * JavaScript object with metadata fields (or null if no metadata)
 */
export function get_metadata(data: Uint8Array): any;

/**
 * Get just the metadata bytes from a flo file
 *
 * # Arguments
 * * `flo_data` - flo file bytes
 *
 * # Returns
 * Raw MessagePack metadata bytes (or empty array)
 */
export function get_metadata_bytes(flo_data: Uint8Array): Uint8Array;

/**
 * Get section markers from a flo file
 *
 * # Returns
 * Array of section markers or null if none
 */
export function get_section_markers(data: Uint8Array): any;

/**
 * Get synced lyrics from a flo file
 *
 * # Returns
 * Array of synced lyrics objects or null if none
 */
export function get_synced_lyrics(data: Uint8Array): any;

/**
 * Extract TOC (Table of Contents) entries from a flo file
 *
 * # Returns
 * Array of TOC entries with frame indices, byte offsets, and timestamps
 */
export function get_toc(flo_data: Uint8Array): any[];

/**
 * Get waveform data from a flo file for instant visualization
 *
 * # Returns
 * WaveformData object or null if not present
 */
export function get_waveform_data(data: Uint8Array): any;

/**
 * Check if a flo file has metadata
 */
export function has_flo_metadata(flo_bytes: Uint8Array): boolean;

/**
 * does the file have metadata? (wasm binding)
 */
export function has_metadata(flo_data: Uint8Array): boolean;

/**
 * Get information about a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * AudioInfo struct with file details
 */
export function info(data: Uint8Array): AudioInfo;

export function init(): void;

export function read_flo_metadata(flo_bytes: Uint8Array): any;

/**
 * Seek to a specific time in milliseconds
 *
 * # Arguments
 * * `flo_data` - Complete flo file bytes
 * * `time_ms` - Target time in milliseconds
 *
 * # Returns
 * Seek result object containing frame index, byte offset, timestamp, sample offset, and next timestamp.
 */
export function seek_to_time(flo_data: Uint8Array, time_ms: number): any;

/**
 * Replace just the metadata in a flo file (convenience function)
 *
 * Takes a metadata object directly instead of MessagePack bytes.
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 * * `metadata` - JavaScript metadata object
 *
 * # Returns
 * New flo file with updated metadata
 */
export function set_metadata(flo_data: Uint8Array, metadata: any): Uint8Array;

/**
 * Set a single field in existing metadata bytes
 *
 * Uses serde to dynamically set fields - field names match FloMetadata struct.
 * For complex fields (pictures, synced_lyrics, etc.) use create_metadata_from_object.
 *
 * # Arguments
 * * `metadata` - Existing MessagePack metadata bytes (or empty for new)
 * * `field` - Field name (e.g., "title", "artist", "bpm")
 * * `value` - Field value (string, number, or null)
 *
 * # Returns
 * Updated MessagePack metadata bytes
 */
export function set_metadata_field(metadata: Uint8Array | null | undefined, field: string, value: any): Uint8Array;

/**
 * Compute spectral similarity between two fingerprints
 *
 * # Arguments
 * * `samples1` - First audio samples
 * * `samples2` - Second audio samples
 * * `sample_rate` - Sample rate in Hz
 * * `channels` - Number of audio channels (1 or 2)
 * * `fft_size` - FFT window size (default: 2048)
 * * `hop_size` - Hop size between frames (default: fft_size/2)
 *
 * # Returns
 * Similarity score between 0.0 (completely different) and 1.0 (identical)
 */
export function spectral_similarity(samples1: Float32Array, samples2: Float32Array, sample_rate: number, channels: number, fft_size?: number | null, hop_size?: number | null): any;

export function strip_flo_metadata(flo_bytes: Uint8Array): Uint8Array;

/**
 * Remove all metadata from a flo file
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 *
 * # Returns
 * New flo file with no metadata
 */
export function strip_metadata(flo_data: Uint8Array): Uint8Array;

export function update_flo_metadata(flo_bytes: Uint8Array, metadata: any): Uint8Array;

/**
 * update metadata without re-encoding audio
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 * * `new_metadata` - New MessagePack metadata bytes (use create_metadata_*)
 *
 * # Returns
 * New flo file with updated metadata
 */
export function update_metadata(flo_data: Uint8Array, new_metadata: Uint8Array): Uint8Array;

/**
 * Validate flo file integrity
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * true if file is valid and CRC matches
 */
export function validate(data: Uint8Array): boolean;

export function validate_flo_file(flo_bytes: Uint8Array): boolean;

/**
 * get lib version
 */
export function version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_audioinfo_free: (a: number, b: number) => void;
    readonly __wbg_get_audioinfo_bit_depth: (a: number) => number;
    readonly __wbg_get_audioinfo_channels: (a: number) => number;
    readonly __wbg_get_audioinfo_compression_ratio: (a: number) => number;
    readonly __wbg_get_audioinfo_crc_valid: (a: number) => number;
    readonly __wbg_get_audioinfo_duration_secs: (a: number) => number;
    readonly __wbg_get_audioinfo_file_size: (a: number) => number;
    readonly __wbg_get_audioinfo_is_lossy: (a: number) => number;
    readonly __wbg_get_audioinfo_lossy_quality: (a: number) => number;
    readonly __wbg_get_audioinfo_sample_rate: (a: number) => number;
    readonly __wbg_get_audioinfo_total_samples: (a: number) => bigint;
    readonly __wbg_set_audioinfo_bit_depth: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_channels: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_compression_ratio: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_crc_valid: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_duration_secs: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_file_size: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_is_lossy: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_lossy_quality: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_sample_rate: (a: number, b: number) => void;
    readonly __wbg_set_audioinfo_total_samples: (a: number, b: bigint) => void;
    readonly __wbg_wasmstreamingdecoder_free: (a: number, b: number) => void;
    readonly __wbg_wasmstreamingencoder_free: (a: number, b: number) => void;
    readonly audioinfo_version: (a: number) => [number, number];
    readonly compute_loudness_metrics: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly compute_loudness_metrics_reflo: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly create_metadata: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
    readonly create_metadata_from_object: (a: any) => [number, number, number, number];
    readonly decode: (a: number, b: number) => [number, number, number, number];
    readonly decode_flo_to_samples: (a: number, b: number) => [number, number, number];
    readonly decode_flo_to_wav: (a: number, b: number) => [number, number, number, number];
    readonly decode_frame_at: (a: number, b: number, c: number) => [number, number, number, number];
    readonly encode: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number, number];
    readonly encode_audio_to_flo: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
    readonly encode_lossy: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number, number];
    readonly encode_with_bitrate: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number, number];
    readonly extract_dominant_frequencies_from_fingerprint_wasm: (a: any, b: number) => [number, number, number];
    readonly extract_dominant_frequencies_from_samples_wasm: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number];
    readonly extract_dominant_frequencies_reflo: (a: any, b: number) => [number, number, number];
    readonly extract_dominant_frequencies_wasm: (a: any, b: number) => [number, number, number];
    readonly extract_spectral_fingerprint_reflo: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
    readonly extract_spectral_fingerprint_wasm: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
    readonly extract_waveform_peaks_reflo: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly extract_waveform_peaks_wasm: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly format_time: (a: number) => [number, number];
    readonly format_time_ms: (a: number) => [number, number];
    readonly get_audio_file_info: (a: number, b: number) => [number, number, number];
    readonly get_cover_art: (a: number, b: number) => [number, number, number];
    readonly get_encoding_info: (a: number, b: number) => [number, number, number];
    readonly get_flo_info: (a: number, b: number) => [number, number, number];
    readonly get_metadata: (a: number, b: number) => [number, number, number];
    readonly get_metadata_bytes: (a: number, b: number) => [number, number, number, number];
    readonly get_section_markers: (a: number, b: number) => [number, number, number];
    readonly get_synced_lyrics: (a: number, b: number) => [number, number, number];
    readonly get_toc: (a: number, b: number) => [number, number, number, number];
    readonly get_waveform_data: (a: number, b: number) => [number, number, number];
    readonly has_flo_metadata: (a: number, b: number) => number;
    readonly has_metadata: (a: number, b: number) => number;
    readonly info: (a: number, b: number) => [number, number, number];
    readonly init: () => void;
    readonly read_flo_metadata: (a: number, b: number) => [number, number, number];
    readonly seek_to_time: (a: number, b: number, c: number) => [number, number, number];
    readonly set_metadata: (a: number, b: number, c: any) => [number, number, number, number];
    readonly set_metadata_field: (a: number, b: number, c: number, d: number, e: any) => [number, number, number, number];
    readonly spectral_similarity: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number];
    readonly strip_flo_metadata: (a: number, b: number) => [number, number, number, number];
    readonly strip_metadata: (a: number, b: number) => [number, number, number, number];
    readonly update_flo_metadata: (a: number, b: number, c: any) => [number, number, number, number];
    readonly update_metadata: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly validate: (a: number, b: number) => [number, number, number];
    readonly validate_flo_file: (a: number, b: number) => [number, number, number];
    readonly version: () => [number, number];
    readonly wasmstreamingdecoder_available_frames: (a: number) => number;
    readonly wasmstreamingdecoder_buffered_bytes: (a: number) => number;
    readonly wasmstreamingdecoder_current_frame_index: (a: number) => number;
    readonly wasmstreamingdecoder_decode_available: (a: number) => [number, number, number, number];
    readonly wasmstreamingdecoder_feed: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmstreamingdecoder_get_info: (a: number) => [number, number, number];
    readonly wasmstreamingdecoder_has_error: (a: number) => number;
    readonly wasmstreamingdecoder_is_finished: (a: number) => number;
    readonly wasmstreamingdecoder_is_ready: (a: number) => number;
    readonly wasmstreamingdecoder_new: () => number;
    readonly wasmstreamingdecoder_next_frame: (a: number) => [number, number, number];
    readonly wasmstreamingdecoder_reset: (a: number) => void;
    readonly wasmstreamingdecoder_state: (a: number) => [number, number];
    readonly wasmstreamingencoder_finalize: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmstreamingencoder_flush: (a: number) => [number, number];
    readonly wasmstreamingencoder_new: (a: number, b: number, c: number) => number;
    readonly wasmstreamingencoder_next_frame: (a: number) => any;
    readonly wasmstreamingencoder_pending_frames: (a: number) => number;
    readonly wasmstreamingencoder_pending_samples: (a: number) => number;
    readonly wasmstreamingencoder_push_samples: (a: number, b: number, c: number) => [number, number];
    readonly wasmstreamingencoder_with_compression: (a: number, b: number) => number;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
