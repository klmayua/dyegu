#!/usr/bin/env python3
"""Prepares and optimizes all visual media for dyegu.co:
  1. Strips bloated C2PA metadata from SVGs in site/assets/
  2. Copies brand/sting.mp4 -> site/assets/sting.mp4
  3. Processes SirK_Profile Pix.jpeg into graded editorial WebP/JPG portrait + avatar
  4. Optimizes studio product renders (mug, journal, playbook) into site/assets/products/*.webp
  5. Generates bespoke 1200x630 Void & Gold Open Graph cards in site/assets/og/
"""
from __future__ import annotations

import math
import os
import re
import shutil
import sys

SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(SITE_ROOT)
ASSETS_DIR = os.path.join(SITE_ROOT, "assets")
PRODUCTS_DIR = os.path.join(ASSETS_DIR, "products")
OG_DIR = os.path.join(ASSETS_DIR, "og")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import STORIES, STAGES


def strip_svg_bloat():
    cleaned = 0
    for dp, _, fns in os.walk(ASSETS_DIR):
        for fn in fns:
            if not fn.endswith(".svg"):
                continue
            p = os.path.join(dp, fn)
            txt = open(p, "r", encoding="utf-8").read()
            new = re.sub(r"<metadata>[\s\S]*?</metadata>", "", txt)
            new = re.sub(r'\s+xmlns:c2pa="[^"]*"', "", new)
            if new != txt:
                open(p, "w", encoding="utf-8").write(new)
                cleaned += 1
    print(f"stripped C2PA metadata from {cleaned} SVG files")


def copy_sting():
    src = os.path.join(PROJECT_ROOT, "brand", "sting.mp4")
    dst = os.path.join(ASSETS_DIR, "sting.mp4")
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"copied brand/sting.mp4 -> site/assets/sting.mp4 ({os.path.getsize(dst) // 1024} KB)")


def export_archival_cards():
    """Exports canonical episode headline cards into site/assets/cards/ so web matches 4K films."""
    from PIL import Image

    cards_out = os.path.join(ASSETS_DIR, "cards")
    os.makedirs(cards_out, exist_ok=True)
    mapping = [
        (os.path.join(PROJECT_ROOT, "episodes", "ep01_steve-jobs", "06_visuals", "cards", "S013.png"), "ep01-fortune-1985.webp"),
    ]
    for src, name in mapping:
        if not os.path.isfile(src):
            continue
        im = Image.open(src).convert("RGB")
        if im.width > 1200:
            im = im.resize((1200, int(1200 * im.height / im.width)), Image.Resampling.LANCZOS)
        dst = os.path.join(cards_out, name)
        im.save(dst, "WEBP", quality=88, method=6)
        print(f"exported archival card -> site/assets/cards/{name} ({os.path.getsize(dst)//1024} KB)")


def apply_editorial_vignette(img, strength: float = 0.52):
    """Subtle dark-room vignette melting photo edges toward pure void #000000."""
    from PIL import Image, ImageChops, ImageDraw, ImageFilter

    w, h = img.size
    mask = Image.new("L", (w, h), 255)
    # Build radial falloff centered slightly above midpoint (portrait face area)
    cx, cy = w * 0.50, h * 0.40
    rx, ry = w * 0.62, h * 0.68
    px = mask.load()
    for y in range(h):
        dy = (y - cy) / ry
        dy2 = dy * dy
        for x in range(w):
            dx = (x - cx) / rx
            d = math.sqrt(dx * dx + dy2)
            if d > 0.68:
                t = min(1.0, (d - 0.68) / 0.58)
                v = int(255 * (1.0 - strength * (t * t)))
                px[x, y] = max(20, v)
    black = Image.new("RGB", (w, h), (0, 0, 0))
    return Image.composite(img, black, mask)


def process_sir_k_portrait():
    from PIL import Image, ImageEnhance, ImageOps

    src = os.path.join(PROJECT_ROOT, "SirK_Profile Pix.jpeg")
    if not os.path.isfile(src):
        print(f"WARN: Sir K portrait not found at {src}")
        return

    base = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    # Clean editorial press JPEG (natural color, lightly refined contrast)
    press = ImageEnhance.Contrast(base).enhance(1.05)
    press_path = os.path.join(ASSETS_DIR, "sir-k-portrait.jpg")
    press.save(press_path, "JPEG", quality=92, optimize=True)

    # Luminous, warm, natural editorial portrait (no heavy gloomy dark vignette)
    graded = ImageEnhance.Contrast(base).enhance(1.04)
    graded = ImageEnhance.Brightness(graded).enhance(1.03)
    graded = ImageEnhance.Color(graded).enhance(1.02)
    graded = apply_editorial_vignette(graded, strength=0.10)
    if graded.width > 900:
        graded = graded.resize((900, int(900 * graded.height / graded.width)), Image.Resampling.LANCZOS)
    graded.save(os.path.join(ASSETS_DIR, "sir-k-portrait.webp"), "WEBP", quality=90, method=6)

    # Tighter circular-safe avatar crop centered on Sir K's face (clean & bright)
    w, h = base.size
    side = int(min(w, h) * 0.72)
    left = max(0, min(w - side, int(w * 0.52 - side / 2)))
    top = max(0, min(h - side, int(h * 0.34 - side / 2)))
    av = base.crop((left, top, left + side, top + side)).resize((280, 280), Image.Resampling.LANCZOS)
    av = ImageEnhance.Contrast(av).enhance(1.04)
    av = ImageEnhance.Brightness(av).enhance(1.03)
    av.save(os.path.join(ASSETS_DIR, "sir-k-avatar.webp"), "WEBP", quality=90, method=6)
    print("generated luminous sir-k-portrait.webp, sir-k-portrait.jpg, sir-k-avatar.webp")


def optimize_studio_renders(render_sources: dict[str, str]):
    from PIL import Image

    os.makedirs(PRODUCTS_DIR, exist_ok=True)
    for key, src in render_sources.items():
        if not src or not os.path.isfile(src):
            continue
        im = Image.open(src).convert("RGB")
        if im.width > 760:
            im = im.resize((760, 760), Image.Resampling.LANCZOS)
        dst = os.path.join(PRODUCTS_DIR, f"{key}.webp")
        im.save(dst, "WEBP", quality=88, method=6)
        print(f"optimized product studio render -> assets/products/{key}.webp ({os.path.getsize(dst)//1024} KB)")


def find_font(candidates: list[str], size: int):
    from PIL import ImageFont

    for path in candidates:
        if os.path.isfile(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def wrap_lines(draw, text: str, font, max_w: int) -> list[str]:
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = f"{cur} {w}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_w or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def generate_og_cards():
    """Generates bespoke 1200x630 Void (#000000) & Gold (#C5A059) Open Graph share cards."""
    from PIL import Image, ImageDraw, ImageOps

    os.makedirs(OG_DIR, exist_ok=True)

    serif_paths = [
        r"C:\Windows\Fonts\georgia.ttf",
        r"C:\Windows\Fonts\times.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    ]
    sans_paths = [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    sans_bold = [
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]

    f_eyebrow = find_font(sans_bold, 20)
    f_title = find_font(serif_paths, 70)
    f_title_sm = find_font(serif_paths, 56)
    f_sub = find_font(sans_paths, 26)
    f_foot = find_font(sans_bold, 18)

    lockup_path = os.path.join(ASSETS_DIR, "dyegu-wordmark-sm.webp")
    lockup = Image.open(lockup_path).convert("RGBA") if os.path.isfile(lockup_path) else None
    if lockup:
        lw = 175
        lh = int(lw * lockup.height / lockup.width)
        lockup = lockup.resize((lw, lh), Image.Resampling.LANCZOS)

    portrait_path = os.path.join(ASSETS_DIR, "sir-k-portrait.webp")
    portrait = Image.open(portrait_path).convert("RGB") if os.path.isfile(portrait_path) else None

    GOLD = (197, 160, 89)
    INK = (236, 231, 220)
    MUTED = (163, 158, 147)
    AXIS = (68, 68, 68)

    def render_card(filename: str, eyebrow: str, title: str, sub: str, include_portrait: bool = False):
        im = Image.new("RGB", (1200, 630), (0, 0, 0))
        d = ImageDraw.Draw(im)

        # Outer hairline frame & corner registers
        d.rectangle([28, 28, 1172, 602], outline=(38, 38, 38), width=1)
        for x, y, dx, dy in [(28, 28, 22, 22), (1172, 28, -22, 22), (28, 602, 22, -22), (1172, 602, -22, -22)]:
            d.line([(x, y), (x + dx, y)], fill=GOLD, width=2)
            d.line([(x, y), (x, y + dy)], fill=GOLD, width=2)

        text_max_w = 640 if (include_portrait and portrait) else 1010

        # Top wordmark
        if lockup:
            im.paste(lockup, (76, 68), lockup)
        else:
            d.text((76, 74), "DYEGU", fill=GOLD, font=f_eyebrow)

        # Optional portrait on right for Speaking / About
        if include_portrait and portrait:
            pw, ph = 370, 440
            p_fit = ImageOps.fit(portrait, (pw, ph), method=Image.Resampling.LANCZOS, centering=(0.5, 0.35))
            im.paste(p_fit, (756, 95))
            d.rectangle([756, 95, 756 + pw, 95 + ph], outline=GOLD, width=1)

        # Eyebrow + gold hairline rule
        y = 166
        d.text((76, y), eyebrow.upper(), fill=GOLD, font=f_eyebrow)
        y += 38
        d.line([(76, y), (200, y)], fill=GOLD, width=2)
        y += 26

        # Title
        font_use = f_title if len(title) <= 28 else f_title_sm
        lines = wrap_lines(d, title, font_use, text_max_w)[:3]
        for ln in lines:
            d.text((76, y), ln, fill=INK, font=font_use)
            y += 78 if font_use is f_title else 66

        # Subtitle
        y += 14
        sub_lines = wrap_lines(d, sub, f_sub, text_max_w)[:3]
        for ln in sub_lines:
            d.text((76, y), ln, fill=MUTED, font=f_sub)
            y += 36

        # Bottom axis rule & footer caption
        d.line([(76, 542), (710 if (include_portrait and portrait) else 1124, 542)], fill=AXIS, width=1)
        d.text((76, 558), "DON'T YOU EVER GIVE UP  ·  DOCUMENTED COMEBACKS  ·  DYEGU.CO", fill=GOLD, font=f_foot)

        im.save(os.path.join(OG_DIR, filename), "JPEG", quality=88, optimize=True)

    # Generate story OG cards
    for s in STORIES:
        if s.get("live_page"):
            render_card(
                f"story-{s['slug']}.jpg",
                f"DYEGU · Episode {s['no']} · Documented Comeback",
                s["subject"],
                s["fall"],
            )

    # Generate stage OG cards
    for st in STAGES:
        render_card(
            f"start-{st['key']}.jpg",
            f"Where are you right now? · {st['tag']}",
            st["title"],
            st["sub"],
        )

    # Core section cards
    render_card("speaking.jpg", "Keynotes & Workshops", "Bring Sir K to your people.", "Documented comebacks, resilience grounded in evidence, and twenty years of building companies.", include_portrait=True)
    render_card("about.jpg", "Host & Documentary House", "Sir K & DYEGU", "True, primary-sourced stories of people who lost it all and rebuilt.", include_portrait=True)
    render_card("stories.jpg", "Season 1 · 14 Sundays", "Documented Comebacks", "Real people, checked facts, and published sources — every Sunday at 15:00 WAT.")
    render_card("community.jpg", "DYEGU Community · Free", "Nobody rebuilds alone.", "Six-week Rebuild Circles and live sessions with vetted volunteer experts.")
    render_card("playbook.jpg", "Coming January 2027 · $19", "The Rebuild Playbook", "The patterns behind every comeback in Season 1, turned into a practical workbook.")
    render_card("shop.jpg", "DYEGU Shop · Drop 01", "Rise", "Matte black, flat gold, and the phoenix. Small runs, never discounted.")

    print(f"generated {len(os.listdir(OG_DIR))} bespoke OG cards -> site/assets/og/")


def main():
    strip_svg_bloat()
    copy_sting()
    try:
        import PIL  # noqa: F401
    except ImportError:
        print("WARN: Pillow not installed; skipping image grading & OG generation.")
        return

    process_sir_k_portrait()
    export_archival_cards()
    # Optional CLI args for studio renders: key=path
    renders = {}
    for arg in sys.argv[1:]:
        if "=" in arg:
            k, v = arg.split("=", 1)
            renders[k.strip()] = v.strip()
    if renders:
        optimize_studio_renders(renders)
    generate_og_cards()


if __name__ == "__main__":
    main()
