// Full disclosure, this code is inspired by Symphonia's MDCT implementation,
// and parts of FFmpeg as well.

use crate::dsp::{Complex32, DefaultPlanner, Fft, FftPlanner};
use alloc::boxed::Box;
use alloc::vec;
use alloc::vec::Vec;
use core::f32::consts::PI;

/// Window types for MDCT
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum WindowType {
    /// Sine window - simple, good for most content
    Sine,
    /// Kaiser-Bessel Derived - better frequency selectivity
    KaiserBesselDerived,
    /// Vorbis window - optimized for audio
    Vorbis,
}

/// Long block window size in samples
pub const LONG_BLOCK_SIZE: usize = 2048;
/// Short block window size in samples
pub const SHORT_BLOCK_SIZE: usize = 256;
/// Number of short windows grouped into one short-block sequence
pub const SHORTS_PER_GROUP: usize = 8;
/// Offset of the first short window within the 2048-sample analysis grid.
pub const SHORT_GROUP_OFFSET: usize = 448;
/// Number of MDCT coefficients carried by one frame for every block size.
pub const FRAME_COEFFICIENTS: usize = LONG_BLOCK_SIZE / 2;

/// MDCT block sizes
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BlockSize {
    /// Long block (2048 samples) - good frequency resolution for stationary signals
    Long,
    /// Short block (256 samples) - good time resolution for transients
    Short,
    /// Start block - transition from long to short
    Start,
    /// Stop block - transition from short to long
    Stop,
}

impl BlockSize {
    /// Get the number of samples for the underlying transform window
    pub fn samples(self) -> usize {
        match self {
            BlockSize::Long | BlockSize::Start | BlockSize::Stop => LONG_BLOCK_SIZE,
            BlockSize::Short => SHORT_BLOCK_SIZE,
        }
    }

    /// Get the number of MDCT coefficients for the underlying window (N/2)
    pub fn coefficients(self) -> usize {
        self.samples() / 2
    }

    /// Get the number of input samples analyzed per frame.
    pub fn frame_input_size(self) -> usize {
        LONG_BLOCK_SIZE
    }

    /// Get the number of MDCT coefficients serialized per frame
    pub fn frame_coefficients(self) -> usize {
        match self {
            BlockSize::Short => SHORTS_PER_GROUP * (SHORT_BLOCK_SIZE / 2),
            _ => LONG_BLOCK_SIZE / 2,
        }
    }

    /// Whether this block type represents a group of short windows
    pub fn is_short_group(self) -> bool {
        matches!(self, BlockSize::Short)
    }
}

/// FFT-based MDCT transform for a specific window size
struct MdctTransform {
    /// Window size (N)
    n: usize,
    /// Number of coefficients (N/2)
    n2: usize,
    /// FFT size (N/4)
    n4: usize,
    /// Window function
    window: Vec<f32>,
    /// Forward FFT
    fft: Box<dyn Fft>,
    /// Twiddle factors: e^(i*π/n2 * (k + 1/8))
    twiddle: Vec<Complex32>,
}

impl MdctTransform {
    fn new(window_size: usize, window_type: WindowType) -> Self {
        let window = Self::build_window(window_size, window_type);
        Self::from_window(window_size, window)
    }

    /// Build the window table for a given window type and size
    fn build_window(n: usize, window_type: WindowType) -> Vec<f32> {
        match window_type {
            WindowType::Sine => Self::sine_window(n),
            WindowType::KaiserBesselDerived => Self::kbd_window(n, 4.0),
            WindowType::Vorbis => Self::vorbis_window(n),
        }
    }

    /// Create a transform with an explicit window table
    fn from_window(window_size: usize, window: Vec<f32>) -> Self {
        let n = window_size;
        let n2 = n / 2;
        let n4 = n / 4;

        // Create FFT planner
        let mut planner = DefaultPlanner::new();
        let fft = planner.plan_fft_forward(n4);

        // Pre-compute twiddle factors
        let twiddle: Vec<Complex32> = (0..n4)
            .map(|k| {
                let theta = PI / n2 as f32 * (k as f32 + 0.125);
                Complex32::new(libm::cosf(theta), libm::sinf(theta))
            })
            .collect();

        Self {
            n,
            n2,
            n4,
            window,
            fft,
            twiddle,
        }
    }

    /// Sine window: w[n] = sin(π(n+0.5)/N)
    fn sine_window(n: usize) -> Vec<f32> {
        (0..n)
            .map(|i| libm::sinf(PI * (i as f32 + 0.5) / n as f32))
            .collect()
    }

    /// Vorbis window: sin(π/2 * sin²(π(n+0.5)/N))
    fn vorbis_window(n: usize) -> Vec<f32> {
        (0..n)
            .map(|i| {
                let x = libm::sinf(PI * (i as f32 + 0.5) / n as f32);
                libm::sinf(PI / 2.0 * x * x)
            })
            .collect()
    }

    /// Kaiser-Bessel Derived window
    fn kbd_window(n: usize, alpha: f32) -> Vec<f32> {
        let half = n / 2;

        // Compute Kaiser window for first half
        let kaiser: Vec<f32> = (0..=half)
            .map(|i| {
                let t = 2.0 * i as f32 / half as f32 - 1.0;
                Self::bessel_i0(PI * alpha * libm::sqrtf(1.0 - t * t))
            })
            .collect();

        // Cumulative sum
        let mut cumsum = vec![0.0f32; half + 1];
        cumsum[0] = kaiser[0];
        for i in 1..=half {
            cumsum[i] = cumsum[i - 1] + kaiser[i];
        }
        let total = cumsum[half];

        // Build KBD window
        let mut window = vec![0.0f32; n];
        for i in 0..half {
            window[i] = libm::sqrtf(cumsum[i] / total);
            window[n - 1 - i] = window[i];
        }

        window
    }

    /// Modified Bessel function I0 (for KBD window)
    fn bessel_i0(x: f32) -> f32 {
        let mut sum = 1.0f32;
        let mut term = 1.0f32;
        let x_sq = x * x / 4.0;

        for k in 1..20 {
            term *= x_sq / (k * k) as f32;
            sum += term;
            if term < 1e-10 {
                break;
            }
        }

        sum
    }

    /// Forward MDCT using FFT - O(N log N)
    ///
    /// Based on FFmpeg's ff_mdct_calc_c algorithm.
    fn forward(&self, samples: &[f32]) -> Vec<f32> {
        let n = self.n;
        let n2 = self.n2;
        let n4 = self.n4;
        let n8 = n4 / 2;
        let n3 = 3 * n4;

        // Apply window
        let x: Vec<f32> = samples
            .iter()
            .zip(self.window.iter())
            .map(|(&s, &w)| s * w)
            .collect();

        // Pre-rotation: fold N windowed samples into N/4 complex FFT inputs
        let mut z: Vec<Complex32> = vec![Complex32::new(0.0, 0.0); n4];

        for i in 0..n8 {
            // First butterfly
            let re = -x[2 * i + n3] - x[n3 - 1 - 2 * i];
            let im = -x[n4 + 2 * i] + x[n4 - 1 - 2 * i];

            let w = &self.twiddle[i];
            z[i] = Complex32::new(-re * w.re - im * w.im, re * w.im - im * w.re);

            // Second butterfly
            let re2 = x[2 * i] - x[n2 - 1 - 2 * i];
            let im2 = -x[n2 + 2 * i] - x[n - 1 - 2 * i];

            let w2 = &self.twiddle[n8 + i];
            z[n8 + i] = Complex32::new(-re2 * w2.re - im2 * w2.im, re2 * w2.im - im2 * w2.re);
        }

        // Forward FFT
        self.fft.process(&mut z);

        // Post-rotation: extract N/2 real coefficients
        let mut output = vec![0.0; n2];

        for i in 0..n8 {
            let idx1 = n8 - i - 1;
            let idx2 = n8 + i;

            let w1 = &self.twiddle[idx1];
            let z1 = z[idx1];
            let i1 = -z1.re * w1.im + z1.im * w1.re;
            let r0 = -z1.re * w1.re - z1.im * w1.im;

            let w2 = &self.twiddle[idx2];
            let z2 = z[idx2];
            let i0 = -z2.re * w2.im + z2.im * w2.re;
            let r1 = -z2.re * w2.re - z2.im * w2.im;

            output[2 * idx1] = r0;
            output[2 * idx1 + 1] = i0;
            output[2 * idx2] = r1;
            output[2 * idx2 + 1] = i1;
        }

        output
    }

    /// Inverse MDCT using FFT - O(N log N)
    ///
    /// Based on Symphonia's IMDCT implementation.
    fn inverse(&self, spec: &[f32]) -> Vec<f32> {
        let n = self.n;
        let n2 = self.n2;
        let n4 = self.n4;
        let n8 = n4 / 2;

        // Pre-FFT twiddling
        let mut z: Vec<Complex32> = Vec::with_capacity(n4);

        for i in 0..n4 {
            let even = spec[i * 2];
            let odd = -spec[n2 - 1 - i * 2];

            let w = &self.twiddle[i];
            z.push(Complex32::new(
                odd * w.im - even * w.re,
                odd * w.re + even * w.im,
            ));
        }

        // Apply forward FFT
        self.fft.process(&mut z);

        // Post-FFT twiddling and unfolding
        let mut output = vec![0.0; n];
        let scale = 2.0 / n2 as f32;

        // First half of FFT output
        for i in 0..n8 {
            let w = &self.twiddle[i];
            let val_re = w.re * z[i].re + w.im * z[i].im;
            let val_im = w.im * z[i].re - w.re * z[i].im;

            let fi = 2 * i;
            let ri = n4 - 1 - 2 * i;

            output[ri] = -val_im * scale * self.window[ri];
            output[n4 + fi] = val_im * scale * self.window[n4 + fi];
            output[n2 + ri] = val_re * scale * self.window[n2 + ri];
            output[n2 + n4 + fi] = val_re * scale * self.window[n2 + n4 + fi];
        }

        // Second half of FFT output
        for i in 0..n8 {
            let idx = n8 + i;
            let w = &self.twiddle[idx];
            let val_re = w.re * z[idx].re + w.im * z[idx].im;
            let val_im = w.im * z[idx].re - w.re * z[idx].im;

            let fi = 2 * i;
            let ri = n4 - 1 - 2 * i;

            output[fi] = -val_re * scale * self.window[fi];
            output[n4 + ri] = val_re * scale * self.window[n4 + ri];
            output[n2 + fi] = val_im * scale * self.window[n2 + fi];
            output[n2 + n4 + ri] = val_im * scale * self.window[n2 + n4 + ri];
        }

        output
    }
}

/// MDCT processor with pre-computed windows and FFT plans
///
/// Provides O(N log N) MDCT/IMDCT transforms using FFT acceleration, plus
/// overlap-add synthesis across long, short-group, Start, and Stop blocks.
pub struct Mdct {
    /// Long block transform (2048 samples)
    long_transform: MdctTransform,
    /// Short block transform (256 samples)
    short_transform: MdctTransform,
    /// Start-block transform (2048 samples with the long-to-short window)
    start_transform: MdctTransform,
    /// Stop-block transform (2048 samples with the short-to-long window)
    stop_transform: MdctTransform,
    /// Previous frame's windowed samples for overlap-add (per channel)
    overlap_buffer: Vec<Vec<f32>>,
    /// Number of channels
    channels: usize,
}

impl Mdct {
    /// Create a new MDCT processor
    pub fn new(channels: usize, window_type: WindowType) -> Self {
        let long_window = MdctTransform::build_window(LONG_BLOCK_SIZE, window_type);
        let short_window = MdctTransform::build_window(SHORT_BLOCK_SIZE, window_type);

        let start_transform = MdctTransform::from_window(
            LONG_BLOCK_SIZE,
            Self::start_window(&long_window, &short_window),
        );
        let stop_transform = MdctTransform::from_window(
            LONG_BLOCK_SIZE,
            Self::stop_window(&long_window, &short_window),
        );

        // Initialize overlap buffers (N/2 samples per channel)
        let overlap_buffer = vec![vec![0.0f32; LONG_BLOCK_SIZE / 2]; channels];

        Self {
            long_transform: MdctTransform::from_window(LONG_BLOCK_SIZE, long_window),
            short_transform: MdctTransform::from_window(SHORT_BLOCK_SIZE, short_window),
            start_transform,
            stop_transform,
            overlap_buffer,
            channels,
        }
    }

    /// Build the long-to-short (Start) window from the base windows.
    pub fn start_window(long_win: &[f32], short_win: &[f32]) -> Vec<f32> {
        debug_assert_eq!(long_win.len(), LONG_BLOCK_SIZE);
        debug_assert_eq!(short_win.len(), SHORT_BLOCK_SIZE);
        let mut w = vec![0.0f32; LONG_BLOCK_SIZE];
        w[..LONG_BLOCK_SIZE / 2].copy_from_slice(&long_win[..LONG_BLOCK_SIZE / 2]);
        w[LONG_BLOCK_SIZE / 2..1472].fill(1.0);
        for i in 0..SHORT_BLOCK_SIZE / 2 {
            w[1472 + i] = short_win[SHORT_BLOCK_SIZE / 2 + i];
        }
        w
    }

    /// Build the short-to-long (Stop) window from the base windows.
    pub fn stop_window(long_win: &[f32], short_win: &[f32]) -> Vec<f32> {
        debug_assert_eq!(long_win.len(), LONG_BLOCK_SIZE);
        debug_assert_eq!(short_win.len(), SHORT_BLOCK_SIZE);
        let mut w = vec![0.0f32; LONG_BLOCK_SIZE];
        w[SHORT_GROUP_OFFSET..SHORT_GROUP_OFFSET + SHORT_BLOCK_SIZE / 2]
            .copy_from_slice(&short_win[..SHORT_BLOCK_SIZE / 2]);
        w[576..LONG_BLOCK_SIZE / 2].fill(1.0);
        for i in 0..LONG_BLOCK_SIZE / 2 {
            w[LONG_BLOCK_SIZE / 2 + i] = long_win[1023 - i];
        }
        w
    }

    /// Sine window: w[n] = sin(π(n+0.5)/N)
    pub fn sine_window(n: usize) -> Vec<f32> {
        MdctTransform::sine_window(n)
    }

    /// Vorbis window: sin(π/2 * sin²(π(n+0.5)/N))
    pub fn vorbis_window(n: usize) -> Vec<f32> {
        MdctTransform::vorbis_window(n)
    }

    /// Forward MDCT: N time samples -> N/2 frequency coefficients
    ///
    /// X[k] = Σ x[n] * w[n] * cos(π/N * (n + 0.5 + N/2) * (k + 0.5))
    pub fn forward(&self, samples: &[f32], block_size: BlockSize) -> Vec<f32> {
        assert!(
            samples.len() >= block_size.frame_input_size(),
            "Not enough samples for MDCT"
        );

        match block_size {
            BlockSize::Long => self.long_transform.forward(&samples[..LONG_BLOCK_SIZE]),
            BlockSize::Start => self.start_transform.forward(&samples[..LONG_BLOCK_SIZE]),
            BlockSize::Stop => self.stop_transform.forward(&samples[..LONG_BLOCK_SIZE]),
            BlockSize::Short => {
                // The short group analyzes eight windows tiled across the grid's
                // guard region, producing SHORTS_PER_GROUP short MDCT blocks.
                let mut coeffs = Vec::with_capacity(FRAME_COEFFICIENTS);
                for w in 0..SHORTS_PER_GROUP {
                    let start = SHORT_GROUP_OFFSET + w * (SHORT_BLOCK_SIZE / 2);
                    coeffs.extend(
                        self.short_transform
                            .forward(&samples[start..start + SHORT_BLOCK_SIZE]),
                    );
                }
                coeffs
            }
        }
    }

    /// Inverse MDCT: N/2 frequency coefficients -> N time samples
    ///
    /// y[n] = 2/N * Σ(k=0 to N-1) X[k] * cos(π/N * (n + 0.5 + N/2) * (k + 0.5))
    pub fn inverse(&self, coeffs: &[f32], block_size: BlockSize) -> Vec<f32> {
        match block_size {
            BlockSize::Long => {
                assert!(
                    coeffs.len() >= LONG_BLOCK_SIZE / 2,
                    "Not enough coefficients for IMDCT"
                );
                self.long_transform.inverse(&coeffs[..LONG_BLOCK_SIZE / 2])
            }
            BlockSize::Start => {
                assert!(
                    coeffs.len() >= LONG_BLOCK_SIZE / 2,
                    "Not enough coefficients for IMDCT"
                );
                self.start_transform.inverse(&coeffs[..LONG_BLOCK_SIZE / 2])
            }
            BlockSize::Stop => {
                assert!(
                    coeffs.len() >= LONG_BLOCK_SIZE / 2,
                    "Not enough coefficients for IMDCT"
                );
                self.stop_transform.inverse(&coeffs[..LONG_BLOCK_SIZE / 2])
            }
            BlockSize::Short => {
                // Each group frame synthesizes onto the full 2048 grid by
                // summing the eight overlapping short windows at their offsets.
                assert!(
                    coeffs.len() >= SHORTS_PER_GROUP * (SHORT_BLOCK_SIZE / 2),
                    "Not enough coefficients for IMDCT"
                );
                let mut time = vec![0.0f32; LONG_BLOCK_SIZE];
                for w in 0..SHORTS_PER_GROUP {
                    let off = SHORT_GROUP_OFFSET + w * (SHORT_BLOCK_SIZE / 2);
                    let blk = self.short_transform.inverse(
                        &coeffs[w * (SHORT_BLOCK_SIZE / 2)..(w + 1) * (SHORT_BLOCK_SIZE / 2)],
                    );
                    for (j, &v) in blk.iter().enumerate() {
                        time[off + j] += v;
                    }
                }
                time
            }
        }
    }

    /// Process a frame with overlap-add for perfect reconstruction.
    /// Returns N/2 output samples.
    pub fn process_frame(
        &mut self,
        samples: &[f32],
        channel: usize,
        block_size: BlockSize,
    ) -> (Vec<f32>, Vec<f32>) {
        // Forward MDCT
        let coeffs = self.forward(samples, block_size);

        // Inverse MDCT (for testing/verification)
        let reconstructed = self.inverse(&coeffs, block_size);

        // Overlap-add with previous frame
        let n2 = LONG_BLOCK_SIZE / 2;
        let mut output = vec![0.0f32; n2];
        for i in 0..n2 {
            output[i] = reconstructed[i] + self.overlap_buffer[channel][i];
        }

        // Store second half for next frame's overlap
        self.overlap_buffer[channel].copy_from_slice(&reconstructed[n2..n2 + n2]);

        (coeffs, output)
    }

    /// Reset overlap buffers (e.g., for seeking)
    pub fn reset(&mut self) {
        for buf in &mut self.overlap_buffer {
            buf.fill(0.0);
        }
    }

    /// Encode samples to MDCT coefficients for all channels
    /// Input: interleaved samples [L, R, L, R, ...]
    /// Output: MDCT coefficients per channel
    pub fn analyze(&mut self, samples: &[f32], block_size: BlockSize) -> Vec<Vec<f32>> {
        let n = block_size.frame_input_size();
        let samples_per_channel = samples.len() / self.channels;

        // Deinterleave
        let mut channel_data: Vec<Vec<f32>> = (0..self.channels)
            .map(|_| Vec::with_capacity(samples_per_channel))
            .collect();

        for (i, &s) in samples.iter().enumerate() {
            channel_data[i % self.channels].push(s);
        }

        // MDCT each channel (pad to the full grid when needed)
        let mut all_coeffs = Vec::with_capacity(self.channels);
        for data in &channel_data {
            let mut padded = data.clone();
            padded.resize(n, 0.0);
            let coeffs = self.forward(&padded, block_size);
            all_coeffs.push(coeffs);
        }

        all_coeffs
    }

    /// Synthesize samples from MDCT coefficients with overlap-add
    /// Input: MDCT coefficients per channel
    /// Output: interleaved samples
    pub fn synthesize(&mut self, coeffs: &[Vec<f32>], block_size: BlockSize) -> Vec<f32> {
        let n2 = LONG_BLOCK_SIZE / 2;

        // IMDCT + overlap-add for each channel
        let mut channel_outputs: Vec<Vec<f32>> = Vec::with_capacity(self.channels);

        for (ch, ch_coeffs) in coeffs.iter().enumerate() {
            let reconstructed = self.inverse(ch_coeffs, block_size);

            // Overlap-add
            let mut output = vec![0.0f32; n2];
            for i in 0..n2 {
                output[i] = reconstructed[i] + self.overlap_buffer[ch][i];
            }

            // Store for next frame
            self.overlap_buffer[ch].copy_from_slice(&reconstructed[n2..n2 + n2]);

            channel_outputs.push(output);
        }

        // Interleave
        let mut output = Vec::with_capacity(n2 * self.channels);
        for i in 0..n2 {
            for ch in 0..self.channels {
                output.push(channel_outputs[ch][i]);
            }
        }

        output
    }
}
