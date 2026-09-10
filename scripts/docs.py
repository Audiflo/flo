import argparse

from shared.constants import DOCS_DIR
from shared.run import run


def build():
    run(["npm", "ci"], DOCS_DIR)
    run(["npm", "run", "build"], DOCS_DIR)


def dev():
    run(["npm", "run", "dev"], DOCS_DIR)


def main():
    parser = argparse.ArgumentParser(prog="docs")
    parser.add_argument("command", nargs="?", default="build")
    args = parser.parse_args()
    commands = {"build": build, "dev": dev}
    try:
        commands[args.command]()
    except KeyError:
        raise SystemExit(f"Unknown command: {args.command}")


if __name__ == "__main__":
    main()