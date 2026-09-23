# reflo-cli

[![crates.io](https://img.shields.io/crates/v/reflo-cli.svg?style=flat-square)](https://crates.io/crates/reflo-cli)

Command-line converter for the flo audio format.
Available on crates.io: <https://crates.io/crates/reflo-cli>.

Installs the `flo` binary.

## Features

- Convert audio files to and from flo format (WAV, MP3, FLAC, OGG, AAC, etc.)
- Both lossless and lossy compression modes, with quality presets and target bitrate
- Metadata handling: read tags, strip metadata, and view full metadata as JSON
- Audio analysis: loudness (EBU R128), waveform peaks, and spectral fingerprint
- File validation: verify a flo file parses and decodes cleanly

## Installation

```bash
cargo install reflo-cli
```

Or build from source:

```bash
cargo build --release --manifest-path Build/crates/reflo-cli/Cargo.toml
```

The binary will be available at `target/release/flo`.

## Usage

```text
flo encode <input> <output> [--lossy] [--quality <level>] [--bitrate <kbps>]
flo decode <input> <output>
flo info <input> [--metadata]
flo metadata <input> [--json]
flo analysis <input> [--waveform] [--spectrum] [--json]
flo validate <input>
```

Run `flo --help` for the full list of options.
