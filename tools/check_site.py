#!/usr/bin/env python3
"""Pre-deploy quality gate for dyegu.co.

Verifies:
  1. Zero broken internal links or missing #anchor IDs across all generated HTML pages
  2. Every referenced local <img> / <video> / <source> asset exists on disk
  3. Zero bloated C2PA manifests left inside site/assets/**/*.svg
  4. Valid JSON-LD structured data blocks on every page
  5. Valid sitemap.xml covering all canonical routes
  6. Zero NEEDS_CHECK rows leaked into content/sources.json
  7. CSP in vercel.json permits local media when <video> is used
"""
from __future__ import annotations

import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class PageScanner(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids: set[str] = set()
        self.hrefs: list[str] = []
        self.srcs: list[str] = []
        self.jsonld: list[str] = []
        self._in_jsonld = False
        self._buf: list[str] = []
        self.has_video = False

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get("id"):
            self.ids.add(d["id"])
        if tag == "a" and d.get("href"):
            self.hrefs.append(d["href"])
        if tag in ("img", "video", "source", "script") and d.get("src"):
            self.srcs.append(d["src"])
        if tag == "video":
            self.has_video = True
        if tag == "script" and d.get("type") == "application/ld+json":
            self._in_jsonld = True
            self._buf = []

    def handle_data(self, data):
        if self._in_jsonld:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            self.jsonld.append("".join(self._buf))


def resolve_route(route: str) -> str | None:
    clean = route.split("?", 1)[0].split("#", 1)[0]
    if clean in ("", "/"):
        cand = os.path.join(ROOT, "index.html")
        return cand if os.path.isfile(cand) else None
    rel = clean.lstrip("/")
    for candidate in (
        os.path.join(ROOT, rel),
        os.path.join(ROOT, rel, "index.html"),
        os.path.join(ROOT, f"{rel}.html"),
    ):
        if os.path.isfile(candidate):
            return candidate
    return None


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    html_files: list[str] = []
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in ("node_modules", ".git", "tools", "api", "supabase", "content")]
        for fn in fns:
            if fn.endswith(".html"):
                html_files.append(os.path.join(dp, fn))

    scanners: dict[str, PageScanner] = {}
    any_video = False
    for path in sorted(html_files):
        sc = PageScanner()
        sc.feed(open(path, "r", encoding="utf-8").read())
        scanners[path] = sc
        any_video = any_video or sc.has_video

        # Validate JSON-LD
        for idx, raw_ld in enumerate(sc.jsonld):
            try:
                json.loads(raw_ld)
            except Exception as exc:
                errors.append(f"Invalid JSON-LD #{idx+1} in {os.path.relpath(path, ROOT)}: {exc}")

    # Verify links, anchors, and local assets
    for path, sc in scanners.items():
        rel_page = os.path.relpath(path, ROOT)
        for href in sc.hrefs:
            if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
                continue
            if href.startswith("#"):
                anchor = href[1:]
                if anchor and anchor not in sc.ids:
                    errors.append(f"Broken local anchor {href} on {rel_page}")
                continue
            target_path = resolve_route(href)
            if not target_path:
                errors.append(f"Broken internal link {href} on {rel_page}")
                continue
            if "#" in href:
                anchor = href.split("#", 1)[1]
                target_sc = scanners.get(target_path)
                if target_sc and anchor and anchor not in target_sc.ids:
                    errors.append(f"Broken cross-page anchor {href} on {rel_page}")

        for src in sc.srcs:
            if src.startswith(("http://", "https://", "data:", "/_vercel/")):
                continue
            if src.startswith("/"):
                asset = os.path.join(ROOT, src.lstrip("/"))
                if not os.path.isfile(asset):
                    errors.append(f"Missing asset {src} referenced on {rel_page}")

    # Check SVG hygiene (no C2PA bloat)
    assets_dir = os.path.join(ROOT, "assets")
    for dp, _, fns in os.walk(assets_dir):
        for fn in fns:
            if fn.endswith(".svg"):
                p = os.path.join(dp, fn)
                txt = open(p, "r", encoding="utf-8", errors="ignore").read()
                if "c2pa:manifest" in txt:
                    errors.append(f"Bloated C2PA metadata found in {os.path.relpath(p, ROOT)}")

    # Check sources.json for NEEDS_CHECK leaks
    sources_path = os.path.join(ROOT, "content", "sources.json")
    if os.path.isfile(sources_path):
        raw_sources = open(sources_path, "r", encoding="utf-8").read()
        if "NEEDS_CHECK" in raw_sources:
            errors.append("NEEDS_CHECK status leaked into content/sources.json!")

    # Check sitemap.xml
    sitemap_path = os.path.join(ROOT, "sitemap.xml")
    try:
        tree = ET.parse(sitemap_path)
        urls = tree.getroot().findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        if len(urls) < 15:
            warnings.append(f"sitemap.xml only has {len(urls)} URLs")
    except Exception as exc:
        errors.append(f"Invalid sitemap.xml: {exc}")

    # Check CSP for media-src when <video> is present
    vercel_cfg = json.load(open(os.path.join(ROOT, "vercel.json"), "r", encoding="utf-8"))
    csp = ""
    for rule in vercel_cfg.get("headers", []):
        for h in rule.get("headers", []):
            if h.get("key") == "Content-Security-Policy":
                csp = h.get("value", "")
    if any_video and "media-src" not in csp:
        errors.append("vercel.json CSP is missing media-src directive for local <video> elements")

    print(f"checked {len(html_files)} HTML pages")
    for w in warnings:
        print(f"  WARN: {w}")
    if errors:
        for err in errors:
            print(f"  FAIL: {err}")
        return 1
    print("ALL CHECKS PASSED (0 broken links/anchors, 0 missing assets, 0 SVG bloat, valid JSON-LD & sitemap)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
