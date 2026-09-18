---
type: concept
title: Architecture
source: "https://audiflo.github.io/flo/architecture/"
path: /architecture/
updated: 2026-09-18
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-09-18T02:08:10.142Z"
---
# Architecture

flo is organized as four workspace crates with separate responsibilities.

## `libflo-audio`

The codec and file-format library. It contains lossless and lossy encoding,
decoding, metadata structures, streaming, seeking, and analysis.

## `reflo`

The reusable conversion facade over `libflo-audio`. It provides raw-sample
encoding and decoding, metadata operations, validation, and optional WebAssembly
bindings. Audio-container input is an optional layer.

## `reflo-cli`

The `flo` command-line application. This crate owns Clap, filesystem access,
Symphonia input decoding, and file conversion workflows.

Install it from the repository with:

```bash
cargo install --path Build/crates/reflo-cli --manifest-path Build/Cargo.toml
```

## `flo-fixtures`

A private development tool used to generate examples and test fixtures. It is
not a runtime library and is not published.

## Feature layers

| Feature | Purpose |
| --- | --- |
| `std` | Standard-library conveniences |
| `wasm` | JavaScript/WebAssembly bindings |
| `audio-io` | Symphonia-backed audio-container input |
| `simd` | Native SIMD acceleration where supported |
