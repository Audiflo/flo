//! FFT abstraction

use alloc::boxed::Box;

/// A complex sample type shared by all FFT backends.
pub use num_complex::Complex32;

/// Transform direction for a planned FFT.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FftDirection {
    /// Forward transform.
    Forward,
    /// Inverse transform.
    Inverse,
}

/// An in-place FFT plan for a fixed length.
///
/// Implementations may cache precomputed twiddle factors and plans.
pub trait Fft {
    /// Execute the transform in-place over `buffer`.
    ///
    /// `buffer.len()` must equal the size this plan was created for.
    fn process(&self, buffer: &mut [Complex32]);
}

/// Factory for [`Fft`] plans.
pub trait FftPlanner {
    /// Create a new planner.
    fn new() -> Self;
    /// Plan an FFT of `len` complex samples in the given direction.
    fn plan_fft(&mut self, len: usize, direction: FftDirection) -> Box<dyn Fft>;
    /// Largest FFT length this backend can plan.
    fn max_supported_len(&self) -> usize;
    /// Plan a forward FFT of `len` complex samples.
    fn plan_fft_forward(&mut self, len: usize) -> Box<dyn Fft> {
        self.plan_fft(len, FftDirection::Forward)
    }
    /// Plan an inverse FFT of `len` complex samples.
    fn plan_fft_inverse(&mut self, len: usize) -> Box<dyn Fft> {
        self.plan_fft(len, FftDirection::Inverse)
    }
}
