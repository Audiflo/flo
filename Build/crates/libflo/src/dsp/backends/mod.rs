//! Compile-time FFT backend selection

#[cfg(feature = "fft-microfft")]
pub mod microfft;
#[cfg(feature = "fft-rustfft")]
pub mod rustfft;

#[cfg(feature = "fft-rustfft")]
pub use rustfft::RustFftPlanner as DefaultPlanner;

#[cfg(all(feature = "fft-microfft", not(feature = "fft-rustfft")))]
pub use microfft::MicroFftPlanner as DefaultPlanner;

#[cfg(not(any(feature = "fft-rustfft", feature = "fft-microfft")))]
compile_error!(
    "libflo-audio requires an FFT backend: enable feature `fft-rustfft` (std) or `fft-microfft` (no_std)"
);
