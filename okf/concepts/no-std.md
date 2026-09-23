---
type: concept
title: "No-std and WebAssembly"
source: "https://audiflo.github.io/flo/no-std/"
path: /no-std/
updated: 2026-09-23
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-09-23T03:22:06.895Z"
---
# No-std and WebAssembly

The codec works from decoded interleaved samples, so embedded and browser
applications do not need filesystem support.

## Core builds

Build the raw codec without default features:

```bash
cargo check -p libflo-audio --manifest-path Build/Cargo.toml --no-default-features
cargo check -p reflo --manifest-path Build/Cargo.toml --no-default-features
```

These builds target `no_std` environments with an allocator. Applications
provide their own input/output transport and clock.

## WebAssembly

The JavaScript bindings are opt-in:

```bash
wasm-pack build Build/crates/libflo --release --target web
wasm-pack build Build/crates/reflo --release --target web --features wasm
```

The browser demo packages both generated bindings under `Demo/pkg-libflo` and
`Demo/pkg-reflo`.

## SIMD

SIMD is independent of `std` and WebAssembly. Native builds can enable the
`simd` feature when the target supports it; scalar builds remain available for
small embedded targets and portable WASM.

## Audio containers

MP3, FLAC, OGG, WAV, and other container input belongs to the `audio-io` layer.
It is provided by `reflo-cli` and is not required when callers already have
PCM samples.
