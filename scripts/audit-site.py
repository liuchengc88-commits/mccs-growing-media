#!/usr/bin/env python3
"""Audit the static site without fetching external URLs."""

from __future__ import annotations

import json
import sys
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
CANONICAL_ORIGIN = "https://www.mccsgrowingmedia.com"
SKIP_DIRS = {".git", ".lighthouseci", "node_modules", "outputs", "tmp"}
SKIP_PAGES = {"admin.html", "privacy.html", "terms.html"}
PRIORITY_PAGES = {
    "index.html",
    "products/index.html",
    "sample-shipping/index.html",
    "private-label/index.html",
    "contact/index.html",
    "insights/index.html",
    "about/index.html",
}
PRODUCT_CATALOG_PAGES = {
    "products/index.html",
    "cn/products/index.html",
    "es/products/index.html",
    "ar/products/index.html",
}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.title_parts: list[str] = []
        self.in_title = False
        self.h1_count = 0
        self.meta: list[dict[str, str | None]] = []
        self.canonicals: list[str] = []
        self.links: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.json_ld: list[str] = []
        self.in_json_ld = False
        self.json_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        values = dict(attrs)
        if tag == "html":
            self.lang = values.get("lang", "") or ""
        elif tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "meta":
            self.meta.append(values)
        elif tag == "link" and values.get("rel") == "canonical":
            self.canonicals.append(values.get("href", "") or "")
        elif tag == "a" and values.get("href"):
            self.links.append(values["href"])
        elif tag == "img":
            self.images.append(values)
        elif tag == "script" and values.get("type") == "application/ld+json":
            self.in_json_ld = True
            self.json_parts = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_json_ld:
            self.json_ld.append("".join(self.json_parts))
            self.in_json_ld = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.in_json_ld:
            self.json_parts.append(data)


def is_skipped(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    return path.name in SKIP_PAGES or any(part in SKIP_DIRS for part in relative.parts)


def local_target(page: Path, value: str) -> Path | None:
    if value.startswith(("#", "mailto:", "tel:", "javascript:", "data:", "//")):
        return None
    parsed = urlsplit(value)
    if parsed.scheme in {"http", "https"}:
        return None
    clean_path = unquote(parsed.path)
    if not clean_path:
        return None
    target = ROOT / clean_path.lstrip("/") if clean_path.startswith("/") else page.parent / clean_path
    target = target.resolve()
    if clean_path.endswith("/"):
        target /= "index.html"
    elif not target.suffix and not target.exists():
        target /= "index.html"
    return target


def add_issue(issues, level: str, page: str, message: str) -> None:
    issues.append((level, page, message))


def main() -> int:
    pages = sorted(path for path in ROOT.rglob("*.html") if not is_skipped(path))
    issues: list[tuple[str, str, str]] = []
    titles: dict[str, list[str]] = defaultdict(list)
    canonicals: dict[str, list[str]] = defaultdict(list)
    product_entities = 0
    products = json.loads((ROOT / "data" / "products.json").read_text(encoding="utf-8"))
    expected_models = {str(product["model"]) for product in products}

    for path in pages:
        relative = path.relative_to(ROOT).as_posix()
        parser = PageParser()
        try:
            html = path.read_text(encoding="utf-8")
            parser.feed(html)
        except Exception as exc:
            add_issue(issues, "ERROR", relative, f"HTML parse failed: {exc}")
            continue

        if relative in PRODUCT_CATALOG_PAGES:
            row_start = "<!-- GENERATED PRODUCT ROWS START -->"
            row_end = "<!-- GENERATED PRODUCT ROWS END -->"
            if row_start not in html or row_end not in html:
                add_issue(issues, "ERROR", relative, "Missing generated static product rows")
            else:
                static_rows = html.split(row_start, 1)[1].split(row_end, 1)[0]
                missing_models = sorted(model for model in expected_models if model not in static_rows)
                if missing_models:
                    add_issue(
                        issues,
                        "ERROR",
                        relative,
                        f"Static product rows missing models: {', '.join(missing_models)}",
                    )

        title = "".join(parser.title_parts).strip()
        descriptions = [
            str(meta.get("content") or "").strip()
            for meta in parser.meta
            if str(meta.get("name") or "").lower() == "description"
        ]
        robots = " ".join(
            str(meta.get("content") or "").lower()
            for meta in parser.meta
            if str(meta.get("name") or "").lower() == "robots"
        )
        noindex = "noindex" in robots

        if not title:
            add_issue(issues, "ERROR", relative, "Missing title")
        if len(descriptions) != 1 or not descriptions[0]:
            add_issue(issues, "ERROR", relative, f"Expected one meta description, found {len(descriptions)}")
        if parser.h1_count != 1:
            add_issue(issues, "ERROR", relative, f"Expected one H1, found {parser.h1_count}")
        if len(parser.canonicals) != 1:
            add_issue(issues, "ERROR", relative, f"Expected one canonical, found {len(parser.canonicals)}")
        elif not parser.canonicals[0].startswith(CANONICAL_ORIGIN):
            add_issue(issues, "ERROR", relative, f"Canonical must use {CANONICAL_ORIGIN}")
        if not parser.lang:
            add_issue(issues, "ERROR", relative, "Missing html lang")

        if title:
            titles[title].append(relative)
        if parser.canonicals and not noindex:
            canonicals[parser.canonicals[0]].append(relative)

        for image in parser.images:
            source = str(image.get("src") or "")
            if "alt" not in image:
                add_issue(issues, "WARN", relative, f"Image missing alt: {source or '[inline]'}")
            target = local_target(path, source)
            if target is not None and not target.exists():
                add_issue(issues, "ERROR", relative, f"Missing image: {source}")

        for href in parser.links:
            target = local_target(path, href)
            if target is not None and not target.exists():
                add_issue(issues, "ERROR", relative, f"Broken internal link: {href}")

        catalog_item_list_found = False
        for raw_json in parser.json_ld:
            try:
                entity = json.loads(raw_json)
            except json.JSONDecodeError as exc:
                add_issue(issues, "ERROR", relative, f"JSON-LD parse failed: {exc}")
                continue
            roots = entity if isinstance(entity, list) else [entity]
            for root in roots:
                if not isinstance(root, dict):
                    continue
                if root.get("@type") and not root.get("@context"):
                    add_issue(issues, "ERROR", relative, f"JSON-LD {root.get('@type')} missing @context")
                if root.get("@type") == "Product":
                    product_entities += 1
                if relative in PRODUCT_CATALOG_PAGES and root.get("@type") == "ItemList":
                    catalog_item_list_found = True
                    elements = root.get("itemListElement", [])
                    if root.get("numberOfItems") != len(products) or len(elements) != len(products):
                        add_issue(
                            issues,
                            "ERROR",
                            relative,
                            "Product ItemList count does not match data/products.json",
                        )
        if relative in PRODUCT_CATALOG_PAGES and not catalog_item_list_found:
            add_issue(issues, "ERROR", relative, "Missing product ItemList JSON-LD")

    for title, matches in titles.items():
        if len(matches) > 1:
            add_issue(issues, "WARN", " | ".join(matches), f"Duplicate title: {title}")
    for canonical, matches in canonicals.items():
        if len(matches) > 1:
            add_issue(issues, "ERROR", " | ".join(matches), f"Duplicate indexable canonical: {canonical}")

    sitemap_path = ROOT / "sitemap.xml"
    try:
        sitemap_root = ElementTree.parse(sitemap_path).getroot()
        namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        sitemap_urls = [node.text or "" for node in sitemap_root.findall("s:url/s:loc", namespace)]
        for url in sitemap_urls:
            if not url.startswith(CANONICAL_ORIGIN):
                add_issue(issues, "ERROR", "sitemap.xml", f"Non-canonical origin: {url}")
                continue
            route = url.removeprefix(CANONICAL_ORIGIN).split("?", 1)[0]
            target = ROOT / route.lstrip("/")
            if route.endswith("/"):
                target /= "index.html"
            if not target.exists():
                add_issue(issues, "ERROR", "sitemap.xml", f"URL has no local page: {url}")
    except (ElementTree.ParseError, OSError) as exc:
        add_issue(issues, "ERROR", "sitemap.xml", f"Sitemap parse failed: {exc}")
        sitemap_urls = []

    existing = {path.relative_to(ROOT).as_posix() for path in pages}
    for priority in sorted(PRIORITY_PAGES - existing):
        add_issue(issues, "ERROR", priority, "Priority page is missing")

    counts = Counter(level for level, _, _ in issues)
    print(f"Audited HTML pages: {len(pages)}")
    print(f"Sitemap URLs: {len(sitemap_urls)}")
    print(f"Product JSON-LD entities: {product_entities}")
    print(f"Errors: {counts['ERROR']} | Warnings: {counts['WARN']}")
    for level, page, message in issues:
        print(f"{level}\t{page}\t{message}")
    return 1 if counts["ERROR"] else 0


if __name__ == "__main__":
    sys.exit(main())

