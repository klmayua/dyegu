#!/usr/bin/env python3
"""Synchronises verified episode data from ../episodes/ep* into site/content/.

Reads each episode folder's:
  - 01_claims.md            (verified claims, [V]/[E]/[T] tags, readable source citations; excludes NEEDS_CHECK)
  - 07_publish/publish.json (chapters, shorts hooks, tags)
  - 03_master_script.json   (runtime, word count, structure variant)
  - teleprompter.txt        (Sir K's COLD_OPEN_CAM, CLOSING_REFLECTION / The DYEGU Rule, CLOSING_COMMENT_PROMPT)

Outputs:
  - site/content/sources.json   (enriched verification ledger + backwards-compatible source URLs)
  - site/content/episodes.json  (chapters, DYEGU Rule, shorts, runtime, claims summary)
"""
from __future__ import annotations

import json
import os
import re
from urllib.parse import urlparse

SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(SITE_ROOT)
EPISODES_DIR = os.path.join(PROJECT_ROOT, "episodes")
CONTENT_DIR = os.path.join(SITE_ROOT, "content")

URL_RE = re.compile(r"https?://[^\s\)\]>\"']+")
TAG_RE = re.compile(r"\[([VET])\]")
TELE_SECTION_RE = re.compile(r"===\s*([A-Z0-9_]+)[^\n]*===\s*\n([\s\S]*?)(?=\n===|\Z)")


def clean_url(url: str) -> str:
    return url.rstrip(".,;:")


def domain_of(url: str) -> str:
    host = urlparse(url).netloc.lower()
    return host[4:] if host.startswith("www.") else host


def parse_claims(claims_path: str) -> dict:
    """Parse 01_claims.md markdown table while strictly excluding NEEDS_CHECK rows."""
    verified_claims = 0
    held_back = 0
    tag_counts = {"V": 0, "E": 0, "T": 0}
    sources_by_url: dict[str, dict] = {}
    claims_list: list[dict] = []

    with open(claims_path, "r", encoding="utf-8") as fh:
        for raw_line in fh:
            line = raw_line.strip()
            if not line.startswith("|") or line.startswith("| ---") or line.startswith("| ID"):
                continue
            cols = [c.strip() for c in line.strip("|").split("|")]
            if len(cols) < 6:
                continue
            cid, claim_text, source_col, tag_col, on_screen, status = cols[:6]
            status_norm = status.upper()
            if "NEEDS_CHECK" in status_norm or "BLOCK" in status_norm:
                held_back += 1
                continue
            if not re.match(r"^C\d+", cid):
                continue

            verified_claims += 1
            tag_match = TAG_RE.search(tag_col)
            tag = tag_match.group(1) if tag_match else "E"
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

            # Extract readable source segments with URLs
            claim_urls = []
            segments = [seg.strip() for seg in source_col.split(";")]
            for seg in segments:
                urls = [clean_url(u) for u in URL_RE.findall(seg)]
                if not urls:
                    continue
                # Readable label is text before the first URL or dash
                prefix = re.split(r"\s+—\s+|https?://", seg, maxsplit=1)[0].strip(" -–—:,")
                for url in urls:
                    claim_urls.append(url)
                    dom = domain_of(url)
                    readable = prefix if prefix and len(prefix) > 2 else (on_screen if on_screen and on_screen != "—" else dom)
                    # Clean redundant "(above)" or markdown italics
                    readable = re.sub(r"\s*\(above\)", "", readable).replace("*", "").strip()
                    if url not in sources_by_url:
                        sources_by_url[url] = {
                            "label": dom,
                            "title": readable,
                            "url": url,
                            "tag": tag,
                            "on_screen": on_screen if on_screen != "—" else readable,
                        }
                    else:
                        # Prefer stronger evidence tag V > E > T if cited multiple times
                        rank = {"V": 3, "E": 2, "T": 1}
                        if rank.get(tag, 0) > rank.get(sources_by_url[url]["tag"], 0):
                            sources_by_url[url]["tag"] = tag
                        if len(readable) > len(sources_by_url[url]["title"]) and len(readable) <= 90:
                            sources_by_url[url]["title"] = readable

            # Clean markdown formatting from claim text for web display
            clean_claim = re.sub(r"\*([^*]+)\*", r"\1", claim_text).strip()
            claims_list.append({
                "id": cid,
                "text": clean_claim,
                "tag": tag,
                "status": status_norm.split()[0],
                "on_screen": on_screen if on_screen != "—" else "",
                "url": claim_urls[0] if claim_urls else "",
            })

    # Sort sources alphabetically by readable title / domain for clean ledger display
    sources = sorted(sources_by_url.values(), key=lambda x: (x["title"].lower(), x["label"]))
    return {
        "verified_claims": verified_claims,
        "held_back": held_back,
        "tag_counts": tag_counts,
        "sources": sources,
        "claims": claims_list,
    }


def parse_teleprompter(path: str) -> dict:
    if not os.path.exists(path):
        return {}
    text = open(path, "r", encoding="utf-8").read()
    out = {}
    for key, body in TELE_SECTION_RE.findall(text):
        cleaned = " ".join(line.strip() for line in body.strip().splitlines() if line.strip())
        out[key] = cleaned
    return out


def parse_chapters(raw_chapters: list) -> list[dict]:
    parsed = []
    for item in raw_chapters:
        if isinstance(item, dict):
            parsed.append({"timestamp": item.get("timestamp", ""), "label": item.get("label", "")})
        elif isinstance(item, str):
            parts = item.strip().split(" ", 1)
            if len(parts) == 2 and re.match(r"^\d{1,2}:\d{2}", parts[0]):
                parsed.append({"timestamp": parts[0], "label": parts[1].strip()})
            else:
                parsed.append({"timestamp": "", "label": item.strip()})
    return parsed


def sync() -> tuple[dict, dict]:
    sources_out: dict[str, dict] = {}
    episodes_out: dict[str, dict] = {}

    if not os.path.isdir(EPISODES_DIR):
        raise SystemExit(f"Episodes directory not found: {EPISODES_DIR}")

    for entry in sorted(os.listdir(EPISODES_DIR)):
        m = re.match(r"^ep(\d+)_(.+)$", entry)
        if not m:
            continue
        ep_no, slug = m.group(1).zfill(2), m.group(2)
        ep_dir = os.path.join(EPISODES_DIR, entry)

        claims_path = os.path.join(ep_dir, "01_claims.md")
        publish_path = os.path.join(ep_dir, "07_publish", "publish.json")
        master_path = os.path.join(ep_dir, "03_master_script.json")
        tele_path = os.path.join(ep_dir, "teleprompter.txt")

        claims_data = parse_claims(claims_path) if os.path.exists(claims_path) else {
            "verified_claims": 0, "held_back": 0, "tag_counts": {"V": 0, "E": 0, "T": 0}, "sources": [], "claims": []
        }
        publish_data = json.load(open(publish_path, "r", encoding="utf-8")) if os.path.exists(publish_path) else {}
        master_data = json.load(open(master_path, "r", encoding="utf-8")) if os.path.exists(master_path) else {}
        tele_data = parse_teleprompter(tele_path)

        sources_out[slug] = claims_data

        # Pick 8-10 standout verified facts across the arc for the dossier highlights
        featured_claims = [c for c in claims_data["claims"] if c["url"]][:12]

        episodes_out[slug] = {
            "no": ep_no,
            "slug": slug,
            "runtime_minutes": master_data.get("target_runtime_minutes"),
            "word_count": master_data.get("total_word_count"),
            "structure_variant": master_data.get("structure_variant", ""),
            "chapters": parse_chapters(publish_data.get("chapters") or master_data.get("chapters") or []),
            "shorts": [
                {
                    "id": s.get("short_id", ""),
                    "hook": s.get("beat_1_hook_0_3s", ""),
                    "proof": s.get("beat_2_proof_3_30s", ""),
                    "rollout_day": s.get("rollout_day", ""),
                }
                for s in publish_data.get("shorts", [])
            ],
            "cold_open": tele_data.get("COLD_OPEN_CAM", ""),
            "dyegu_rule": tele_data.get("CLOSING_REFLECTION", ""),
            "comment_prompt": tele_data.get("CLOSING_COMMENT_PROMPT", ""),
            "signoff": tele_data.get("CLOSING_SIGNOFF", ""),
            "verified_claims": claims_data["verified_claims"],
            "held_back": claims_data["held_back"],
            "tag_counts": claims_data["tag_counts"],
            "source_count": len(claims_data["sources"]),
            "featured_claims": featured_claims,
        }

    os.makedirs(CONTENT_DIR, exist_ok=True)
    with open(os.path.join(CONTENT_DIR, "sources.json"), "w", encoding="utf-8") as fh:
        json.dump(sources_out, fh, indent=1, ensure_ascii=False)
        fh.write("\n")
    with open(os.path.join(CONTENT_DIR, "episodes.json"), "w", encoding="utf-8") as fh:
        json.dump(episodes_out, fh, indent=1, ensure_ascii=False)
        fh.write("\n")

    print(f"synced {len(episodes_out)} episodes -> content/sources.json + content/episodes.json")
    for slug, info in episodes_out.items():
        print(f"  ep{info['no']} {slug}: {info['verified_claims']} verified claims ({info['held_back']} held back), {info['source_count']} sources, {len(info['chapters'])} chapters")
    return sources_out, episodes_out


if __name__ == "__main__":
    sync()
