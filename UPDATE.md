# Release pre-checks

Bump to the new version and verify it is updated everywhere:

- **Crate version** (semver):
  - `Build/Cargo.toml` - workspace `version` key
  - `Build/crates/libflo/package.json.template` and `Build/crates/reflo/package.json.template` - npm `"version"`; these are copied into each `pkg/` dir by `scripts/libflo.py` / `scripts/reflo.py`, then into `Demo/pkg-*`
  - `Build/crates/reflo-cli/src/main.rs` - `#[command(version = "...")]`
  - `Docs/docs/getting-started.md` and `Docs/docs/rust-api.md` - `libflo-audio = { version = "..." }` / `reflo = { version = "...", ... }` dependency examples
  - update `CHANGELOG.md`

- **Format version** (`VERSION_MAJOR`/`VERSION_MINOR`):
  - `Build/crates/libflo/src/core/types.rs` - `VERSION_MAJOR` / `VERSION_MINOR` constants (authoritative)
  - `Build/crates/libflo/src/lib.rs` - `test_version` assertion
  - `Tests/libflo/rust/integration_tests.rs` - `test_version` assertion
