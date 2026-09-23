# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3]

### Added

- **Block switching in the lossy encoder:** the MDCT path now switches between long and short windows behind a transient/loudness-spike detector, reducing pre-echo and improving quality on transient-heavy material.
- **Random access:** a dedicated seeking module exposes a table of contents (`get_toc`), frame-accurate decode (`decode_frame_at`), and time-based seek (`seek_to_time`) over encoded bytes.
- **Analysis API:** waveform peaks and RMS, spectral fingerprint and dominant-frequency extraction, and spectral similarity, all pure functions over encoded bytes. Surface in the demo File Info card and the CLI `analysis` subcommand.
- **EBU R128 loudness:** integrated loudness and true-peak measurement computed during encode and reported on decode.
- **ALAC decode support** in reflo, via Symphonia.
- **FFT backend abstraction:** a new `dsp` module with swappable `fft-rustfft` and `fft-microfft` backends.
- **`no_std`:** `libflo-audio` compiles with `--no-default-features` for embedded targets (`thumbv8m.main-none-eabihf`); `reflo` follows with a conditional `std` feature.
- **CLI:** `reflo-cli` splits into its own crate and gains `metadata`, `analysis`, and `validate` subcommands alongside `encode`, `decode`, and `info`.
- **Web demo:** the desktop demo gains waveform and spectral visualization, worker-thread decoding, and TOC-based seeking during playback.
- **Documentation:** docs move to a generated docmd site with new file-format, `no_std`, CLI reference, and architecture guides.
- **Release infrastructure:** OIDC trusted publishing for both crates.io and npm, so no registry tokens are stored in CI; npm publications carry SLSA provenance and the CLI/WASM artifacts get build-provenance attestations. Release workflows (with dry-run for manual testing) split into `release-cargo.yml` and `release-npm.yml`.
- **Security gates:** cargo-audit (advisories) and cargo-deny (licenses, bans) run in CI on lockfile changes and on a weekly schedule, with read-only permissions.

### Changed

- **Dependencies:** bumped `symphonia` 0.5 -> 0.6.1 and migrated the reflo decode/metadata pipelines to the new API (`AudioCodecParameters`,
  `AudioDecoderOptions`, metadata revisions, probe-by-value options). All Rust workspace deps updated to their latest patch/minor versions (`serde`, `serde_json`, `serde_bytes`, `messagepack-serde`, `serde-wasm-bindgen`, `rustfft`, `blake3`, `wasm-bindgen`, `js-sys`, `web-sys`, `anyhow`, `chrono`, `clap`).
- **Workspace layout:** crates consolidate into a single `Build/` workspace (`crates/libflo`, `crates/reflo`, `crates/reflo-cli`, `crates/flo-fixtures`) with shared Python `scripts/` and a `Justfile` command layer.
- **Streaming encoder:** adds a compression-level knob, chunked `flush_into_frames`, and an explicit `finalize` step that writes the trailing metadata and footer.
- **Test restructure:** native Rust integration tests now live in `Tests/` (`Tests/libflo/`, `Tests/reflo/`) and are wired via `[[test]]` paths in the crate manifests; Jest WASM tests moved to `Tests/libflo/js/`.
- **Fixtures:** added `Build/crates/flo-fixtures`, an in-code signal synthesizer that replaces `sox`-based generation. `just examples` now writes `.wav`/`.flo` files to `Tests/fixtures/` and regenerates `Examples/`.
- **Tooling:** `.devcontainer/` dev container (Rust + Node 24 + Python 3.14, wasm32 target, `just`, `cargo-deny`, `wasm-pack`) and toolchain version pins: `.nvmrc` (Node 24), `.python-version` (3.14), and an `.envrc` for direnv users.

### Fixed

- **True lossless:** the lossless path no longer loses data; encode then decode round-trips bit-exactly. The decoder stays compatible with the released v0.1.2 format (which coded `mid = L + R`).
- **Duration bookkeeping:** sample counts across read, write, and seeking are now per-channel sample-frames rather than interleaved samples, fixing duration and total-frame reporting.
- Wasm encoder: `next_frame` returns `null` (not `undefined`) on end-of-stream; `flush()` now runs the final partial frame through `flush_into_frames`.
- ALPC `serialize_channel` serialization layout (order, coeffs, shift bits, residual encoding, Rice parameter) so encoded frames round-trip correctly.

## [0.1.2] - YYYY-MM-DD

Alpha release. Dual-mode lossless (ALPC + Rice) and lossy (MDCT psychoacoustic)
codec for WebAssembly and native, with metadata (ID3v2.4 compatible +
flo extensions), streaming encode/decode, and seeking support.

[Unreleased]: https://github.com/Audiflo/flo/compare/main...HEAD
[0.1.2]: https://github.com/Audiflo/flo/releases/tag/v0.1.2
