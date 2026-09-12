//! Shared flo error types

use alloc::boxed::Box;
use alloc::string::{String, ToString};
use core::fmt;

/// Category of a [`FloError`]
#[non_exhaustive]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum FloErrorKind {
    /// The bytes are not a well-formed flo file (bad magic, header, CRC, frames…).
    InvalidData,
    /// A feature or option this build doesn't support (wasm/audio-io/etc).
    UnsupportedFeature,
    /// I/O failure. `std` builds carry the underlying source error.
    Io,
    /// Codec / signal-processing failure.
    Codec,
    /// Metadata (de)serialization failure.
    Metadata,
    /// Lossy encode/decode failure.
    Lossy,
    /// Lossless encode/decode failure.
    Lossless,
    /// WebAssembly bridge failure.
    Wasm,
    /// Internal invariant broken: a bug, not a data problem.
    Internal,
}

/// The one error type for the flo workspace.
#[derive(Clone)]
pub struct FloError {
    kind: FloErrorKind,
    message: String,
    #[cfg(feature = "std")]
    source: Option<Box<dyn core::error::Error + 'static>>,
}

impl FloError {
    /// Build an error from a category and a message.
    pub fn new<T: Into<String>>(kind: FloErrorKind, message: T) -> Self {
        Self {
            kind,
            message: message.into(),
        }
    }

    /// The error's category.
    pub fn kind(&self) -> FloErrorKind {
        self.kind
    }

    /// The human-readable message.
    pub fn message(&self) -> &str {
        &self.message
    }

    /// Attach a wrapped message.
    pub fn with_context<T: Into<String>>(mut self, ctx: T) -> Self {
        let ctx = ctx.into();
        if self.message.is_empty() {
            self.message = ctx;
        } else {
            self.message = alloc::format!("{ctx}: {}", self.message);
        }
        self
    }

    #[cfg(feature = "std")]
    pub fn with_source(mut self, source: impl core::error::Error + 'static) -> Self {
        self.source = Some(Box::new(source));
        self
    }

    /// Box this error for use as `Box<dyn Error>` in streaming/reader contexts.
    pub fn into_boxed(self) -> Box<FloError> {
        Box::new(self)
    }
}

impl fmt::Display for FloError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&self.message, f)
    }
}

impl fmt::Debug for FloError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut d = f.debug_struct("FloError");
        d.field("kind", &format_args!("{:?}", self.kind));
        d.field("message", &self.message);
        d.finish()
    }
}

impl core::error::Error for FloError {
    #[cfg(feature = "std")]
    fn source(&self) -> Option<&(dyn core::error::Error + 'static)> {
        self.source.as_deref()
    }
}

impl From<fmt::Error> for FloError {
    fn from(e: fmt::Error) -> Self {
        Self::new(FloErrorKind::Codec, e.to_string())
    }
}

impl From<String> for FloError {
    fn from(s: String) -> Self {
        Self::new(FloErrorKind::Internal, s)
    }
}

impl From<&str> for FloError {
    fn from(s: &str) -> Self {
        Self::new(FloErrorKind::Internal, s.to_string())
    }
}

/// Extension trait for adding context to [`FloError`] instances.
pub trait FloErrorExt<T> {
    /// Wrap the error in a context message, producing a [`FloResult`].
    fn context(self, ctx: impl Into<String>) -> Result<T, FloError>;
}

impl<T> FloErrorExt<T> for Result<T, FloError> {
    fn context(self, ctx: impl Into<String>) -> Result<T, FloError> {
        self.map_err(|e| e.with_context(ctx))
    }
}

/// Result alias
pub type FloResult<T> = Result<T, FloError>;
