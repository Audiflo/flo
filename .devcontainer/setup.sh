#!/usr/bin/env bash

# Setup script for the flo devcontainer.

set -euo pipefail

export PATH="$HOME/.cargo/bin:$HOME/.local/bin:$PATH"

echo "==> rustup: wasm32 target"
rustup target add wasm32-unknown-unknown

echo "==> rustup: fmt + clippy components"
rustup component add rustfmt clippy

has_bin() { command -v "$1" >/dev/null 2>&1; }

if ! has_bin cargo-binstall; then
  echo "==> bootstrapping cargo-binstall"
  curl -LsSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh \
    | bash
  if ! has_bin cargo-binstall; then
    echo "cargo-binstall failed to install" >&2
    exit 1
  fi
fi

echo "==> installing rust tools via cargo binstall"
cargo binstall --no-confirm --force just cargo-nextest cargo-deny wasm-pack

echo "==> toolchain versions"
rustc --version
cargo --version
wasm-pack --version
just --version
cargo-nextest --version
cargo-deny --version
node --version
python3 --version
echo "==> flo devcontainer ready"