# Todo

- [ ] Add streaming encode to web demo

- [ ] Add bulk converter to reflo + web demo (possibly separate page)
- [ ] More reflo tests
- [ ] Add file comparison view (compare original vs encoded)
- [ ] Replace hand-rolled WASM/JSON-serialization analysis wrapper functions with typed, directly-exportable analysis functions (no duplicated `*_wasm` fns; one serde-typed signature shared by Rust, WASM)
- [ ] Port flo's tests into a shared test suite compiled twice (native + wasm) so the SAME tests run against both targets (borrow Saikuro's `Tests/tests/shared` pattern lol)
- [ ] Drop the separate Jest toolchain and Jest tests once the shared native+wasm suite exists
- [ ] Add a golden corpus + Criterion benches + proptest round-trip (`decode(encode(x))==x`) + fuzz the parser/decoder
- [ ] CRC32 required on ALL chunks (current only data blocks; extend to header, metadata, embedded picture/artwork, comments/custom tags, chapters, lyrics)
- [ ] Optional SHA-256 Merkle root over data blocks for tamper-evidence (CRC32 is detection, not security); verified on decode and surfaced in demo File Info
- [ ] Better lossless compression ratio (predictor/context model)
- [ ] Better lossy compression (perceptual bit allocation, noise shaping/dithering)
- [ ] Compression presets / level (speed/ratio knob, FLAC/zstd-style)
- [ ] VBR via loudness-bounded quality (use the EBU R128 loudness we already compute; target LU/LUFS, not bitrate)
- [ ] Faster encode/decode ((fearless_simd) SIMD the K-weight biquads + 4x true-peak oversampler hot path; parallel block encode/decode)
- [ ] Add metadata/tag editor UI + typed WASM metadata CRUD exports (setters exist Rust-side; expose to WASM)
- [ ] Add toc navigation + toc-based seeking (TOC already available via `get_toc`)
- [ ] Add synced-lyrics display during playback (flo stores synced lyrics; surface timed to playback)
- [ ] Show front-cover artwork + picture in File Info card (metadata stores picture; expose read to WASM)
- [ ] Add integrity/analysis recompute-on-open toggle in web demo (reuse cached metadata on open; recompute only on explicit request)
- [ ] Add metadata auto-add on encode stays required (analysis/loudness/fingerprint/waveform already added on encode, kept)
