import argparse
import shutil

from shared.constants import (
    DEMO_DIR,
    EXAMPLES_DIR,
    FIXTURES_DIR,
    REFLO_CLI_DIR,
    REFLO_DIR,
    TARGET_DIR,
)
from shared.format import check, ensure_tool
from shared.run import run


def fmt_check():
    check(
        "reflo",
        ["cargo", "fmt", "--check"],
        ["cargo", "fmt"],
        REFLO_DIR,
    )


def lint():
    run(["cargo", "clippy", "--", "-D", "warnings"], REFLO_DIR)


def test():
    ensure_tool("cargo-nextest")
    run(["cargo", "nextest", "run"], REFLO_DIR)


def build():
    run(["cargo", "build", "--release", "-p", "reflo-cli"], REFLO_DIR)


def install():
    run(["cargo", "install", "--path", str(REFLO_CLI_DIR)], REFLO_DIR)


def wasm():
    ensure_tool("wasm-pack")
    run(
        ["wasm-pack", "build", "--release", "--target", "web", "--features", "wasm"],
        REFLO_DIR,
    )
    shutil.copy(REFLO_DIR / "package.json.template", REFLO_DIR / "pkg" / "package.json")
    dest = DEMO_DIR / "pkg-reflo"
    dest.mkdir(parents=True, exist_ok=True)
    shutil.copytree(REFLO_DIR / "pkg", dest, dirs_exist_ok=True)
    print("[demo] reflo WASM copied to Demo/pkg-reflo/")


def examples():
    run(["cargo", "build", "-p", "flo-fixtures"], REFLO_DIR)
    bin = TARGET_DIR / "debug" / "flo-fixtures"
    run([str(bin), str(EXAMPLES_DIR), str(FIXTURES_DIR)], REFLO_DIR)
    print("[examples] regenerated Examples/*.flo and Tests/fixtures/*.{flo,wav}")


def clean():
    run(["cargo", "clean"], REFLO_DIR)


def no_std():
    run(
        ["cargo", "check", "--no-default-features", "--features", "fft-rustfft"],
        REFLO_DIR,
    )
    run(
        [
            "cargo",
            "check",
            "--no-default-features",
            "--features",
            "fft-microfft",
            "--target",
            "thumbv8m.main-none-eabihf",
        ],
        REFLO_DIR,
    )


def check_all():
    fmt_check()
    lint()
    test()
    build()


CMD_ALIASES = {
    "setup": lambda: None,
    "build": build,
    "fmt_check": fmt_check,
    "lint": lint,
    "test": test,
    "install": install,
    "wasm": wasm,
    "examples": examples,
    "no_std": no_std,
    "check": check_all,
    "clean": clean,
}


def main():
    parser = argparse.ArgumentParser(prog="reflo")
    parser.add_argument("command", nargs="?", default="check")
    args = parser.parse_args()
    try:
        CMD_ALIASES[args.command]()
    except KeyError:
        raise SystemExit(f"Unknown command: {args.command}")


if __name__ == "__main__":
    main()