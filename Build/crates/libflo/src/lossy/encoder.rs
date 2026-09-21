use super::mdct::{
    BlockSize, Mdct, WindowType, LONG_BLOCK_SIZE, SHORTS_PER_GROUP, SHORT_BLOCK_SIZE,
    SHORT_GROUP_OFFSET,
};
use super::psychoacoustic::{PsychoacousticModel, NUM_BARK_BANDS};
use crate::core::{ChannelData, Frame, FrameType, ResidualEncoding, I16_MAX_F32, I16_MIN_F32};
use alloc::vec;
use alloc::vec::Vec;

/// Loudness spike threshold (energy ratio) between adjacent short windows that
/// marks a transient.
const ATTACK_RATIO: f32 = 8.0;
/// Relative floor for the transient detector baseline: short-window energy must
/// clear a fraction of the frame's average energy to count as an attack.
const DETECTOR_FLOOR_FRACTION: f32 = 0.05;
/// Hop size in samples between frames (LONG_BLOCK_SIZE/2, the frame cadence)
const HOP_SIZE: usize = LONG_BLOCK_SIZE / 2;

/// Transform lossy encoder
pub struct TransformEncoder {
    /// Sample rate
    sample_rate: u32,
    /// Number of channels
    channels: u8,
    /// MDCT processor
    mdct: Mdct,
    /// Psychoacoustic model for long blocks (one per channel)
    psy_models: Vec<PsychoacousticModel>,
    /// Psychoacoustic model for short blocks (one per channel)
    short_psy_models: Vec<PsychoacousticModel>,
    /// Quality setting (0.0 = lowest, 1.0 = transparent)
    quality: f32,
}

/// Encoded frame data
#[derive(Debug, Clone)]
pub struct TransformFrame {
    /// Quantized MDCT coefficients per channel (as i16)
    pub coefficients: Vec<Vec<i16>>,
    /// Scale factors per Bark band per channel
    pub scale_factors: Vec<Vec<f32>>,
    /// Block size used
    pub block_size: BlockSize,
    /// Number of samples this frame represents (after overlap-add)
    pub num_samples: usize,
}

impl TransformEncoder {
    /// Create a new transform encoder
    pub fn new(sample_rate: u32, channels: u8, quality: f32) -> Self {
        let mdct = Mdct::new(channels as usize, WindowType::Vorbis);
        let psy_models: Vec<_> = (0..channels)
            .map(|_| PsychoacousticModel::new(sample_rate, LONG_BLOCK_SIZE))
            .collect();
        let short_psy_models: Vec<_> = (0..channels)
            .map(|_| PsychoacousticModel::new(sample_rate, SHORT_BLOCK_SIZE))
            .collect();

        Self {
            sample_rate,
            channels,
            mdct,
            psy_models,
            short_psy_models,
            quality: quality.clamp(0.0, 1.0),
        }
    }

    /// Set quality (0.0-1.0)
    pub fn set_quality(&mut self, quality: f32) {
        self.quality = quality.clamp(0.0, 1.0);
    }

    /// Encode a frame of audio
    /// Input: interleaved samples covering one frame grid (block_size * channels)
    /// Returns encoded frame
    pub fn encode_frame(&mut self, samples: &[f32], block_size: BlockSize) -> TransformFrame {
        let frame_input = block_size.frame_input_size();

        // Deinterleave channels
        let mut channel_data: Vec<Vec<f32>> = (0..self.channels as usize)
            .map(|_| Vec::with_capacity(samples.len() / self.channels as usize))
            .collect();

        for (i, &s) in samples.iter().enumerate() {
            channel_data[i % self.channels as usize].push(s);
        }

        let mut all_coefficients = Vec::with_capacity(self.channels as usize);
        let mut all_scale_factors = Vec::with_capacity(self.channels as usize);

        for (ch, data) in channel_data.iter().enumerate() {
            // Pad to the frame grid if needed
            let mut frame_data = data.clone();
            if frame_data.len() < frame_input {
                frame_data.resize(frame_input, 0.0);
            }

            // MDCT transform
            let coeffs = self.mdct.forward(&frame_data, block_size);

            // Quantize based on perceptual importance
            let (quantized, scale_factors) = if block_size.is_short_group() {
                self.quantize_short_group(&coeffs, ch)
            } else {
                self.quantize_long_block(&coeffs, ch)
            };

            all_coefficients.push(quantized);
            all_scale_factors.push(scale_factors);
        }

        TransformFrame {
            coefficients: all_coefficients,
            scale_factors: all_scale_factors,
            block_size,
            num_samples: block_size.frame_coefficients(),
        }
    }

    /// Quantize a long-block coefficient set (Long/Start/Stop) per channel
    fn quantize_long_block(&mut self, coeffs: &[f32], ch: usize) -> (Vec<i16>, Vec<f32>) {
        // Psychoacoustic analysis
        let smr = self.psy_models[ch].calculate_smr(coeffs);

        // Bit budget grows with quality: 1..16 nominal bits per coefficient.
        let bits_per_coeff = 1.0 + self.quality * 15.0;
        let total_bits = (coeffs.len() as f32 * bits_per_coeff) as usize;
        let allocation = self.psy_models[ch].allocate_bits(&smr, total_bits);

        self.quantize_coefficients(coeffs, &smr, &allocation)
    }

    /// Quantize a short-group frame (8 short blocks) with a shared scale-factor set.
    fn quantize_short_group(&mut self, coeffs: &[f32], ch: usize) -> (Vec<i16>, Vec<f32>) {
        let coeffs_per_window = SHORT_BLOCK_SIZE / 2;
        let bits_per_coeff = 1.0 + self.quality * 15.0;
        let per_window_bits = (coeffs_per_window as f32 * bits_per_coeff) as usize;

        let mut smr = Vec::with_capacity(coeffs.len());
        let mut allocation = Vec::with_capacity(coeffs.len());
        for w in 0..SHORTS_PER_GROUP {
            let window_coeffs = &coeffs[w * coeffs_per_window..(w + 1) * coeffs_per_window];
            let model = &mut self.short_psy_models[ch];
            let window_smr = model.calculate_smr(window_coeffs);
            smr.extend(window_smr.iter());
            let window_allocation = model.allocate_bits(&window_smr, per_window_bits);
            allocation.extend(window_allocation.iter());
        }

        let freq_resolution = self.sample_rate as f32 / SHORT_BLOCK_SIZE as f32;
        let scale_factors = self.compute_band_scale_factors(
            coeffs,
            &allocation,
            coeffs_per_window,
            freq_resolution,
        );
        let smr_threshold = self.smr_threshold();
        let quantized = self.quantize_with_scale(
            coeffs,
            &smr,
            &scale_factors,
            coeffs_per_window,
            freq_resolution,
            smr_threshold,
        );

        (quantized, scale_factors)
    }

    /// Quantize MDCT coefficients based on SMR and per-band bit allocation
    pub fn quantize_coefficients(
        &self,
        coeffs: &[f32],
        smr: &[f32],
        allocation: &[u8],
    ) -> (Vec<i16>, Vec<f32>) {
        let freq_resolution = self.sample_rate as f32 / LONG_BLOCK_SIZE as f32;
        let scale_factors = self.compute_band_scale_factors(
            coeffs,
            allocation,
            LONG_BLOCK_SIZE / 2,
            freq_resolution,
        );
        let smr_threshold = self.smr_threshold();
        let quantized = self.quantize_with_scale(
            coeffs,
            smr,
            &scale_factors,
            LONG_BLOCK_SIZE / 2,
            freq_resolution,
            smr_threshold,
        );

        (quantized, scale_factors)
    }

    /// Frequency of MDCT coefficient `k` when a frame holds `coeffs_per_window`
    /// coefficients per analysis window.
    fn freq_for_coeff(k: usize, coeffs_per_window: usize, freq_resolution: f32) -> f32 {
        let bin = k % coeffs_per_window;
        (bin as f32 + 0.5) * freq_resolution
    }

    /// Per-band scale factors computed from coefficient magnitudes and the
    /// per-coefficient bit allocation
    fn compute_band_scale_factors(
        &self,
        coeffs: &[f32],
        allocation: &[u8],
        coeffs_per_window: usize,
        freq_resolution: f32,
    ) -> Vec<f32> {
        // Calculate scale factors per Bark band
        let mut band_max = [0.0f32; NUM_BARK_BANDS];
        for (k, &c) in coeffs.iter().enumerate() {
            let freq = Self::freq_for_coeff(k, coeffs_per_window, freq_resolution);
            let band = PsychoacousticModel::freq_to_bark_band(freq);
            band_max[band] = band_max[band].max(c.abs());
        }

        // Per-band bit allocation from the psychoacoustic model
        let mut band_bits_max = [0u8; NUM_BARK_BANDS];
        for (k, &bits) in allocation.iter().enumerate() {
            let freq = Self::freq_for_coeff(k, coeffs_per_window, freq_resolution);
            let band = PsychoacousticModel::freq_to_bark_band(freq);
            band_bits_max[band] = band_bits_max[band].max(bits);
        }
        // The most-precisely-allocated band in this frame is the reference.
        let max_bits = band_bits_max.iter().copied().max().unwrap_or(0);

        // Calculate scale factors (to fit i16 range without clipping)
        let mut scale_factors = vec![1.0f32; NUM_BARK_BANDS];
        for (sf, &max_val) in scale_factors.iter_mut().zip(band_max.iter()) {
            if max_val > 1e-10 {
                // Use 30000 as max to leave some headroom
                *sf = 30000.0 / max_val;
            }
        }

        // Refine per-band precision
        if max_bits > 0 {
            for (sf, &bits) in scale_factors.iter_mut().zip(band_bits_max.iter()) {
                let weight = 0.25 + 0.75 * (bits as f32 / max_bits as f32);
                *sf *= weight;
            }
        }

        scale_factors
    }

    /// Quality-dependent masking threshold (dB). At max quality keep everything.
    fn smr_threshold(&self) -> f32 {
        if self.quality >= 0.99 {
            -100.0
        } else {
            // Exponential decay from 0 dB at quality=0 to -60 dB at quality=1
            let t = (1.0 - self.quality).max(0.001);
            -60.0 * (1.0 - libm::powf(t, 0.5))
        }
    }

    /// Quantize coefficients above the masking threshold against per-band scale factors
    fn quantize_with_scale(
        &self,
        coeffs: &[f32],
        smr: &[f32],
        scale_factors: &[f32],
        coeffs_per_window: usize,
        freq_resolution: f32,
        smr_threshold: f32,
    ) -> Vec<i16> {
        let mut quantized = vec![0i16; coeffs.len()];

        for (k, (q, &c)) in quantized.iter_mut().zip(coeffs.iter()).enumerate() {
            let freq = Self::freq_for_coeff(k, coeffs_per_window, freq_resolution);
            let band = PsychoacousticModel::freq_to_bark_band(freq);

            if smr[k] > smr_threshold {
                // Above masking threshold, quantize with appropriate precision
                let scaled = c * scale_factors[band];
                *q = libm::roundf(scaled).clamp(I16_MIN_F32, I16_MAX_F32) as i16;
            }
            // else: below threshold, leave as 0
        }

        quantized
    }

    /// Reset encoder state
    pub fn reset(&mut self) {
        self.mdct.reset();
        for model in &mut self.psy_models {
            model.reset();
        }
        for model in &mut self.short_psy_models {
            model.reset();
        }
    }

    /// Detect transient hops and build the BlockSize plan for an entire buffer.
    fn plan_block_types(&self, mono: &[f32], num_hops: usize) -> Vec<BlockSize> {
        let mut plan = vec![BlockSize::Long; num_hops];

        for h in 1..num_hops {
            // Hop 0 is always Long
            if self.hop_has_transient(mono, h) {
                plan[h] = BlockSize::Short;
            }
        }

        // Merge short runs and insert Start/Stop transitions.
        let mut h = 0;
        while h < num_hops {
            if plan[h] == BlockSize::Short {
                let mut run_end = h;
                while run_end + 1 < num_hops && plan[run_end + 1] == BlockSize::Short {
                    run_end += 1;
                }
                // The frame before the first short group transitions with a
                // Start window
                if h > 0 {
                    plan[h - 1] = BlockSize::Start;
                    plan[run_end] = BlockSize::Stop;
                }
                h = run_end + 1;
            } else {
                h += 1;
            }
        }

        plan
    }

    /// Whether an attack sits in hop `h`'s short-window guard region.
    fn hop_has_transient(&self, mono: &[f32], h: usize) -> bool {
        let grid_start = h * HOP_SIZE;

        // Per-window RMS energy over the guard region
        let mut window_energy = [0.0f32; SHORTS_PER_GROUP];
        for w in 0..SHORTS_PER_GROUP {
            let off = grid_start + SHORT_GROUP_OFFSET + w * (SHORT_BLOCK_SIZE / 2);
            let mut sum = 0.0f32;
            for i in 0..SHORT_BLOCK_SIZE {
                let v = mono[off + i];
                sum += v * v;
            }
            window_energy[w] = sum / SHORT_BLOCK_SIZE as f32;
        }

        // Baseline floor derived from the whole grid's average energy
        let mut grid_sum = 0.0f32;
        for i in 0..LONG_BLOCK_SIZE {
            let v = mono[grid_start + i];
            grid_sum += v * v;
        }
        let floor = grid_sum / LONG_BLOCK_SIZE as f32 * DETECTOR_FLOOR_FRACTION;

        // An attack is a window whose energy jumps well above its predecessor
        for w in 0..SHORTS_PER_GROUP {
            let baseline = window_energy[w.saturating_sub(1)].max(floor);
            if window_energy[w] > ATTACK_RATIO * baseline {
                return true;
            }
        }

        false
    }

    /// Encode audio samples to flo file format
    ///
    /// This produces a complete flo file with transform-based frames
    pub fn encode_to_flo(&mut self, samples: &[f32], metadata: &[u8]) -> crate::FloResult<Vec<u8>> {
        let block_samples = LONG_BLOCK_SIZE;
        let hop_size = HOP_SIZE;

        // For proper MDCT overlap-add reconstruction, we need:
        // - A priming frame at the start (silence) to initialize overlap buffer
        // - Proper number of frames to cover all samples
        let num_samples_per_channel = samples.len() / self.channels as usize;

        // Add hop_size samples of pre-roll (zeros) at start for proper reconstruction
        let pre_roll = hop_size;
        let total_samples = num_samples_per_channel + pre_roll;
        let num_hops = total_samples.div_ceil(hop_size);
        let total_samples_needed = (num_hops + 1) * hop_size;

        // Create padded buffer with pre-roll zeros at start
        let mut padded = vec![0.0f32; total_samples_needed * self.channels as usize];

        // Copy original samples after pre-roll
        for ch in 0..self.channels as usize {
            for i in 0..num_samples_per_channel.min(total_samples_needed - pre_roll) {
                let src_idx = i * self.channels as usize + ch;
                let dst_idx = (i + pre_roll) * self.channels as usize + ch;
                if src_idx < samples.len() && dst_idx < padded.len() {
                    padded[dst_idx] = samples[src_idx];
                }
            }
        }

        // Mono mix for transient detection over the whole buffer
        let mono: Vec<f32> = (0..total_samples_needed)
            .map(|i| {
                let mut sum = 0.0f32;
                for ch in 0..self.channels as usize {
                    sum += padded[i * self.channels as usize + ch];
                }
                sum / self.channels as f32
            })
            .collect();

        // Block-switching plan with look-ahead over the whole buffer
        let plan = self.plan_block_types(&mono, num_hops);

        // Encode frames
        let mut encoded_frames: Vec<Frame> = Vec::new();

        // Process overlapping blocks
        for hop_idx in 0..num_hops {
            let start = hop_idx * hop_size * self.channels as usize;
            let end = start + block_samples * self.channels as usize;

            if end > padded.len() {
                break;
            }

            let frame_samples = &padded[start..end];
            let transform_frame = self.encode_frame(frame_samples, plan[hop_idx]);

            // Serialize the transform frame
            let frame_data = serialize_frame(&transform_frame);

            // Create a flo Frame with transform type
            let mut flo_frame = Frame::new(FrameType::Transform as u8, hop_size as u32);
            flo_frame.channels.push(ChannelData {
                predictor_coeffs: vec![],
                shift_bits: 0,
                residual_encoding: ResidualEncoding::Raw,
                rice_parameter: 0,
                residuals: frame_data,
            });

            encoded_frames.push(flo_frame);
        }

        // Write using the standard Writer
        let writer = crate::Writer::new();
        writer.write_ex(
            self.sample_rate,
            self.channels,
            16,                                              // bit_depth for lossy
            5,    // compression level (not used for transform)
            true, // is_lossy
            (libm::roundf(self.quality * 4.0) as u8).min(4), // quality as 0-4
            &encoded_frames,
            metadata,
        )
    }
}

/// Serialize a transform frame to bytes (optimized)
pub fn serialize_frame(frame: &TransformFrame) -> Vec<u8> {
    let mut data = Vec::new();

    // Block size (1 byte)
    data.push(match frame.block_size {
        BlockSize::Long => 0,
        BlockSize::Short => 1,
        BlockSize::Start => 2,
        BlockSize::Stop => 3,
    });

    // Number of channels (1 byte)
    data.push(frame.coefficients.len() as u8);

    // Scale factors per channel (25 bands * 2 bytes * channels)
    // Encode as log scale u16 instead of f32 to save space
    for sf in &frame.scale_factors {
        for &s in sf {
            // Convert to log scale: log2(sf) * 256 + 32768
            let log_sf = if s > 1e-10 {
                ((libm::log2f(s) * 256.0) + 32768.0).clamp(0.0, 65535.0) as u16
            } else {
                0
            };
            data.extend_from_slice(&log_sf.to_le_bytes());
        }
    }

    // Coefficients per channel (sparse encoding for mostly-zeros)
    for quantized in &frame.coefficients {
        let encoded = serialize_sparse(quantized);
        let len = encoded.len() as u32;
        data.extend_from_slice(&len.to_le_bytes());
        data.extend_from_slice(&encoded);
    }

    data
}

/// Encode coefficients using sparse run-length encoding
/// Format: [zero_count_varint] [non_zero_count] [values...]
pub fn serialize_sparse(coeffs: &[i16]) -> Vec<u8> {
    let mut output = Vec::new();
    let mut i = 0;

    while i < coeffs.len() {
        // Count leading zeros
        let zero_start = i;
        while i < coeffs.len() && coeffs[i] == 0 {
            i += 1;
        }
        let zero_count = i - zero_start;

        // Count non-zeros (up to 255)
        let non_zero_start = i;
        while i < coeffs.len() && coeffs[i] != 0 && (i - non_zero_start) < 255 {
            i += 1;
        }
        let non_zero_count = i - non_zero_start;

        // Encode run: [zero_count_varint] [non_zero_count] [values...]
        encode_varint(&mut output, zero_count as u32);
        output.push(non_zero_count as u8);

        // Write non-zero values as i16 LE
        for j in non_zero_start..non_zero_start + non_zero_count {
            output.extend_from_slice(&coeffs[j].to_le_bytes());
        }
    }

    output
}

/// Encode a u32 as varint (1-5 bytes)
fn encode_varint(output: &mut Vec<u8>, mut value: u32) {
    loop {
        let mut byte = (value & 0x7F) as u8;
        value >>= 7;
        if value != 0 {
            byte |= 0x80;
        }
        output.push(byte);
        if value == 0 {
            break;
        }
    }
}
