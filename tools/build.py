#!/usr/bin/env python3
"""Builds every HTML page, .ics calendar feed, and sitemap of dyegu.co.

Usage:
  python tools/build.py            # rebuild all HTML + calendars + sitemap
  python tools/build.py --sync     # first re-sync claims, chapters & DYEGU Rules from ../episodes/
"""
from __future__ import annotations

import datetime as dt
import html
import json
import os
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import (
    CIRCLE_WEEKS,
    PLAYBOOK_CHAPTERS,
    PLAYBOOK_SAMPLE,
    PRODUCTS,
    SESSION_TOPICS,
    SITE,
    SPEAKER_KIT,
    STAGES,
    STORIES,
    SUPPORT_URL,
    VOLUNTEER_FORMATS,
    YOUTUBE,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGE = {s["key"]: s for s in STAGES}
e = html.escape

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">'
)

NAV = [
    ("/#start", "Find your story"),
    ("/stories", "Stories"),
    ("/community", "Community"),
    ("/playbook", "Playbook"),
    ("/shop", "Shop"),
    ("/speaking", "Speaking"),
]

# Minimal single-stroke Brand Bible gold hairline icons for the 8 life stages
STAGE_ICONS = {
    "job": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
    "money": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    "breakup": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s-7-4.5-9-9.2C1.6 8.3 4.2 5 7.5 5c1.9 0 3.5 1 4.5 2.5C13 6 14.6 5 16.5 5 19.8 5 22.4 8.3 21 11.8 19 16.5 12 21 12 21z"/></svg>',
    "health": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 12h4l2.5-6 4 12 2.5-6H21"/></svg>',
    "rejected": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 20V4h11v16"/><path d="M15 12h6m-3-3 3 3-3 3"/><circle cx="11.5" cy="12" r=".8" fill="currentColor"/></svg>',
    "later": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    "stuck": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="15.5,8.5 13.4,13.4 8.5,15.5 10.6,10.6"/></svg>',
    "grief": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 3v18"/><path d="M6 15c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M4 21h16"/></svg>',
}

TAG_LABELS = {
    "V": "Primary record",
    "E": "Established reporting",
    "T": "Subject's own words",
}


def load_data():
    src_path = os.path.join(ROOT, "content", "sources.json")
    ep_path = os.path.join(ROOT, "content", "episodes.json")
    if "--sync" in sys.argv or not os.path.isfile(ep_path):
        import sync_episodes
        sync_episodes.sync()
    sources = json.load(open(src_path, "r", encoding="utf-8")) if os.path.isfile(src_path) else {}
    episodes = json.load(open(ep_path, "r", encoding="utf-8")) if os.path.isfile(ep_path) else {}
    return sources, episodes


SOURCES: dict = {}
EPISODES: dict = {}

_uid = [0]
def uid() -> str:
    _uid[0] += 1
    return f"u{_uid[0]}"


def product_img(key: str) -> str:
    if os.path.isfile(os.path.join(ROOT, "assets", "products", f"{key}.webp")):
        return f"/assets/products/{key}.webp"
    return f"/assets/products/{key}.svg"


def og_image_for(name: str | None) -> str:
    if name and os.path.isfile(os.path.join(ROOT, "assets", "og", name)):
        return f"{SITE}/assets/og/{name}"
    return f"{SITE}/assets/og.jpg"


def gcal_url(title: str, iso_start: str, details: str) -> str:
    start = dt.datetime.fromisoformat(iso_start.replace("Z", "+00:00"))
    end = start + dt.timedelta(minutes=30)
    fmt = "%Y%m%dT%H%M%SZ"
    params = urllib.parse.urlencode({
        "action": "TEMPLATE",
        "text": title,
        "dates": f"{start.strftime(fmt)}/{end.strftime(fmt)}",
        "details": details,
        "location": YOUTUBE,
    })
    return f"https://calendar.google.com/calendar/render?{params}"


def build_ics_event(uid_str: str, title: str, iso_start: str, desc: str) -> str:
    start = dt.datetime.fromisoformat(iso_start.replace("Z", "+00:00"))
    end = start + dt.timedelta(minutes=30)
    fmt = "%Y%m%dT%H%M%SZ"
    now_stamp = dt.datetime.now(dt.timezone.utc).strftime(fmt)
    clean_desc = desc.replace("\n", "\\n").replace(",", "\\,")
    return (
        "BEGIN:VEVENT\r\n"
        f"UID:{uid_str}@dyegu.co\r\n"
        f"DTSTAMP:{now_stamp}\r\n"
        f"DTSTART:{start.strftime(fmt)}\r\n"
        f"DTEND:{end.strftime(fmt)}\r\n"
        f"SUMMARY:{title}\r\n"
        f"DESCRIPTION:{clean_desc}\r\n"
        f"URL:{YOUTUBE}\r\n"
        "END:VEVENT\r\n"
    )


def generate_calendars() -> list[str]:
    out = []
    cal_dir = os.path.join(ROOT, "assets", "calendar")
    os.makedirs(cal_dir, exist_ok=True)
    all_events = []
    for s in STORIES:
        ev_title = f"DYEGU Episode {s['no']} Premiere: {s['subject']}"
        ev_desc = f"{s['fall']} Watch on YouTube (@DYEGUOfficial) or read verified sources at {SITE}/stories."
        ev = build_ics_event(f"ep{s['no']}-{s['slug']}", ev_title, s["date"], ev_desc)
        all_events.append(ev)
        if s.get("live_page"):
            ics = (
                "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DYEGU//Season 1//EN\r\n"
                "CALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n" + ev + "END:VCALENDAR\r\n"
            )
            rel = f"assets/calendar/ep{s['no']}-{s['slug']}.ics"
            open(os.path.join(ROOT, rel), "w", encoding="utf-8", newline="").write(ics)
            out.append(rel)

    season_ics = (
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DYEGU//Season 1//EN\r\n"
        "X-WR-CALNAME:DYEGU Season 1 Premieres\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n"
        + "".join(all_events)
        + "END:VCALENDAR\r\n"
    )
    rel_all = "assets/calendar/dyegu-season1.ics"
    open(os.path.join(ROOT, rel_all), "w", encoding="utf-8", newline="").write(season_ics)
    out.append(rel_all)
    return out


def breadcrumb_ld(items: list[tuple[str, str]]) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": idx + 1, "name": name, "item": SITE + path}
            for idx, (name, path) in enumerate(items)
        ],
    }


def jsonld_tags(blocks: list[dict] | None) -> str:
    if not blocks:
        return ""
    return "".join(
        f'<script type="application/ld+json">{json.dumps(b, ensure_ascii=False)}</script>\n'
        for b in blocks
    )


def layout(
    path: str,
    title: str,
    desc: str,
    body: str,
    join_band: bool = True,
    noindex: bool = False,
    og_file: str | None = None,
    ld: list[dict] | None = None,
    join_href: str = "#join",
    reading_bar: bool = False,
) -> str:
    url = SITE + (path if path != "/" else "/")
    nav = "".join(
        f'<a href="{h}"{" aria-current=page" if (h == path or (h != "/#start" and path.startswith(h + "/"))) else ""}>{t}</a>'
        for h, t in NAV
    )
    band = join_form_band(path) if join_band else ""
    og_img = og_image_for(og_file)
    progress = '<div class="read-progress" aria-hidden="true"></div>' if reading_bar else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
{'<meta name="robots" content="noindex">' if noindex else ''}
<meta name="theme-color" content="#000000">
<meta property="og:type" content="website"><meta property="og:site_name" content="DYEGU">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{og_img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
{FONTS}
<link rel="stylesheet" href="/styles.css">
{jsonld_tags(ld)}</head>
<body>
{progress}<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/" aria-label="DYEGU home"><img src="/assets/dyegu-wordmark-sm.webp" srcset="/assets/dyegu-wordmark-sm.webp 1x, /assets/dyegu-wordmark.webp 2x" alt="DYEGU" width="560" height="139"></a>
    <nav class="nav" aria-label="Main">{nav}</nav>
    <a class="btn btn-gold btn-sm header-cta" href="{join_href}">Join free</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden>{nav}</nav>
</header>
<main id="main">
{body}
</main>
{band}
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div><img src="/assets/dyegu-lockup.webp" alt="DYEGU — Don't You Ever Give Up" width="1400" height="424" class="footer-lockup" loading="lazy"></div>
    <div class="footer-cols">
      <div><p class="eyebrow">Find your story</p>{''.join(f'<a href="/start/{s["key"]}">{e(s["short"])}</a>' for s in STAGES)}</div>
      <div><p class="eyebrow">Community</p><a href="/community/circles">Rebuild Circles</a><a href="/community/sessions">Free expert sessions</a><a href="/volunteer">Volunteer as an expert</a><a href="/community/guidelines">Safety &amp; guidelines</a></div>
      <div><p class="eyebrow">DYEGU</p><a href="/stories">Stories</a><a href="/playbook">Rebuild Playbook</a><a href="/shop">Shop</a><a href="/share">Share your rebuild</a><a href="/about">About Sir K</a></div>
      <div><p class="eyebrow">Work with us</p><a href="/speaking">Talks &amp; workshops</a><a href="/studio">Sponsors &amp; partners</a><a href="/privacy">Privacy</a></div>
      <div><p class="eyebrow">Follow</p><div class="follow-links" data-follow></div></div>
    </div>
  </div>
  <div class="wrap support-line">
    <p><strong>Struggling right now?</strong> If you're thinking about suicide or self-harm, please contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" rel="noopener" target="_blank">Find a free, confidential helpline in your country</a>.</p>
  </div>
  <div class="wrap footer-legal">
    <p>Presented and narrated by Sir K. Researched with AI assistance and checked against the sources listed with each episode.</p>
    <p>© <span data-year>2026</span> DYEGU. All rights reserved.</p>
  </div>
</footer>
<script src="/app.js" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
"""


def stage_select(name="stage", required=False, label="Where are you right now? (optional)"):
    opts = "".join(f'<option value="{s["key"]}">{e(s["short"])}</option>' for s in STAGES)
    return (
        f'<label for="f-{name}-{{uid}}">{label}</label>'
        f'<select id="f-{name}-{{uid}}" name="{name}"{" required" if required else ""}><option value="">Choose one</option>{opts}</select>'
    )


def signup_form(
    list_="comeback_file",
    button="Subscribe free",
    stage=None,
    fine="Free. One email a week. Unsubscribe anytime.",
    success=None,
    ask_stage=False,
    center=False,
    extra="",
):
    u = uid()
    attrs = f'data-table="subscribers" data-list="{list_}"'
    if stage:
        attrs += f' data-stage="{stage}"'
    if success:
        attrs += f' data-success="{e(success)}"'
    sel = stage_select().replace("{uid}", u) if ask_stage else ""
    return f"""<form class="js-form signup{' signup-center' if center else ''}" {attrs} novalidate>
  {extra}
  <label class="sr-only" for="{u}-email">Email address</label>
  <div class="field-row">
    <input id="{u}-email" name="email" type="email" autocomplete="email" placeholder="Your email" required>
    <button class="btn btn-gold" type="submit">{button}</button>
  </div>
  {('<div class="stage-pick">' + sel + '</div>') if sel else ''}
  <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="fine">{fine} <a href="/privacy">Privacy</a></p>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>"""


def join_form_band(path: str) -> str:
    stage = path.split("/start/")[1] if path.startswith("/start/") else None
    return f"""<section class="join-band grain-surface" id="join">
  <div class="wrap join-grid">
    <div>
      <p class="eyebrow eyebrow-rule">The Comeback File · free, weekly</p>
      <h2 class="h3">One story. One lesson. One move for your week.</h2>
      <p class="muted">From Sir K, every Sunday. Subscribers also get The Rebuild Playbook first, at the early price, plus early invites to Rebuild Circles.</p>
    </div>
    {signup_form(stage=stage, ask_stage=not stage)}
  </div>
</section>"""


def story_card(s: dict, compact: bool = False) -> str:
    live = s.get("live_page")
    ep_meta = EPISODES.get(s["slug"], {})
    tag = "a" if live else "div"
    href = f' href="/stories/{s["slug"]}"' if live else ""
    badge = "Dossier ready" if live else ("Special · 90 min" if s.get("special") else ("Announced soon" if s.get("tbc") else "In production"))
    badge_cls = "ep-badge live" if live else "ep-badge"
    extra_cls = " ep-special" if s.get("special") else ("" if live else " ep-soon")
    claims_note = f"{ep_meta['verified_claims']} verified claims" if ep_meta.get("verified_claims") else s.get("arc", "")
    stages_attr = ",".join(s.get("stages", []))
    return f"""<{tag} class="ep{extra_cls}"{href} data-date="{s['date']}" data-slug="{s['slug']}" data-stages="{stages_attr}" data-reveal>
  <div class="ep-top"><span class="ep-no">{s['no']}</span><span class="{badge_cls}">{e(badge)}</span></div>
  <p class="ep-cat">{e(s.get('category', 'Season 1'))}</p>
  <h3 class="ep-subject">{e(s['subject'])}</h3>
  <p class="ep-tease">{e(s['fall'])}{(' ' + e(s['rise'])) if s.get('rise') and not compact else ''}</p>
  <div class="ep-foot">
    <p class="ep-when"></p>
    <span class="small muted">{e(claims_note)}</span>
  </div>
</{tag}>"""


def stage_tiles() -> str:
    tiles = []
    for s in STAGES:
        cnt = sum(1 for st in STORIES if s["key"] in st.get("stages", []))
        icon = STAGE_ICONS.get(s["key"], "")
        tiles.append(
            f'<a class="stage-tile" href="/start/{s["key"]}" data-reveal>'
            f'<div class="stage-tile-top">{icon}<span class="stage-count">{cnt} {"story" if cnt == 1 else "stories"}</span></div>'
            f'<div><span class="stage-tile-title">{e(s["short"])}</span><span class="stage-tile-sub">{e(s["sub"])}</span></div>'
            f'<div class="stage-tile-foot"><span>3 moves + stories</span><span aria-hidden="true">→</span></div>'
            f'</a>'
        )
    return "".join(tiles)


def premiere_card(
    ep_no: str = "01",
    subject: str = "Steve Jobs",
    iso_date: str = "2026-12-06T14:00:00Z",
    date_label: str = "Sunday 6 December 2026",
    ics_path: str = "/assets/calendar/ep01-steve-jobs.ics",
    show_sting: bool = False,
) -> str:
    gcal = gcal_url(
        f"DYEGU Episode {ep_no} Premiere: {subject}",
        iso_date,
        f"Watch Episode {ep_no} ({subject}) on YouTube @DYEGUOfficial — presented by Sir K.",
    )
    media_top = (
        '<div class="sting-frame">'
        '<video autoplay muted playsinline preload="metadata" poster="/assets/og.jpg">'
        '<source src="/assets/sting.mp4" type="video/mp4">'
        '</video>'
        '<span class="sting-badge">Official Ident · 4K</span>'
        '<button class="sting-replay" type="button" data-sting-replay aria-label="Replay DYEGU title sting">Replay</button>'
        '</div>'
        if show_sting and os.path.isfile(os.path.join(ROOT, "assets", "sting.mp4"))
        else '<img class="premiere-mark" src="/assets/phoenix.svg" alt="" width="100" height="114">'
    )
    return f"""<div class="premiere-card" id="premiere">
  {media_top}
  <p class="eyebrow">Episode {ep_no} premieres</p>
  <p class="premiere-date">{date_label}</p>
  <p class="premiere-time" data-premiere-time>15:00 WAT · 14:00 GMT · 09:00 ET</p>
  <div class="countdown" data-countdown aria-label="Time until premiere">
    <div><span data-u="d">--</span><small>days</small></div>
    <div><span data-u="h">--</span><small>hours</small></div>
    <div><span data-u="m">--</span><small>min</small></div>
    <div><span data-u="s">--</span><small>sec</small></div>
  </div>
  <div class="premiere-actions">
    <a class="btn btn-gold btn-sm" href="{YOUTUBE}?sub_confirmation=1" rel="noopener" target="_blank">Subscribe on YouTube</a>
    <a class="btn btn-ghost btn-sm" href="{ics_path}" download>Add to calendar (.ics)</a>
  </div>
  <div class="premiere-cal">
    <a href="{e(gcal)}" target="_blank" rel="noopener">Google Calendar</a>
    <span>·</span>
    <a href="/assets/calendar/dyegu-season1.ics" download>All 14 Sundays (.ics)</a>
  </div>
</div>"""


def sir_k_portrait(caption: str = "Sir K · Creator & Host of DYEGU") -> str:
    return f"""<figure class="portrait-frame" style="margin:0">
  <picture>
    <source srcset="/assets/sir-k-portrait.webp" type="image/webp">
    <img src="/assets/sir-k-portrait.jpg" alt="Portrait of Sir K, creator and host of DYEGU" width="800" height="1000" loading="lazy">
  </picture>
  <figcaption class="portrait-caption">{e(caption)}</figcaption>
</figure>"""


# ------------------------------------------------------------------ pages
def page_home():
    live = [s for s in STORIES if s.get("live_page")]
    total_claims = sum(ep.get("verified_claims", 0) for ep in EPISODES.values())
    total_sources = sum(ep.get("source_count", 0) for ep in EPISODES.values())

    compass_modal = f"""<div class="modal" id="compass-modal" role="dialog" aria-modal="true" aria-labelledby="compass-title" hidden>
  <div class="modal-card">
    <button class="modal-close" type="button" data-close-compass aria-label="Close">×</button>
    <p class="eyebrow eyebrow-rule">15-second starting compass</p>
    <h2 class="h3" id="compass-title">Which sentence feels heaviest this week?</h2>
    <p class="muted small">Pick the closest match. Nothing you click here is sent to a server.</p>
    <div class="compass-opts">
      <button class="compass-opt" type="button" data-compass-pick="job"><span>My career or role ended, and it knocked my footing.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="money"><span>A business failed, debt grew, or the money ran dry.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="rejected"><span>I keep putting work out and hearing no.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="health"><span>My body or health changed the plan for my life.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="breakup"><span>A marriage or relationship ended and life changed shape.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="later"><span>I am rebuilding at 40, 50 or later with real responsibilities.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="stuck"><span>Nothing collapsed — I just feel lost and out of motion.</span><span>→</span></button>
      <button class="compass-opt" type="button" data-compass-pick="grief"><span>I am carrying a deep loss and trying to steady myself.</span><span>→</span></button>
    </div>
    <div class="compass-result" data-compass-result hidden></div>
  </div>
</div>"""

    body = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="hero-byline">
        <img class="hero-avatar" src="/assets/sir-k-avatar.webp" alt="Sir K" width="42" height="42">
        <p class="eyebrow">True comeback documentaries · presented by Sir K</p>
      </div>
      <h1 class="display">Don't you ever<br><em>give up.</em></h1>
      <p class="lede">Lost your job, your business, your health, your marriage or your way? You're not the first, and you won't be the last to rebuild. Every Sunday, Sir K tells the documented story of someone who lost it all and came back — and the exact move you can take from it.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#start">Find the story for where you are</a>
        <a class="btn btn-ghost" href="#join">Get the weekly Comeback File</a>
      </div>
      <div class="trust-bar" aria-label="Series credentials">
        <span><strong>14</strong> Season 1 documentaries</span>
        <span><strong>{total_claims}</strong> verified claims in Batch 1</span>
        <span><strong>{total_sources}</strong> published sources</span>
        <span><strong>$0</strong> free peer community</span>
      </div>
    </div>
    <div class="hero-media" data-latest>{premiere_card(show_sting=True)}</div>
  </div>
</section>

<section class="section" id="start">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Start here</p>
    <h2 class="h2">Where are you right now?</h2>
    <p class="lede">Pick the chapter closest to your life today. You'll get matched documentaries, an interactive 7-day move checklist you can print, and a free circle at your stage.</p>
    <div class="stage-grid">{stage_tiles()}</div>
    <div class="compass-trigger">
      <p><strong>Not sure which one fits?</strong> Take 15 seconds with our private starting compass — no email required.</p>
      <button class="btn btn-subtle btn-sm" type="button" data-open-compass>Open starting compass</button>
    </div>
  </div>
</section>

<section class="section section-alt grain-surface" id="standard">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">The DYEGU standard</p>
    <h2 class="h2">Comebacks you can check.</h2>
    <div class="pillars" data-reveal>
      <article><span class="num">I</span><h3>Real people</h3><p>Names you know. People who held real status, health, money or fame, lost it in public, and climbed back without shortcuts.</p></article>
      <article><span class="num">II</span><h3>Documented receipts</h3><p>Every claim is audited against primary records or two independent reports, and every source is published on the story's dossier page.</p></article>
      <article><span class="num">III</span><h3>Zero invention</h3><p>No fabricated inner monologues, no guessed net worths, no sensationalised trauma. The documented truth is dramatic enough.</p></article>
    </div>
  </div>
</section>

<section class="section" id="episodes">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow eyebrow-rule">Season 1 · every Sunday at 15:00 WAT</p><h2 class="h2">Opening three dossiers</h2></div>
      <a class="link-gold" href="/stories">Explore all 14 Season 1 stories →</a>
    </div>
    <div class="episodes" data-episodes>{''.join(story_card(s) for s in live)}</div>
  </div>
</section>

<section class="section section-alt grain-surface">
  <div class="wrap offer-grid">
    <a class="offer offer-link offer-shop" href="/playbook" data-reveal>
      <img src="{product_img('playbook')}" alt="The Rebuild Playbook cover" width="460" height="460" loading="lazy">
      <div>
        <p class="eyebrow">Coming January 2027 · $19</p>
        <h2 class="h3">The Rebuild Playbook</h2>
        <p>The patterns behind every comeback in Season 1, turned into a 7-chapter field workbook. Includes a free Chapter 1 sample inside.</p>
        <span class="link-gold">Look inside &amp; join waitlist →</span>
      </div>
    </a>
    <a class="offer offer-link offer-shop" href="/shop" data-reveal>
      <img src="{product_img('mug')}" alt="The DYEGU Studio Mug" width="460" height="460" loading="lazy">
      <div>
        <p class="eyebrow">Drop 01 · Rise</p>
        <h2 class="h3">Wear the reminder</h2>
        <p>The matte-black Studio Mug on Sir K's desk, the heavyweight Rise tee and hoodie, the phoenix cap, and the linen Rebuild Journal.</p>
        <span class="link-gold">Preview Drop 01 →</span>
      </div>
    </a>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow eyebrow-rule">DYEGU Community · always free</p><h2 class="h2">Nobody rebuilds alone.</h2></div>
      <a class="link-gold" href="/community">How the community works →</a>
    </div>
    <div class="doors" data-reveal>
      <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h3 class="h3">Rebuild Circles</h3><p>Six weeks with six to eight people at your exact stage and time zone, guided by a trained volunteer host.</p><span class="link-gold">Join a circle →</span></a>
      <a class="door" href="/community/sessions"><p class="eyebrow">Expert help</p><h3 class="h3">Free expert sessions</h3><p>Vetted recruiters, accountants, lawyers and founders giving practical, pitch-free guidance live.</p><span class="link-gold">Request a session →</span></a>
      <a class="door" href="/volunteer"><p class="eyebrow">Give back</p><h3 class="h3">Volunteer as an expert</h3><p>Give an hour a month of hard-won expertise to someone rebuilding after a major setback.</p><span class="link-gold">Apply to volunteer →</span></a>
    </div>
  </div>
</section>

<section class="section section-alt grain-surface">
  <div class="wrap share-strip" data-reveal>
    <div>
      <p class="eyebrow eyebrow-rule">Your story matters too</p>
      <h2 class="h2">Tell us your rebuild.</h2>
      <p class="lede">Halfway through the wilderness or standing on the other side, we read every story privately. With your explicit permission, selected stories are featured in The Comeback File.</p>
    </div>
    <a class="btn btn-gold" href="/share">Share your story</a>
  </div>
</section>

<section class="section" id="host">
  <div class="wrap host" data-reveal>
    {sir_k_portrait()}
    <div>
      <p class="eyebrow eyebrow-rule">Your host</p>
      <h2 class="h2">Sir K</h2>
      <p class="lede">Sir K has spent more than twenty years building companies, teams and technology across Africa and beyond — and has had to rebuild more than once. DYEGU is the documentary house he wanted when things went wrong: real people, verified facts, and the honest craft of coming back.</p>
      <div class="host-stats">
        <div><strong>20+ yrs</strong><span>Building ventures &amp; teams</span></div>
        <div><strong>100%</strong><span>Human-narrated &amp; sourced</span></div>
        <div><strong>Global</strong><span>US · UK · Europe · Africa</span></div>
      </div>
      <p class="signoff">“Until the next story… don't you ever give up.”</p>
      <p><a class="link-gold" href="/about">More about Sir K &amp; studio method →</a> &nbsp;&nbsp; <a class="link-gold" href="/speaking">Book Sir K to speak →</a></p>
    </div>
  </div>
</section>
{compass_modal}
"""
    ld = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DYEGU — Don't You Ever Give Up",
            "url": SITE,
            "logo": f"{SITE}/assets/icon-512.png",
            "sameAs": [YOUTUBE, "https://www.instagram.com/dyegulive", "https://x.com/dyegulive", "https://www.facebook.com/dyegulive"],
        },
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sir K",
            "jobTitle": "Creator & Documentary Host",
            "worksFor": {"@type": "Organization", "name": "DYEGU"},
            "image": f"{SITE}/assets/sir-k-portrait.jpg",
            "url": f"{SITE}/about",
        },
    ]
    return layout(
        "/",
        "DYEGU — Don't You Ever Give Up · True comeback stories with Sir K",
        "Lost your job, business, health, marriage or way? True, documented stories of people who lost it all and rebuilt, told by Sir K every Sunday, plus moves for your own comeback.",
        body,
        ld=ld,
    )


def page_stage(s: dict):
    stories = [x for x in STORIES if s["key"] in x["stages"]]
    moves_html = []
    for idx, (t, d, day) in enumerate(s["moves"]):
        moves_html.append(
            f'<li>'
            f'<label class="move-check-row">'
            f'<input type="checkbox" aria-label="Mark move {idx + 1} complete">'
            f'<div><span class="move-day">{e(day)}</span><h3>{e(t)}</h3><p>{e(d)}</p></div>'
            f'</label>'
            f'</li>'
        )
    others = "".join(f'<a href="/start/{o["key"]}">{e(o["short"])}</a>' for o in STAGES if o["key"] != s["key"])
    support = (
        f'<aside class="care-note"><p><strong>If it\'s more than a setback right now:</strong> please talk to a doctor, a counsellor or someone you trust. If you\'re thinking about suicide or self-harm, contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>'
        if s.get("sensitive")
        else ""
    )
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/#start">Where are you right now?</a> · {e(s['tag'])}</p>
    <h1 class="display-sm">{e(s['title'])}</h1>
    <p class="lede">{e(s['lede'])}</p>
    <div class="stage-rule-banner">
      <p class="eyebrow" style="margin-bottom:8px">The DYEGU perspective</p>
      <blockquote>“{e(s['rule_preview'])}”</blockquote>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Your 7-day rebuild moves</h2>
    <div class="checklist-bar">
      <span class="checklist-status" data-checklist-status><strong>0 of 3</strong> moves completed this week</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-subtle btn-sm" type="button" data-print-plan>Print / save 1-page plan</button>
        <button class="btn btn-ghost btn-sm" type="button" data-quote-card data-quote="{e(s['rule_preview'])}" data-subject="{e(s['short'])}">Save rule card</button>
      </div>
    </div>
    <ol class="moves" data-checklist="{s['key']}">{''.join(moves_html)}</ol>
    {support}
    <div class="stage-bridge">
      <div>
        <p class="eyebrow" style="margin-bottom:6px">Don't carry this alone · Free</p>
        <h3>Join a Rebuild Circle for this stage</h3>
        <p>Meet 6–8 people navigating the exact same chapter in your time zone, once a week for six weeks.</p>
      </div>
      <a class="btn btn-gold btn-sm" href="/community/circles?stage={s['key']}">Join matching circle →</a>
    </div>
  </div>
</section>

<section class="section section-alt grain-surface">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Stories for where you are</p>
    <h2 class="h2">They've stood right here.</h2>
    <div class="episodes" data-episodes>{''.join(story_card(x, compact=True) for x in stories)}</div>
  </div>
</section>

<section class="section" id="stage-join">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">{e(s["short"])}</p>
    <h2 class="h2">Get one story and one move a week, picked for where you are.</h2>
    {signup_form(stage=s['key'], button="Send me the Comeback File", center=True, success="You're in. Your first Comeback File arrives with Episode 01. Until then, start with move one above.")}
  </div>
</section>

<section class="section-tight section-alt grain-surface">
  <div class="wrap">
    <p class="eyebrow">Navigating another chapter?</p>
    <div class="chip-row">{others}</div>
  </div>
</section>
"""
    ld = [breadcrumb_ld([("Home", "/"), ("Find your story", "/#start"), (s["short"], f"/start/{s['key']}")])]
    return layout(
        f"/start/{s['key']}",
        f"{s['title']} — stories and moves for your comeback · DYEGU",
        s["lede"],
        body,
        join_band=False,
        join_href="#stage-join",
        og_file=f"start-{s['key']}.jpg",
        ld=ld,
    )


def page_stories():
    filter_chips = '<button class="filter-chip active" type="button" data-filter-stage="all" aria-pressed="true">All 14 episodes</button>' + "".join(
        f'<button class="filter-chip" type="button" data-filter-stage="{s["key"]}" aria-pressed="false">{e(s["short"])}</button>'
        for s in STAGES
    )
    body = f"""
<section class="page-hero">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Season 1 · 14 Sundays · 6 December 2026 – 7 March 2027</p>
    <h1 class="display-sm">Stories</h1>
    <p class="lede">Every episode profiles one person who had real status, health, money or acclaim, lost it in public, and rebuilt. Every published story page carries the complete verification ledger.</p>
    <div class="hero-actions" style="margin-top:8px">
      <a class="btn btn-ghost btn-sm" href="/assets/calendar/dyegu-season1.ics" download>Subscribe to all 14 Sunday premieres (.ics)</a>
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="filter-bar" data-story-filters role="group" aria-label="Filter Season 1 by life stage">
      <span class="filter-label">Filter by stage:</span>
      {filter_chips}
    </div>
    <p class="filter-meta" data-filter-count>Showing {len(STORIES)} of {len(STORIES)} Season 1 episodes</p>
    <div class="episodes" data-episodes>{''.join(story_card(s) for s in STORIES)}</div>
    <p class="muted small" style="margin-top:28px">Full research dossiers unlock as each batch clears Gate 1A/1B. <a class="link-gold" href="#join">Get new dossiers in The Comeback File →</a></p>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Stories", "/stories")])]
    return layout(
        "/stories",
        "Stories — Complete Season 1 Slate (14 Documentaries) · DYEGU",
        "All 14 documented comeback stories in DYEGU Season 1: Steve Jobs, J.K. Rowling, Tyler Perry, Nwankwo Kanu, Brendan Fraser, Tina Turner, and more.",
        body,
        og_file="stories.jpg",
        ld=ld,
    )


def page_story(i: int, s: dict):
    src = SOURCES.get(s["slug"], {"sources": [], "verified_claims": 0, "held_back": 0, "tag_counts": {}, "claims": []})
    ep = EPISODES.get(s["slug"], {})
    nxt = next((x for x in STORIES[i + 1:] if x.get("live_page")), None)
    stage_links = "".join(f'<a href="/start/{k}">{e(STAGE[k]["short"])}</a>' for k in s["stages"])

    # Chapters timeline (Brand Bible #444444 axis + #C5A059 nodes)
    chapters = ep.get("chapters", [])
    chapters_html = ""
    if chapters:
        ch_items = "".join(
            f'<li><span class="axis-time">{e(c["timestamp"])}</span><h3 class="axis-title">{e(c["label"])}</h3></li>'
            for c in chapters
        )
        chapters_html = f"""<section class="section-tight">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Episode anatomy</p>
    <h2 class="h3">Chapters &amp; arc</h2>
    <ol class="axis-timeline">{ch_items}</ol>
  </div>
</section>"""

    # Signature Segment: The DYEGU Rule
    rule_text = ep.get("dyegu_rule", "")
    comment_prompt = ep.get("comment_prompt", "")
    rule_html = ""
    if rule_text:
        rule_html = f"""<section class="section-tight section-alt grain-surface">
  <div class="wrap narrow">
    <div class="dyegu-rule-box" data-reveal>
      <div class="dyegu-rule-head">
        <img class="dyegu-rule-avatar" src="/assets/sir-k-avatar.webp" alt="Sir K" width="56" height="56" loading="lazy">
        <div>
          <p class="eyebrow" style="margin:0">Signature reflection · Sir K</p>
          <h2 class="h3" style="margin:4px 0 0">The DYEGU Rule</h2>
        </div>
      </div>
      <blockquote class="dyegu-rule-quote">“{e(rule_text)}”</blockquote>
      {f'<p class="dyegu-rule-prompt"><strong>Reflection question:</strong> {e(comment_prompt)}</p>' if comment_prompt else ''}
      <div class="dyegu-rule-actions">
        <button class="btn btn-gold btn-sm" type="button" data-quote-card data-quote="{e(rule_text)}" data-subject="{e(s['subject'])}" data-ep="{s['no']}">Save shareable rule card (.png)</button>
        <a class="btn btn-ghost btn-sm" href="/share">Share how this speaks to your rebuild</a>
      </div>
    </div>
  </div>
</section>"""

    # Key Moments (Shorts Preview Cards)
    shorts = ep.get("shorts", [])
    moments_html = ""
    if shorts:
        m_cards = "".join(
            f'<article class="moment-card"><div><p class="eyebrow" style="margin:0">Key moment · {e(sh.get("rollout_day", "Short"))}</p>'
            f'<h3 class="moment-hook">“{e(sh["hook"])}”</h3></div>'
            f'<p class="moment-proof">{e(sh["proof"])}</p></article>'
            for sh in shorts
        )
        moments_html = f"""<section class="section-tight">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Archival turning points</p>
    <h2 class="h3">Three moments from the documentary</h2>
    <div class="moments-grid">{m_cards}</div>
  </div>
</section>"""

    # Verification & Receipts Ledger with [V]/[E]/[T] filters + Held Back honesty badge
    tag_counts = src.get("tag_counts", {})
    held_back = src.get("held_back", 0)
    honesty_html = (
        f'<div class="honesty-badge"><strong>Editorial transparency:</strong> {held_back} unconfirmed claim{" was" if held_back == 1 else "s were"} held back and left out of the script.</div>'
        if held_back > 0
        else '<div class="honesty-badge"><strong>Audit result:</strong> 0 blocking claims — every narrated fact maps to a published record below.</div>'
    )
    ledger_items = "".join(
        f'<li class="ledger-item" data-tag="{e(x.get("tag", "E"))}">'
        f'<div><a href="{e(x["url"])}" rel="noopener nofollow" target="_blank">{e(x.get("title") or x["label"])}</a>'
        f'<span class="ledger-domain">{e(x["label"])}</span></div>'
        f'<span class="tag-pill tag-{e(x.get("tag", "E"))}">[{e(x.get("tag", "E"))}] {e(TAG_LABELS.get(x.get("tag", "E"), "Source"))}</span>'
        f'</li>'
        for x in src.get("sources", [])
    )
    sample_rows = []
    for c in ep.get("featured_claims", [])[:8]:
        link_part = ""
        if c.get("url"):
            src_lbl = e(c.get("on_screen") or "source")
            link_part = f' — <a href="{e(c["url"])}" target="_blank" rel="noopener nofollow" class="link-gold">{src_lbl}</a>'
        sample_rows.append(f'<li><span class="cid">{e(c["id"])}</span>{e(c["text"])}{link_part}</li>')
    claims_sample = "".join(sample_rows)

    runtime_str = f"~{int(round(ep['runtime_minutes']))} min" if ep.get("runtime_minutes") else "18–22 min"
    arc_str = ep.get("structure_variant") or s.get("arc", "Documented comeback")
    ics_rel = f"/assets/calendar/ep{s['no']}-{s['slug']}.ics"

    body = f"""
<section class="page-hero">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow"><a href="/stories">Season 1</a> · Episode {s['no']} · <span data-when="{s['date']}"></span></p>
      <h1 class="display-sm">{e(s['subject'])}</h1>
      <p class="lede">{e(s['synopsis'])}</p>
      <div class="dossier-rail">
        <div class="dossier-stat"><span>Structure</span><strong>{e(arc_str)}</strong></div>
        <div class="dossier-stat"><span>Runtime</span><strong>{e(runtime_str)}</strong></div>
        <div class="dossier-stat"><span>Audit</span><strong>{src['verified_claims']} verified claims</strong></div>
      </div>
    </div>
    <div class="story-media" data-video="{e(s.get('youtube_id', ''))}" data-story-slug="{s['slug']}" data-title="Episode {s['no']}: {e(s['subject'])}" data-date="{s['date']}">
      {premiere_card(ep_no=s['no'], subject=s['subject'], iso_date=s['date'], date_label=f'<span data-when-long="{s["date"]}"></span>', ics_path=ics_rel)}
    </div>
  </div>
</section>

{rule_html}
{chapters_html}
{moments_html}

<section class="section-tight section-alt grain-surface" id="sources">
  <div class="wrap narrow" data-ledger>
    <p class="eyebrow eyebrow-rule">Receipts &amp; verification ledger</p>
    <h2 class="h3">{src['verified_claims']} claims checked against {len(src.get('sources', []))} published sources</h2>
    <p class="muted">Every fact in this episode was verified against a primary record <strong>[V]</strong>, established reporting <strong>[E]</strong>, or clearly attributed as the subject's own testimony <strong>[T]</strong>.</p>
    {honesty_html}
    <div class="filter-bar" role="group" aria-label="Filter sources by evidence type">
      <button class="filter-chip active" type="button" data-ledger-tag="all" aria-pressed="true">All ({len(src.get('sources', []))})</button>
      <button class="filter-chip" type="button" data-ledger-tag="V" aria-pressed="false">[V] Primary records ({tag_counts.get('V', 0)} claims)</button>
      <button class="filter-chip" type="button" data-ledger-tag="E" aria-pressed="false">[E] Reporting ({tag_counts.get('E', 0)} claims)</button>
      <button class="filter-chip" type="button" data-ledger-tag="T" aria-pressed="false">[T] Testimony ({tag_counts.get('T', 0)} claims)</button>
    </div>
    <details class="sources" open>
      <summary>Published source ledger ({len(src.get('sources', []))} links)</summary>
      <ul class="ledger-list">{ledger_items}</ul>
    </details>
    {f'<details class="sources"><summary>Sample verified claims from 01_claims.md</summary><ul class="claims-sample">{claims_sample}</ul></details>' if claims_sample else ''}
  </div>
</section>

<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">If this story mirrors where you are</h2>
    <p class="muted">Open the matching stage page for three concrete moves this week and a free Rebuild Circle.</p>
    <div class="chip-row">{stage_links}</div>
  </div>
</section>

{f'''<section class="section-tight section-alt grain-surface"><div class="wrap narrow"><p class="eyebrow">Next documentary</p><a class="link-gold big" href="/stories/{nxt['slug']}">Episode {nxt['no']}: {e(nxt['subject'])} →</a></div></section>''' if nxt else ''}
"""
    ld = [
        breadcrumb_ld([("Home", "/"), ("Stories", "/stories"), (s["subject"], f"/stories/{s['slug']}")]),
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": f"{s['subject']} — Documented Comeback (DYEGU Episode {s['no']})",
            "description": s["synopsis"],
            "author": {"@type": "Person", "name": "Sir K"},
            "publisher": {"@type": "Organization", "name": "DYEGU"},
            "datePublished": s["date"],
            "image": og_image_for(f"story-{s['slug']}.jpg"),
        },
    ]
    return layout(
        f"/stories/{s['slug']}",
        f"{s['subject']} — a documented comeback · DYEGU Episode {s['no']}",
        s["synopsis"][:155],
        body,
        og_file=f"story-{s['slug']}.jpg",
        ld=ld,
        reading_bar=True,
    )


def page_shop():
    cards = "".join(
        f"""<label class="product" data-reveal>
  <div class="product-img-wrap"><img src="{product_img(p['key'])}" alt="{e(p['name'])}, pre-production studio render" width="600" height="600" loading="lazy"></div>
  <span class="product-spec">{e(p['spec'])}</span>
  <h3>{e(p['name'])}</h3>
  <p>{e(p['note'])}</p>
  <span class="want"><input type="checkbox" name="interest" value="{p['key']}" data-label="{e(p['name'])}" form="drop-form"> Reserve interest</span>
</label>"""
        for p in PRODUCTS
    )
    body = f"""
<section class="page-hero">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">DYEGU Shop · Drop 01</p>
    <h1 class="display-sm">Rise</h1>
    <p class="lede">Five restrained objects worth keeping close on the hard days. Matte black, flat `#C5A059` gold, the phoenix and the words. Made in small runs, never discounted.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="products">{cards}</div>
    <p class="muted small center" style="margin-top:20px">Pre-production studio renders &amp; technical plates. Nothing ships until physical samples match our canonical matte black and flat gold.</p>
    <div class="shop-tray" id="shop-tray" hidden>
      <p data-tray-text></p>
      <a class="btn btn-gold btn-sm" href="#drop">Join drop list →</a>
    </div>
  </div>
</section>
<section class="section section-alt grain-surface" id="drop">
  <div class="wrap narrow center">
    <p class="eyebrow">First access · Drop 01</p>
    <h2 class="h2">Join the drop list.</h2>
    <p class="lede">Tick what you'd wear or keep on your desk above, leave your email, and you'll get first access and launch timing before public release.</p>
    {signup_form(list_='merch_waitlist', button='Join the drop list', center=True, fine='One email when Drop 01 opens. Nothing else unless you subscribe.', success="You're on the Drop 01 list. You'll hear first when Rise opens.").replace('<form ', '<form id="drop-form" ', 1)}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Shop · Drop 01", "/shop")])]
    return layout(
        "/shop",
        "Shop — Drop 01: Rise · DYEGU",
        "The DYEGU studio mug, Rise tee and hoodie, phoenix cap and Rebuild Journal. Join the drop list for first access.",
        body,
        og_file="shop.jpg",
        ld=ld,
    )


def page_playbook():
    ch_items = "".join(
        f'<li><span class="axis-time">Chapter {e(num)}</span><h3 class="axis-title">{e(title)}</h3><p class="axis-desc">{e(desc)}</p></li>'
        for num, title, desc in PLAYBOOK_CHAPTERS
    )
    sample_items = "".join(
        f'<div class="sample-prompt"><h4>{e(t)}</h4><p>{e(p)}</p></div>'
        for t, p in PLAYBOOK_SAMPLE["prompts"]
    )
    tags = "".join(f'<a href="/start/{s["key"]}">{e(s["short"])}</a>' for s in STAGES)
    body = f"""
<section class="page-hero">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow eyebrow-rule">Coming January 2027 · Written by Sir K</p>
      <h1 class="display-sm">The Rebuild Playbook</h1>
      <p class="lede">The documented patterns behind every comeback in Season 1, distilled into a calm, unsentimental workbook for your own. Read it in an evening. Work through it over thirty days.</p>
      <p class="price-line"><span class="price-big">$19</span> <span class="muted">· digital workbook + printable worksheets · early price for subscribers</span></p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#waitlist">Join the early waitlist</a>
        <a class="btn btn-ghost" href="#sample">Read Chapter 1 sample</a>
      </div>
    </div>
    <div class="book-mock"><img src="{product_img('playbook')}" alt="The Rebuild Playbook by Sir K" width="600" height="600"></div>
  </div>
</section>

<section class="section-tight">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Table of contents</p>
    <h2 class="h3">Seven chapters, seven worksheets</h2>
    <ol class="axis-timeline">{ch_items}</ol>
    <details class="sample-sheet" id="sample">
      <summary>Look inside · {e(PLAYBOOK_SAMPLE['chapter'])}: {e(PLAYBOOK_SAMPLE['title'])}</summary>
      <p class="muted" style="margin-top:16px">{e(PLAYBOOK_SAMPLE['intro'])}</p>
      <div class="sample-prompts">{sample_items}</div>
    </details>
  </div>
</section>

<section class="section-tight section-alt grain-surface">
  <div class="wrap narrow">
    <h2 class="h3">Built for every rebuild stage</h2>
    <p class="muted">Select your current chapter for three free moves right now:</p>
    <div class="chip-row">{tags}</div>
  </div>
</section>

<section class="section" id="waitlist">
  <div class="wrap narrow center">
    <img class="dyegu-rule-avatar" src="/assets/sir-k-avatar.webp" alt="Sir K" width="56" height="56" style="margin:0 auto 16px">
    <h2 class="h2">Get it first, at the early price.</h2>
    {signup_form(list_='playbook_waitlist', button='Join the waitlist', ask_stage=True, center=True, fine="We'll email you when it launches in January 2027, with the early subscriber price.", success="You're on the waitlist. We'll email you at launch with the early price.")}
  </div>
</section>"""
    ld = [
        breadcrumb_ld([("Home", "/"), ("The Rebuild Playbook", "/playbook")]),
        {
            "@context": "https://schema.org",
            "@type": "Book",
            "name": "The Rebuild Playbook",
            "author": {"@type": "Person", "name": "Sir K"},
            "publisher": {"@type": "Organization", "name": "DYEGU"},
            "offers": {"@type": "Offer", "price": "19", "priceCurrency": "USD", "availability": "https://schema.org/PreOrder"},
        },
    ]
    return layout(
        "/playbook",
        "The Rebuild Playbook — $19 · DYEGU",
        "A practical 7-chapter workbook built from Season 1's documented comebacks. Read a Chapter 1 sample and join the early waitlist.",
        body,
        og_file="playbook.jpg",
        ld=ld,
    )


def page_speaking():
    u = uid()
    aud_tags = "".join(f"<span>{e(a)}</span>" for a in SPEAKER_KIT["audiences"])
    fmt_tags = "".join(f"<span>{e(f)}</span>" for f in SPEAKER_KIT["formats"])
    body = f"""
<section class="page-hero">
  <div class="wrap host">
    {sir_k_portrait("Sir K · Keynote Speaker & Host")}
    <div>
      <p class="eyebrow eyebrow-rule">Keynotes &amp; executive workshops</p>
      <h1 class="display-sm">Bring Sir K to your room.</h1>
      <p class="lede">Evidence-led keynotes and workshops on setbacks, resilience and institutional rebuilding — grounded in primary-sourced comebacks and twenty years of building companies and teams.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#enquire">Check availability</a>
        <a class="btn btn-ghost" href="#press-kit">Event planner &amp; press kit</a>
      </div>
      <div class="tag-list">{aud_tags}</div>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Signature keynotes</p>
    <h2 class="h2">Three talks built for real rooms.</h2>
    <div class="pillars" data-reveal>
      <article>
        <span class="num">I</span>
        <h3>The Comeback Pattern</h3>
        <p>What every documented rebuild in Season 1 shares — and the operational habits leaders and teams can apply immediately. For conferences, universities and global summits.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="The Comeback Pattern" data-prefill-kind="talk">Enquire about this talk</button></div>
      </article>
      <article>
        <span class="num">II</span>
        <h3>Rebuilding After a Hard Year</h3>
        <p>For organisations navigating restructuring, layoffs, or a failed flagship launch. Calm, honest, zero motivational fog — restoring agency and execution.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="Rebuilding After a Hard Year" data-prefill-kind="workshop">Enquire about this workshop</button></div>
      </article>
      <article>
        <span class="num">III</span>
        <h3>Systems That Survive Failure</h3>
        <p>For founders and senior executives: designing companies, culture and decision systems that can absorb a serious hit and come back stronger.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="Systems That Survive Failure" data-prefill-kind="talk">Enquire about this talk</button></div>
      </article>
    </div>
    <div class="tag-list" style="margin-top:24px">{fmt_tags}</div>
  </div>
</section>

<section class="section-tight section-alt grain-surface" id="press-kit">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">For event planners &amp; press</p>
    <h2 class="h3">Approved bios &amp; high-resolution portrait</h2>
    <div class="press-grid">
      <div class="press-box">
        <h3>Short introduction (60 words)</h3>
        <p id="bio-short">{e(SPEAKER_KIT['short_bio'])}</p>
        <button class="btn btn-subtle btn-sm" type="button" data-copy-target="bio-short">Copy short bio</button>
      </div>
      <div class="press-box">
        <h3>Full conference bio</h3>
        <p id="bio-long">{e(SPEAKER_KIT['long_bio'])}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-subtle btn-sm" type="button" data-copy-target="bio-long">Copy full bio</button>
          <a class="btn btn-ghost btn-sm" href="/assets/sir-k-portrait.jpg" download="SirK_DYEGU_Press_Portrait.jpg">Download press portrait (.jpg)</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="enquire">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Direct booking desk</p>
    <h2 class="h2">Make an enquiry</h2>
    <form class="js-form enquiry" data-table="enquiries" data-success="Thank you. Sir K's team will reply within a few working days." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">Name</label><input id="{u}n" name="name" autocomplete="name" required maxlength="120"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}o">Organisation</label><input id="{u}o" name="organisation" autocomplete="organization" maxlength="160"></div>
        <div><label for="{u}k">Enquiry</label><select id="{u}k" name="kind"><option value="talk">Keynote or talk</option><option value="workshop">Workshop</option><option value="sponsor">Sponsorship</option><option value="press">Press</option><option value="other">Something else</option></select></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}d">Date or timing</label><input id="{u}d" name="event_date" maxlength="60" placeholder="e.g. March 2027"></div>
        <div><label for="{u}b">Budget</label><select id="{u}b" name="budget"><option value="">Prefer to discuss</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$7,500</option><option>$7,500+</option></select></div>
      </div>
      <label for="{u}a">Audience</label><input id="{u}a" name="audience" maxlength="160" placeholder="Who, how many, in person or online">
      <label for="{u}m">Message</label>
      <textarea id="{u}m" name="message" rows="5" required maxlength="4000" placeholder="Tell us about your event, theme and goals"></textarea>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send enquiry</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Speaking", "/speaking")])]
    return layout(
        "/speaking",
        "Book Sir K — Keynotes, Workshops & Press Kit · DYEGU",
        "Keynotes and workshops on setbacks, resilience and rebuilding with Sir K, creator and host of DYEGU.",
        body,
        og_file="speaking.jpg",
        ld=ld,
    )


def page_about():
    body = f"""
<section class="page-hero">
  <div class="wrap host">
    {sir_k_portrait("Sir K · Creator & Host")}
    <div>
      <p class="eyebrow eyebrow-rule">About Sir K &amp; DYEGU</p>
      <h1 class="display-sm">Why DYEGU exists.</h1>
      <p class="lede">Sir K has spent more than twenty years building companies, teams and technology across Africa and beyond — and has had to rebuild more than once. When things went wrong, what helped most wasn't slogans. It was seeing proof that someone else had stood in the rubble and found a real way back.</p>
      <p class="lede">DYEGU — short for <em>Don't You Ever Give Up</em> — is that proof, assembled with journalistic discipline: real people, real setbacks, primary-checked facts, and the honest craft of rebuilding.</p>
    </div>
  </div>
</section>
<section class="section-tight section-alt grain-surface">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Editorial &amp; studio method</p>
    <h2 class="h3">How every episode is built</h2>
    <ol class="axis-timeline">
      <li><span class="axis-time">Stage 01 · Research</span><h3 class="axis-title">Primary records first</h3><p class="axis-desc">Every claim goes into an episode claims file with its source: filings, court and archival records [V], established reporting [E], or clearly attributed testimony [T].</p></li>
      <li><span class="axis-time">Stage 02 · Gate 1A / 1B Audit</span><h3 class="axis-title">Verify or cut</h3><p class="axis-desc">Anything we cannot confirm is held back and excluded from the script. Sensitive themes stay factual and dignified — the comeback leads the title, never the wound.</p></li>
      <li><span class="axis-time">Stage 03 · Studio Production</span><h3 class="axis-title">Human voice, zero synthetic shortcuts</h3><p class="axis-desc">Sir K presents on camera and narrates every episode in his own voice. Research is done with AI assistance and reviewed by people against the sources published on each story's page.</p></li>
    </ol>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Work with us</h2>
    <p class="muted">Talks, workshops, sponsorship or press: <a class="link-gold" href="/speaking#enquire">use the booking desk</a>. Your own rebuild story: <a class="link-gold" href="/share">share it privately here</a>.</p>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("About Sir K", "/about")])]
    return layout(
        "/about",
        "About Sir K and DYEGU — Method & Mission",
        "Who Sir K is, why DYEGU exists, and how every comeback documentary is researched, verified, and narrated.",
        body,
        og_file="about.jpg",
        ld=ld,
        reading_bar=True,
    )


def page_share():
    u = uid()
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Share your rebuild</p>
    <h1 class="display-sm">Tell us where you are.</h1>
    <p class="lede">In the middle of it or standing on the other side: we read every story privately. With your explicit permission, some will be featured in The Comeback File, and some may one day inspire an episode.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <form class="js-form share" data-table="rebuilds" data-success="Thank you for trusting us with your story. We read every one privately." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">First name (optional)</label><input id="{u}n" name="first_name" autocomplete="given-name" maxlength="60"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      {stage_select(label="Which chapter is closest to your story?").replace("{uid}", u)}
      <label for="{u}s">Your story</label>
      <textarea id="{u}s" name="story" rows="9" required minlength="20" maxlength="6000" placeholder="What happened, where you are now, and what is helping you keep going. Please leave out details that identify other people."></textarea>
      <p class="char-count" data-story-count>0 / 6000</p>
      <aside class="care-note care-live" data-care-live hidden>
        <p><strong>You don't have to carry this alone right now.</strong> If you're feeling overwhelmed or thinking about harming yourself, free confidential support is available immediately at <a href="{SUPPORT_URL}" target="_blank" rel="noopener">findahelpline.com</a>.</p>
      </aside>
      <label class="check"><input type="checkbox" name="consent_contact"> You can email me privately about my story.</label>
      <label class="check"><input type="checkbox" name="consent_feature"> You can share my story in The Comeback File or on DYEGU, using my first name only. I will always be asked again before anything is published.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send my story</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <aside class="care-note"><p>This form isn't monitored around the clock. If you're in danger or thinking about suicide or self-harm, please contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Share your rebuild", "/share")])]
    return layout("/share", "Share your rebuild · DYEGU", "Tell DYEGU your comeback story, in the middle of it or on the other side.", body, ld=ld)


CARE = f"""<aside class="care-note"><p><strong>Not for emergencies.</strong> Circles and sessions are peer support and general guidance, not therapy, medical care, or legal or financial advice for your situation. If you're in danger or thinking about suicide or self-harm, contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>"""


def checks(name: str, items: list[tuple[str, str]], form_id: str | None = None) -> str:
    fa = f' form="{form_id}"' if form_id else ""
    return '<div class="check-grid">' + "".join(
        f'<label class="check"><input type="checkbox" name="{name}" value="{k}"{fa}> {e(t)}</label>'
        for k, t in items
    ) + "</div>"


def page_community():
    body = f"""
<section class="page-hero">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">DYEGU Community · always free</p>
    <h1 class="display-sm">Nobody rebuilds alone.</h1>
    <p class="lede">The documentaries show it can be done. The community is where you do it — with peers walking the same stage and vetted experts giving practical guidance for free.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="cohort-strip">
      <span><strong>Cohort 01 opens Q1 2027</strong> · Matching across WAT, GMT, CET &amp; EST</span>
      <span><strong>100% free</strong> · Zero pitching or selling allowed</span>
    </div>
    <div class="doors">
      <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h2 class="h3">Rebuild Circles</h2><p>Six to eight people at the same stage meet online once a week for six weeks, with a trained volunteer host. One story, one move, and real accountability.</p><span class="link-gold">Join a circle →</span></a>
      <a class="door" href="/community/sessions"><p class="eyebrow">Expert help</p><h2 class="h3">Free Rebuild Sessions</h2><p>Live group sessions with vetted volunteer experts: recruiters, accountants, lawyers, founders and coaches. Practical guidance and open Q&amp;A at zero cost.</p><span class="link-gold">Request a session →</span></a>
      <a class="door" href="/volunteer"><p class="eyebrow">Give back</p><h2 class="h3">Volunteer your expertise</h2><p>Consultants and professionals: give an hour a month to someone starting over. Lead a session, host a circle or answer reader questions.</p><span class="link-gold">Apply to volunteer →</span></a>
    </div>
  </div>
</section>
<section class="section-tight section-alt grain-surface">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">How it opens</p>
    <h2 class="h3">Structured, vetted, and built for safety</h2>
    <ol class="axis-timeline">
      <li><span class="axis-time">Step 01</span><h3 class="axis-title">Join the list for your stage</h3><p class="axis-desc">Circles are matched by life stage and time zone band. Sessions are scheduled around the topics most people request.</p></li>
      <li><span class="axis-time">Step 02</span><h3 class="axis-title">Every volunteer is vetted by hand</h3><p class="axis-desc">Identity, experience and, for regulated professions, licences are verified before anyone hosts. Everyone signs the <a class="link-gold" href="/community/guidelines">community guidelines</a>.</p></li>
      <li><span class="axis-time">Step 03</span><h3 class="axis-title">Cohort 01 launches early 2027</h3><p class="axis-desc">Each circle opens as soon as 6–8 peers in the same stage and time zone band are ready. You'll receive your invitation by email.</p></li>
    </ol>
    {CARE}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community")])]
    return layout(
        "/community",
        "Community — Rebuild Circles, free expert sessions, volunteers · DYEGU",
        "Free peer support circles and expert sessions for people rebuilding after a setback, hosted by vetted volunteers.",
        body,
        og_file="community.jpg",
        ld=ld,
    )


def community_form(kind: str, button: str, success: str, topics: bool = False) -> str:
    u = uid()
    return f"""<form class="js-form community" id="{u}" data-table="community_requests" data-kind="{kind}" data-success="{e(success)}" novalidate>
  <div class="grid-2">
    <div><label for="{u}n">First name (optional)</label><input id="{u}n" name="first_name" autocomplete="given-name" maxlength="60"></div>
    <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
  </div>
  {stage_select(label="Which chapter is closest to where you are?", required=(kind == 'circle')).replace("{uid}", u)}
  {('<p class="label">Topics you want help with</p>' + checks('topics', SESSION_TOPICS)) if topics else ''}
  <label for="{u}x">Anything we should know? (optional)</label>
  <textarea id="{u}x" name="note" rows="3" maxlength="1500" placeholder="Please don't include sensitive medical or legal details here."></textarea>
  <input type="hidden" name="timezone" data-tz>
  <label class="check"><input type="checkbox" name="agreed_terms" required> I've read the <a href="/community/guidelines" target="_blank">community guidelines</a> and understand this is peer support and general guidance, not professional advice or emergency help.</label>
  <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
  <button class="btn btn-gold" type="submit">{button}</button>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>"""


def page_circles():
    weeks_html = "".join(
        f'<li><span class="axis-time">{e(w)}</span><h3 class="axis-title">{e(title)}</h3><p class="axis-desc">{e(desc)}</p></li>'
        for w, title, desc in CIRCLE_WEEKS
    )
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Peer support</p>
    <h1 class="display-sm">Rebuild Circles</h1>
    <p class="lede">A small group of people at the exact same stage of a setback, meeting online once a week for six weeks. Free, confidential, and hosted by a trained volunteer.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <div class="facts">
      <div><span class="num">6–8</span><p>peers matched by stage &amp; time zone</p></div>
      <div><span class="num">6</span><p>weekly video calls, 60 minutes each</p></div>
      <div><span class="num">$0</span><p>always free, never pitched</p></div>
    </div>
    <p class="eyebrow eyebrow-rule">Six-week roadmap</p>
    <h2 class="h3">What happens inside a circle</h2>
    <ol class="axis-timeline">{weeks_html}</ol>
    {CARE}
  </div>
</section>
<section class="section section-alt grain-surface" id="join-circle">
  <div class="wrap narrow">
    <h2 class="h2">Join the circle list</h2>
    <p class="muted">We'll invite you as soon as a 6–8 person cohort for your stage and time zone is ready.</p>
    {community_form('circle', 'Join the circle list', "You're on the list. We'll email you as soon as a circle for your stage and time zone opens.")}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community"), ("Rebuild Circles", "/community/circles")])]
    return layout(
        "/community/circles",
        "Rebuild Circles — free peer support groups · DYEGU",
        "Six weeks, six to eight people at the same stage, one trained volunteer host. Free peer support for rebuilding after a setback.",
        body,
        og_file="community.jpg",
        ld=ld,
    )


def page_sessions():
    topics = "".join(f"<li>{e(t)}</li>" for _, t in SESSION_TOPICS)
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Expert help</p>
    <h1 class="display-sm">Free Rebuild Sessions</h1>
    <p class="lede">Live online sessions where a vetted volunteer expert walks through one practical topic and answers open questions. Free for anyone rebuilding.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Topics we're scheduling first</h2>
    <ul class="topic-list">{topics}</ul>
    <p class="muted">Sessions provide practical general guidance for the room. Volunteers never charge, pitch, or solicit clients.</p>
    {CARE}
  </div>
</section>
<section class="section section-alt grain-surface">
  <div class="wrap narrow">
    <h2 class="h2">Vote for the sessions you need</h2>
    <p class="muted">The topics with the highest demand go on the Q1 2027 calendar first. You'll receive a free invite for everything you tick.</p>
    {community_form('session', 'Request sessions', "Thank you. We'll invite you as soon as sessions on your topics are scheduled.", topics=True)}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community"), ("Free Sessions", "/community/sessions")])]
    return layout(
        "/community/sessions",
        "Free Rebuild Sessions with volunteer experts · DYEGU",
        "Free live sessions with volunteer recruiters, accountants, lawyers, founders and coaches for people rebuilding after a setback.",
        body,
        og_file="community.jpg",
        ld=ld,
    )


def page_volunteer():
    u = uid()
    stage_checks = checks("stages", [(s["key"], s["short"]) for s in STAGES])
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Founding Volunteer Charter</p>
    <h1 class="display-sm">Give an hour to someone starting over.</h1>
    <p class="lede">You've spent years learning what most people only discover the hard way. Offer one focused hour a month, free, to people rebuilding after job loss, business failure, divorce, illness or grief.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="pillars">
      <article><span class="num">I</span><h3>Lead a session</h3><p>45 minutes on one practical subject, then Q&amp;A. We handle scheduling, hosting, moderation and audience.</p></article>
      <article><span class="num">II</span><h3>Host a circle</h3><p>Six weekly calls with 6–8 peers at the same stage. Structured facilitator guide and onboarding provided.</p></article>
      <article><span class="num">III</span><h3>Answer in writing</h3><p>Reply to a reader question for The Comeback File, credited by name and profession, monthly or quarterly.</p></article>
    </div>
    <p class="muted small" style="margin-top:20px">Approved volunteers are credited by name and profession. Pitching, selling or taking clients from sessions is strictly prohibited under our <a class="link-gold" href="/community/guidelines">guidelines</a>.</p>
  </div>
</section>
<section class="section section-alt grain-surface">
  <div class="wrap narrow">
    <h2 class="h2">Apply to volunteer</h2>
    <p class="muted">We review every application manually and verify identity, experience and regulated licences. We reply within two weeks.</p>
    <form class="js-form volunteer" data-table="volunteers" data-success="Thank you. Your application is in; we'll review and reply within two weeks." novalidate>
      <p class="form-step-title">01 · About you</p>
      <div class="grid-2">
        <div><label for="{u}n">Full name</label><input id="{u}n" name="full_name" autocomplete="name" required maxlength="120"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}o">Country</label><input id="{u}o" name="country" autocomplete="country-name" maxlength="80"></div>
        <div><label for="{u}g">Languages</label><input id="{u}g" name="languages" maxlength="160" placeholder="English, French, Hausa…"></div>
      </div>

      <p class="form-step-title">02 · Expertise &amp; credentials</p>
      <div class="grid-2">
        <div><label for="{u}p">Profession or expertise</label><input id="{u}p" name="profession" required maxlength="160" placeholder="e.g. Recruiter, chartered accountant, employment lawyer"></div>
        <div><label for="{u}l">LinkedIn or website</label><input id="{u}l" name="profile_url" type="url" maxlength="300" placeholder="https://"></div>
      </div>
      <label for="{u}c">Qualifications or licences (for regulated professions)</label>
      <input id="{u}c" name="credentials" maxlength="300" placeholder="Body and number, e.g. ICAN, SRA, state bar, HCPC">

      <p class="form-step-title">03 · How you'd like to help</p>
      <p class="label">Formats</p>
      {checks("formats", VOLUNTEER_FORMATS)}
      <p class="label">Stages you know best</p>
      {stage_checks}
      <label for="{u}h">Time you can give</label>
      <select id="{u}h" name="hours_per_month"><option value="1/month">About an hour a month</option><option value="2-4/month">2–4 hours a month</option><option value="1/quarter">An hour a quarter</option><option value="one-off">A one-off session</option></select>
      <label for="{u}w">Why do you want to volunteer? (optional)</label>
      <textarea id="{u}w" name="why" rows="4" maxlength="2000"></textarea>

      <p class="form-step-title">04 · Volunteer charter</p>
      <input type="hidden" name="timezone" data-tz>
      <label class="check"><input type="checkbox" name="agreed_code" required> I've read and agree to the <a href="/community/guidelines" target="_blank">volunteer code</a>: no selling or soliciting, general guidance only, confidentiality, and escalating anyone at risk.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send application</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community"), ("Volunteer", "/volunteer")])]
    return layout(
        "/volunteer",
        "Volunteer as an expert · DYEGU Community",
        "Consultants and professionals: give an hour a month to people rebuilding after a setback. Lead a free session, host a circle or answer reader questions.",
        body,
        og_file="community.jpg",
        ld=ld,
    )


GUIDELINES = """<p class="eyebrow eyebrow-rule">DYEGU Community</p>
<h1>Safety &amp; guidelines</h1>
<p>DYEGU's circles and sessions exist so people rebuilding after a setback can get support and practical guidance, free. These rules keep them safe and useful. Everyone who joins or volunteers agrees to them.</p>
<h2>What this is, and isn't</h2>
<ul><li>Circles are <strong>peer support</strong>. Sessions are <strong>general guidance</strong> for a group.</li>
<li>Neither is therapy, medical care, or legal, financial or tax advice for your individual situation. For that, see a qualified professional you engage directly.</li>
<li>Neither is an emergency service. If you're in danger or thinking about suicide or self-harm, contact a local crisis line or emergency services now: <a href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</a>.</li></ul>
<h2>For everyone</h2>
<ul><li><strong>Confidentiality.</strong> What people share in a circle stays in the circle. No recording, screenshots or quoting without everyone's consent.</li>
<li><strong>Respect.</strong> No harassment, discrimination, hate or sexual content. Disagree with ideas, never attack people.</li>
<li><strong>No selling.</strong> No promoting products, services, schemes, loans or investments, and no asking members for money.</li>
<li><strong>Your privacy.</strong> Share only what you're comfortable with. Don't share other people's private details.</li>
<li>Hosts can remove anyone who breaks these rules. Serious breaches are permanent.</li></ul>
<h2>Volunteer code</h2>
<ul><li><strong>General guidance only.</strong> Explain options and how things usually work; don't advise on an individual's case in a group, and say when someone needs their own professional.</li>
<li><strong>No soliciting.</strong> Don't pitch your services, collect contacts or move members into paid work. You may share your name and profession; if someone asks to hire you later, tell the DYEGU team first.</li>
<li><strong>Stay in your lane.</strong> Speak to what you're qualified in. Regulated professionals follow their own professional rules at all times.</li>
<li><strong>Escalate risk.</strong> If anyone says they may harm themselves or others, share the crisis-line information, stay calm, and tell the DYEGU team the same day.</li>
<li><strong>Protect data.</strong> Never keep, copy or reuse members' details outside DYEGU's tools.</li>
<li><strong>Adults only.</strong> Circles and sessions are for people aged 18 and over.</li></ul>
<h2>Reporting a problem</h2>
<p>Use the <a href="/speaking#enquire">contact form</a> and choose "Something else", or reply to any DYEGU email. We review every report.</p>"""


PRIVACY = """<p class="eyebrow eyebrow-rule">Last updated 25 November 2026</p>
<h1>Privacy</h1>
<p>This page explains what DYEGU's website collects, why, and what you can ask us to do with it. DYEGU is a documentary series presented by Sir K.</p>
<h2>What we collect</h2>
<ul>
<li><strong>Your email address</strong> when you join The Comeback File, The Rebuild Playbook waitlist or the shop drop list, with the list you joined, the situation you chose (if any), the products you ticked, the page you signed up on and the campaign link you arrived from.</li>
<li><strong>Your name, email, organisation and message</strong> when you send a talk, workshop, sponsorship or press enquiry.</li>
<li><strong>Your circle or session request</strong>: the stage you choose, your time zone, the topics you tick and any note, so we can match you to a circle or schedule sessions.</li>
<li><strong>Volunteer applications</strong>: name, email, profession, qualifications, profile link, country, languages and availability, so we can vet and schedule volunteers. Approved volunteers are credited by name and profession.</li>
<li><strong>Your story</strong> when you share your rebuild, with your first name if you give it and the permissions you tick. Please leave out details that identify other people.</li>
<li><strong>Private on-device checklist</strong>: ticking off moves on a stage page stores progress strictly in your own browser's localStorage and is never sent to our servers.</li>
<li><strong>Anonymous visit statistics</strong> (pages viewed, country, device type) through Vercel Web Analytics, which uses no cookies.</li>
</ul>
<p>We don't use advertising cookies or tracking pixels, and we don't sell or rent your details to anyone.</p>
<h2>Why we use it</h2>
<ul>
<li>To send the emails you asked for. Every email has a one-click unsubscribe.</li>
<li>To reply to enquiries and confirm submissions.</li>
<li>To read the stories you share and, only with your permission, feature them. We ask again before publishing anything.</li>
<li>To understand which pages help people, so we can improve them.</li>
</ul>
<p>Our legal basis is your consent for emails and stories, and our legitimate interest in answering messages and running the site.</p>
<h2>Who processes it</h2>
<p>Form submissions are validated via our Vercel server function and stored with Supabase (database hosted in the UK). Confirmation emails are sent via Resend; weekly newsletter issues are sent through Substack. The site is hosted by Vercel. Episodes embedded from YouTube load only when you press play, using YouTube's privacy-enhanced mode.</p>
<h2>How long we keep it</h2>
<p>List emails, circle and session requests are kept until you unsubscribe or ask us to delete them. Declined volunteer applications are deleted after six months. Enquiries are kept for up to two years. Shared stories are kept until you ask us to delete them, or for two years if not featured.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete your data, or withdraw consent, at any time: reply to any email we send you, or use the <a href="/speaking#enquire">enquiry form</a> and choose "Something else". We'll act within 30 days. If you're in the UK or EU and unhappy with how we've handled your data, you can complain to your data protection authority (in the UK, the ICO).</p>"""


STUDIO = """<p class="eyebrow eyebrow-rule">Sponsors &amp; partners</p>
<h1>Partner with DYEGU</h1>
<p>DYEGU is the flagship documentary series of a growing independent studio, anchored by one named host, Sir K. Every story is primary-sourced and audited before narration — making it a calm, brand-safe prestige environment for long-term partners.</p>
<p>Our first audience media kit, with verified Season 1 performance metrics, follows the opening quarter (early 2027). Until then we welcome conversations with founding launch partners.</p>
<p><a class="btn btn-gold" href="/speaking#enquire">Start a conversation</a></p>
<h2>What partners can expect</h2>
<ul><li>Clearly labelled integrations, disclosed on screen and in YouTube's paid-promotion setting.</li><li>Zero unverified claims — about your product or anyone else.</li><li>One accountable host and studio team, start to finish.</li></ul>"""


def simple(path: str, title: str, desc: str, inner: str, noindex: bool = False, band: bool = True, reading_bar: bool = False):
    return layout(
        path,
        title,
        desc,
        f'<section class="page"><div class="wrap narrow">{inner}</div></section>',
        join_band=band,
        noindex=noindex,
        reading_bar=reading_bar,
    )


def write(rel: str, content: str) -> str:
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(content)
    return rel


def main():
    global SOURCES, EPISODES
    SOURCES, EPISODES = load_data()
    cals = generate_calendars()

    out = [write("index.html", page_home())]
    for s in STAGES:
        out.append(write(f"start/{s['key']}/index.html", page_stage(s)))
    out.append(write("stories/index.html", page_stories()))
    for i, s in enumerate(STORIES):
        if s.get("live_page"):
            out.append(write(f"stories/{s['slug']}/index.html", page_story(i, s)))
    out += [
        write("shop/index.html", page_shop()),
        write("playbook/index.html", page_playbook()),
        write("speaking/index.html", page_speaking()),
        write("about/index.html", page_about()),
        write("share/index.html", page_share()),
        write("community/index.html", page_community()),
        write("community/circles/index.html", page_circles()),
        write("community/sessions/index.html", page_sessions()),
        write("volunteer/index.html", page_volunteer()),
        write("community/guidelines/index.html", simple("/community/guidelines", "Community safety & guidelines · DYEGU", "Rules for DYEGU Rebuild Circles, free sessions and volunteers.", GUIDELINES, reading_bar=True)),
        write("privacy/index.html", simple("/privacy", "Privacy · DYEGU", "How DYEGU collects and uses your data.", PRIVACY, reading_bar=True)),
        write("studio/index.html", simple("/studio", "Sponsors & partners · DYEGU", "Partner with DYEGU, the documented comeback series presented by Sir K.", STUDIO)),
        write("404.html", simple("/404", "Not found · DYEGU", "Page not found.", '<h1>Lost the thread?</h1><p>This page doesn\'t exist, but the story isn\'t over. <a href="/">Back to DYEGU</a> or <a href="/#start">find the story for where you are</a>.</p>', noindex=True)),
    ]

    urls = (
        ["/"]
        + [f"/start/{s['key']}" for s in STAGES]
        + ["/stories"]
        + [f"/stories/{s['slug']}" for s in STORIES if s.get("live_page")]
        + ["/community", "/community/circles", "/community/sessions", "/volunteer", "/community/guidelines", "/shop", "/playbook", "/speaking", "/about", "/share", "/studio", "/privacy"]
    )
    write(
        "sitemap.xml",
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls)
        + "</urlset>\n",
    )
    print(f"built {len(out)} pages + {len(cals)} calendars + sitemap ({len(urls)} urls)")


if __name__ == "__main__":
    main()
