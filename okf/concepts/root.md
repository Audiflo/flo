---
type: concept
title: "flo Documentation"
source: "https://audiflo.github.io/flo/"
path: /
updated: 2026-09-23
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-09-23T03:53:42.908Z"
---
# flo Documentation

Welcome to the flo audio codec documentation!

## Quick Links

| Document | Description |
| ---------- | ------------- |
| [Getting Started](getting-started.md) | Installation and first steps |
| [CLI Reference](cli-reference.md) | Complete command-line usage |
| [JavaScript API](javascript-api.md) | WASM API for browsers |
| [Rust API](rust-api.md) | Native Rust library usage |
| [File Format](file-format.md) | Technical specification |
| [Metadata Guide](metadata-guide.md) | Working with audio metadata |
| [Streaming](streaming.md) | Real-time streaming decoder |
| [Architecture](architecture.md) | Crate and feature boundaries |
| [No-std and WASM](no-std.md) | Embedded and browser builds |

## What is flo?

flo (Fast Layered Object) is a modern audio codec supporting both **lossless** and **lossy** compression:

- **Lossless mode**: Perfect bit-for-bit reconstruction (~2-3x compression)
- **Lossy mode**: Psychoacoustic compression (~10-30x compression)

## Key Features

- **Dual-mode**: Choose lossless or lossy per-file
- **WebAssembly**: Full browser support
- **Rich metadata**: ID3v2.4 compatible + unique extensions
- **Streaming**: Frame-by-frame decoding for real-time playback
- **CLI tool**: Convert MP3, WAV, FLAC, OGG to flo

## Components

### libflo

The core Rust library. Handles encoding, decoding, and metadata.

- [crates.io: libflo-audio](https://crates.io/crates/libflo-audio) / [docs.rs](https://docs.rs/libflo-audio) / [npm: @audiflo/libflo](https://www.npmjs.com/package/@audiflo/libflo)
- Pure Rust (uses `rustfft` for transforms)

### reflo and reflo-cli

`reflo` is the reusable conversion facade. `reflo-cli` provides the `flo`
command-line converter and owns filesystem/audio-container support.

- [crates.io: reflo](https://crates.io/crates/reflo) / [docs.rs](https://docs.rs/reflo) / [npm: @audiflo/reflo](https://www.npmjs.com/package/@audiflo/reflo)
- [crates.io: reflo-cli](https://crates.io/crates/reflo-cli)
- Converts common formats to flo
- Also available as WASM for browser-based conversion

## License

Apache-2.0. See [LICENSE](../LICENSE) for details.

"flo" is a trademark of NellowTCS.
