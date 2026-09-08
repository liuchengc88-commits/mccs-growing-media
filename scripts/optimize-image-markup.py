#!/usr/bin/env python3
"""Add intrinsic dimensions and loading hints to local static HTML images."""

from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".lighthouseci", "node_modules", "output", "outputs", "tmp"}
SKIP_PAGES = {"admin.html", "privacy.html", "terms.html"}
IMG_RE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
SRC_RE = re.compile(r"\bsrc=[\"']([^\"']+)[\"']", re.IGNORECASE)
VIEWBOX_RE = re.compile(r"\bviewBox=[\"'][^\"']*?([0-9.]+)\s+([0-9.]+)[\"']", re.IGNORECASE)


def dimensions(asset: Path) -> tuple[int, int] | None:
    try:
        if asset.suffix.lower() == ".svg":
            text = asset.read_text(encoding="utf-8")
            match = VIEWBOX_RE.search(text)
            if match:
                return round(float(match.group(1))), round(float(match.group(2)))
            return None
        with Image.open(asset) as image:
            return image.width, image.height
    except (OSError, ValueError):
        return None


def add_attribute(tag: str, name: str, value: str) -> str:
    if re.search(rf"\b{name}=", tag, re.IGNORECASE):
        return tag
    ending = "/>" if tag.endswith("/>") else ">"
    return f'{tag[:-len(ending)]} {name}="{value}"{ending}'


def set_attribute(tag: str, name: str, value: str) -> str:
    pattern = re.compile(rf"\s{name}=[\"'][^\"']*[\"']", re.IGNORECASE)
    if pattern.search(tag):
        return pattern.sub(f' {name}="{value}"', tag, count=1)
    return add_attribute(tag, name, value)


def remove_attribute(tag: str, name: str) -> str:
    return re.sub(rf"\s{name}=[\"'][^\"']*[\"']", "", tag, flags=re.IGNORECASE)


def optimize(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    first_section_end = html.lower().find("</section>")

    def replace(match: re.Match[str]) -> str:
        tag = match.group(0)
        src_match = SRC_RE.search(tag)
        if not src_match:
            return tag
        src = src_match.group(1)
        parsed = urlsplit(src)
        if parsed.scheme or parsed.netloc or src.startswith("data:"):
            return tag
        asset = ROOT / unquote(parsed.path.lstrip("/"))
        size = dimensions(asset) if asset.is_file() else None
        if size:
            tag = add_attribute(tag, "width", str(size[0]))
            tag = add_attribute(tag, "height", str(size[1]))
        in_footer = match.start() > html.find("<footer") >= 0
        in_first_section = first_section_end >= 0 and match.start() < first_section_end
        if in_first_section and not in_footer:
            tag = set_attribute(tag, "loading", "eager")
            tag = set_attribute(tag, "fetchpriority", "high")
        else:
            tag = set_attribute(tag, "loading", "lazy")
            tag = remove_attribute(tag, "fetchpriority")
        return add_attribute(tag, "decoding", "async")

    output = IMG_RE.sub(replace, html)
    if output == html:
        return False
    path.write_text(output, encoding="utf-8")
    return True


changed = 0
for html_path in ROOT.rglob("*.html"):
    if any(part in SKIP_DIRS for part in html_path.relative_to(ROOT).parts):
        continue
    if html_path.name in SKIP_PAGES:
        continue
    changed += optimize(html_path)

print(f"Optimized static image markup in {changed} HTML files.")
