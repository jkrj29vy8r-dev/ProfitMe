#!/usr/bin/env python3
"""Inline the modular landing page into a single self-contained file.

The source in this folder is deliberately split per concern — tokens, base,
one file per section, one script per job — because that is what ports into a
component framework later. This produces the single-file build for preview and
static hosting, where a strict CSP forbids external requests.

    python3 landing/build.py   ->  landing/dist/index.html

scripts-src/hero-scene.js is the one file that isn't shipped as-is: it's an ES
module (`import * as THREE from "three"`) so it can be authored against the
real package, and esbuild bundles + tree-shakes it into scripts/hero-scene.js
before the inline step below picks it up like any other script. Edit the
scripts-src file, not the compiled one — it's overwritten on every build.
"""

import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def bundle_hero_scene() -> None:
    src = ROOT / "scripts-src" / "hero-scene.js"
    out = ROOT / "scripts" / "hero-scene.js"
    if not src.exists():
        return
    result = subprocess.run(
        [
            "npx",
            "esbuild",
            str(src),
            "--bundle",
            "--format=iife",
            "--minify",
            f"--outfile={out}",
        ],
        cwd=ROOT.parent,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise SystemExit("esbuild failed for hero-scene.js")
    kb = out.stat().st_size / 1024
    print(f"bundled {out} ({kb:.1f} KB, tree-shaken)")


def main() -> None:
    bundle_hero_scene()
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
    assert 'src="' not in html and 'href="styles' not in html, "external refs remain"


if __name__ == "__main__":
    main()
