//! microfft backend

use crate::dsp::{Complex32, Fft, FftDirection, FftPlanner};
use alloc::boxed::Box;

/// Planner
pub struct MicroFftPlanner;

impl FftPlanner for MicroFftPlanner {
    fn new() -> Self {
        Self
    }

    fn plan_fft(&mut self, len: usize, direction: FftDirection) -> Box<dyn Fft> {
        Box::new(MicroFft { len, direction })
    }

    /// microfft ships fixed-length transforms for 4..=512 only.
    fn max_supported_len(&self) -> usize {
        512
    }
}

/// A microfft plan behind the [`Fft`] trait.
pub struct MicroFft {
    len: usize,
    direction: FftDirection,
}

impl Fft for MicroFft {
    fn process(&self, buffer: &mut [Complex32]) {
        fn run<const N: usize>(
            transform: fn(&mut [Complex32; N]) -> &mut [Complex32; N],
            buffer: &mut [Complex32],
        ) {
            transform(
                buffer
                    .try_into()
                    .expect("microfft: FFT buffer size mismatch"),
            );
        }

        use FftDirection::{Forward, Inverse};

        match (self.len, self.direction) {
            (4, Forward) => run(microfft::complex::cfft_4, buffer),
            (8, Forward) => run(microfft::complex::cfft_8, buffer),
            (16, Forward) => run(microfft::complex::cfft_16, buffer),
            (32, Forward) => run(microfft::complex::cfft_32, buffer),
            (64, Forward) => run(microfft::complex::cfft_64, buffer),
            (128, Forward) => run(microfft::complex::cfft_128, buffer),
            (256, Forward) => run(microfft::complex::cfft_256, buffer),
            (512, Forward) => run(microfft::complex::cfft_512, buffer),
            (4, Inverse) => run(microfft::inverse::ifft_4, buffer),
            (8, Inverse) => run(microfft::inverse::ifft_8, buffer),
            (16, Inverse) => run(microfft::inverse::ifft_16, buffer),
            (32, Inverse) => run(microfft::inverse::ifft_32, buffer),
            (64, Inverse) => run(microfft::inverse::ifft_64, buffer),
            (128, Inverse) => run(microfft::inverse::ifft_128, buffer),
            (256, Inverse) => run(microfft::inverse::ifft_256, buffer),
            (512, Inverse) => run(microfft::inverse::ifft_512, buffer),
            _ => panic!("microfft: unsupported FFT size {}", self.len),
        }
    }
}
