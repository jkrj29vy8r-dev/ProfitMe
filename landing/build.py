#!/usr/bin/env python3
"""Inline the modular landing page into a single self-contained file.

The source in this folder is deliberately split per concern — tokens, base,
one file per section, one script per job — because that is what ports into a
component framework later. This produces the single-file build for preview and
static hosting, where a strict CSP forbids external requests.

    python3 landing/build.py   ->  landing/dist/index.html
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def main() -> None:
    html = read("index.html")

    # Inline every stylesheet in document order, preserving cascade.
    def inline_css(match: re.Match) -> str:
        href = match.group(1)
        return f"<style>\n/* {href} */\n{read(href)}\n</style>"

    html = re.sub(
        r'<link rel="stylesheet" href="([^"]+)"\s*/?>', inline_css, html
    )

    # Inline every script, preserving execution order.
    def inline_js(match: re.Match) -> str:
        src = match.group(1)
        return f"<script>\n/* {src} */\n{read(src)}\n</script>"

    html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)

    DIST.mkdir(exist_ok=True)
    out = DIST / "index.html"
    out.write_text(html, encoding="utf-8")

    kb = len(html.encode("utf-8")) / 1024
    print(f"built {out} ({kb:.1f} KB, no external requests)")


if __name__ == "__main__":
    main()
