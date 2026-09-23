---
type: concept
title: "Getting Started"
source: "https://audiflo.github.io/flo/getting-started/"
path: /getting-started/
updated: 2026-09-23
okf:
  generated_by: "@docmd/plugin-okf"
  generated_at: "2026-09-23T03:17:26.276Z"
---
# Getting Started

This guide will help you get up and running with flo quickly.

## Installation

### CLI Tool (reflo)

#### From Source

```bash
# Clone the repository
git clone https://github.com/Audiflo/flo.git
cd flo

# Build and install
cd Build
cargo install --path crates/reflo-cli --manifest-path Cargo.toml
```

#### Pre-built Binaries

Download from [GitHub Releases](https://github.com/Audiflo/flo/releases):

- `reflo-linux` - Linux x64
- `reflo-macos` - macOS x64
- `reflo-macos-arm64` - macOS Apple Silicon
- `reflo-windows.exe` - Windows x64

### Rust Libraries

Use `libflo-audio` for the codec or `reflo` for the higher-level raw-sample API:

- [libflo-audio](https://crates.io/crates/libflo-audio) - core codec ([docs.rs](https://docs.rs/libflo-audio))
- [reflo](https://crates.io/crates/reflo) - conversion facade ([docs.rs](https://docs.rs/reflo))

```toml
[dependencies]
libflo-audio = { version = "0.1.3" }
# Or: reflo = { version = "0.1.3", default-features = false }
```

### JavaScript (WASM)

```bash
npm install @audiflo/libflo
```

See [@audiflo/libflo](https://www.npmjs.com/package/@audiflo/libflo) on npm.

Or use directly in HTML:

```html
<script type="module">
  import init, { encode, decode } from './pkg-libflo/libflo_audio.js';
  await init();
</script>
```

---

## Quick Examples

### Convert a File (CLI)

```bash
# Lossless encoding (default)
reflo encode music.mp3 music.flo

# Lossy encoding with quality preset
reflo encode music.mp3 music.flo --lossy --quality high

# Decode back to WAV
reflo decode music.flo music.wav

# Show file info
reflo info music.flo
```

### Encode in Rust

```rust
use libflo_audio::{Encoder, decode};

// Create encoder
let encoder = Encoder::new(44100, 2, 16);

// Your audio samples (interleaved f32, -1.0 to 1.0)
let samples: Vec<f32> = vec![0.0; 44100 * 2]; // 1 second stereo silence

// Encode
let flo_data = encoder.encode(&samples, &[]).unwrap();

// Decode
let decoded = decode(&flo_data).unwrap();
```

### Encode in JavaScript

```javascript
import init, { encode, decode, info } from '@audiflo/libflo';

await init();

// Get samples from AudioBuffer or Web Audio API
const samples = new Float32Array(44100 * 2);

// Encode (lossless)
const floData = encode(samples, 44100, 2, 16, null);

// Decode
const decoded = decode(floData);

// Get info
const fileInfo = info(floData);
console.log(`Duration: ${fileInfo.duration_secs}s`);
```

---

## Choosing Lossless vs Lossy

| Use Case | Mode | Quality | Compression |
| ---------- | ------ | --------- | ------------- |
| Archival / Mastering | Lossless | Perfect | ~2-3x |
| Music streaming | Lossy High | Excellent | ~6x |
| Podcasts / Speech | Lossy Medium | Good | ~10x |
| Background audio | Lossy Low | Acceptable | ~30x |

### Quality Presets (Lossy)

| Preset | Equivalent Bitrate | Use Case |
| -------- | ------------------- | ---------- |
| `low` | ~48 kbps | Speech, podcasts |
| `medium` | ~128 kbps | General music |
| `high` | ~192 kbps | Quality listening |
| `veryhigh` | ~256 kbps | Near-transparent |
| `transparent` | ~320 kbps | Indistinguishable from lossless |

---

## Next Steps

- [CLI Reference](cli-reference.md) - Full command documentation
- [JavaScript API](javascript-api.md) - Browser integration
- [Metadata Guide](metadata-guide.md) - Add titles, artwork, lyrics
- [Streaming](streaming.md) - Real-time playback
