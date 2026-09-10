//! rustfft backend

use crate::dsp::{Complex32, Fft, FftDirection, FftPlanner};
use alloc::boxed::Box;
use alloc::sync::Arc;

/// Planner
pub struct RustFftPlanner;

impl FftPlanner for RustFftPlanner {
    fn new() -> Self {
        Self
    }

    fn plan_fft(&mut self, len: usize, direction: FftDirection) -> Box<dyn Fft> {
        let mut planner = rustfft::FftPlanner::new();
        let fft = match direction {
            FftDirection::Forward => planner.plan_fft_forward(len),
            FftDirection::Inverse => planner.plan_fft_inverse(len),
        };
        Box::new(RustFft(fft))
    }
}

/// A `rustfft` plan behind the [`Fft`] trait.
pub struct RustFft(Arc<dyn rustfft::Fft<f32>>);

impl Fft for RustFft {
    fn process(&self, buffer: &mut [Complex32]) {
        self.0.process(buffer);
    }
}
