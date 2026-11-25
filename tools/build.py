#!/usr/bin/env python3
"""Builds every HTML page, .ics calendar feed, and sitemap of dyegu.co.

Design philosophy:
  - The visitor navigating a setback is the hero — never a guru, preacher, or host.
  - High-contrast architectural cadence: Void Black (#000000) <-> Pure Crisp White (#FFFFFF) <-> Warm Paper (#FAF7F2)
    with canonical Flat Gold (#C5A059 / accessible #8A6826 on white).
  - Consolation-wired and conversion-wired across all 26 pages.

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
    ANTI_HYPE,
    CIRCLE_SAFETY_PROMISES,
    CIRCLE_WEEKS,
    FRIEND_MESSAGES,
    PLAYBOOK_CHAPTERS,
    PLAYBOOK_SAMPLE,
    PRODUCTS,
    SESSION_TOPICS,
    SHARE_PROMPTS,
    SITE,
    SPEAKER_KIT,
    STAGES,
    STORIES,
    SUPPORT_URL,
    VERBATIM_VOICES,
    VOLUNTEER_FORMATS,
    WILDERNESS_TIMELINE,
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
    ("/#start", "Start here"),
    ("/stories", "Stories"),
    ("/community", "Community"),
    ("/playbook", "Playbook"),
    ("/shop", "Shop"),
    ("/share", "Share"),
]

STAGE_ICONS = {
    "job": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
    "money": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    "breakup": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s-7-4.5-9-9.2C1.6 8.3 4.2 5 7.5 5c1.9 0 3.5 1 4.5 2.5C13 6 14.6 5 16.5 5 19.8 5 22.4 8.3 21 11.8 19 16.5 12 21 12 21z"/></svg>',
    "health": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 12h4l2.5-6 4 12 2.5-6H21"/></svg>',
    "rejected": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 20V4h11v16"/><path d="M15 12h6m-3-3 3 3-3 3"/><circle cx="11.5" cy="12" r=".8" fill="currentColor"/></svg>',
    "later": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    "stuck": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="15.5,8.5 13.4,13.4 8.5,15.5 10.6,10.6"/></svg>',
    "grief": '<svg class="stage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3v18"/><path d="M6 15c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M4 21h16"/></svg>',
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
    mobile_dock: bool = True,
) -> str:
    url = SITE + (path if path != "/" else "/")
    nav = "".join(
        f'<a href="{h}"{" aria-current=page" if (h == path or (h != "/#start" and path.startswith(h + "/"))) else ""}>{t}</a>'
        for h, t in NAV
    )
    band = join_form_band(path) if join_band else ""
    og_img = og_image_for(og_file)
    progress = '<div class="read-progress" aria-hidden="true"></div>' if reading_bar else ""
    dock = (
        f'<div class="mobile-dock" id="mobile-dock" role="region" aria-label="Quick start">'
        f'<p><strong>Not alone in this</strong>Free 7-Day Reset + Sunday Story</p>'
        f'<a class="btn btn-gold btn-sm" href="{join_href}">Get it free</a>'
        f'<button class="mobile-dock-close" type="button" data-dock-close aria-label="Dismiss">×</button>'
        f'</div>'
        if mobile_dock
        else ""
    )
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
    <button class="comfort-btn" type="button" data-comfort-toggle aria-pressed="false" title="Switch reading light comfort">Night</button>
    <a class="btn btn-gold btn-sm header-cta" href="{join_href}">Get the Comeback File</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile" hidden>{nav}</nav>
</header>
<div class="arrival-ribbon" data-arrival-banner hidden>
  <div class="wrap arrival-ribbon-row">
    <span data-arrival-text></span>
    <a class="link-gold" data-arrival-cta href="/#start">Start here →</a>
  </div>
</div>
<main id="main">
{body}
</main>
{band}
{dock}
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div><img src="/assets/dyegu-lockup.webp" alt="DYEGU — Don't You Ever Give Up" width="1400" height="424" class="footer-lockup" loading="lazy"></div>
    <div class="footer-cols">
      <div><p class="eyebrow">What you're carrying</p>{''.join(f'<a href="/start/{s["key"]}">{e(s["short"])}</a>' for s in STAGES)}</div>
      <div><p class="eyebrow">Community · Free</p><a href="/community/circles">Rebuild Circles</a><a href="/community/sessions">Free expert sessions</a><a href="/volunteer">Volunteer as an expert</a><a href="/community/guidelines">Safety &amp; guidelines</a></div>
      <div><p class="eyebrow">DYEGU</p><a href="/stories">Stories</a><a href="/playbook">Rebuild Playbook</a><a href="/shop">Shop · Drop 01</a><a href="/share">Share your rebuild</a><a href="/about">About DYEGU</a></div>
      <div><p class="eyebrow">Work with us</p><a href="/speaking">Talks &amp; workshops</a><a href="/studio">Sponsors &amp; partners</a><a href="/privacy">Privacy</a></div>
      <div><p class="eyebrow">Follow</p><div class="follow-links" data-follow></div></div>
    </div>
  </div>
  <div class="wrap support-line">
    <p><strong>Struggling right now?</strong> You don't have to carry tonight alone. If you're thinking about suicide or self-harm, please contact a local crisis line or emergency services immediately: <a href="{SUPPORT_URL}" rel="noopener" target="_blank">Find a free, confidential helpline in your country</a>.</p>
  </div>
  <div class="wrap footer-legal">
    <p>Documented comeback stories researched with AI assistance and verified against the published primary sources on every story page.</p>
    <p>© <span data-year>2026</span> DYEGU. All rights reserved.</p>
  </div>
</footer>
<script src="/app.js" defer></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
"""


def stage_select(name="stage", required=False, label="What chapter are you in right now? (optional)"):
    opts = "".join(f'<option value="{s["key"]}">{e(s["short"])}</option>' for s in STAGES)
    return (
        f'<label for="f-{name}-{{uid}}">{label}</label>'
        f'<select id="f-{name}-{{uid}}" name="{name}"{" required" if required else ""}><option value="">Choose one</option>{opts}</select>'
    )


def signup_form(
    list_="comeback_file",
    button="Send me the 7-Day Reset + Sunday Story",
    stage=None,
    fine="Private. Never shared. One-click unsubscribe. Zero spam, ever.",
    success="Your first Sunday Comeback File arrives with Episode 01.",
    ask_stage=False,
    center=False,
    placeholder="Your email address",
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
    <input id="{u}-email" name="email" type="email" autocomplete="email" placeholder="{e(placeholder)}" required>
    <button class="btn btn-gold" type="submit">{button}</button>
  </div>
  {('<div class="stage-pick">' + sel + '</div>') if sel else ''}
  <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="fine">{fine} <a href="/privacy">Privacy</a></p>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>"""


def join_form_band(path: str) -> str:
    stage = path.split("/start/")[1] if path.startswith("/start/") else None
    return f"""<section class="join-band band-light" id="join" data-micro-yes>
  <div class="wrap narrow center">
    <p class="eyebrow">The Comeback File · Free every Sunday</p>
    <h2 class="h2" data-micro-heading>What would help you most this week?</h2>
    <p class="lede">Pick one quiet focus below — we'll send your free 7-Day Rebuild Reset right away, plus one documented comeback every Sunday.</p>
    <div class="micro-pills" role="group" aria-label="Choose your focus for this week">
      <button class="micro-pill" type="button" data-micro-choice="clarity">Clarity on my next move</button>
      <button class="micro-pill" type="button" data-micro-choice="proof">Proof I'm not too late</button>
      <button class="micro-pill" type="button" data-micro-choice="grounding">A quiet weekly reset</button>
      <button class="micro-pill" type="button" data-micro-choice="people">People walking the same road</button>
    </div>
    {signup_form(stage=stage, ask_stage=not stage, center=True, button="Send it free")}
  </div>
</section>"""


def story_card(s: dict, compact: bool = False) -> str:
    live = s.get("live_page")
    ep_meta = EPISODES.get(s["slug"], {})
    tag = "a" if live else "div"
    href = f' href="/stories/{s["slug"]}"' if live else ""
    badge = "Read dossier" if live else ("90-min special" if s.get("special") else ("Announced soon" if s.get("tbc") else "Coming soon"))
    badge_cls = "ep-badge live" if live else "ep-badge"
    extra_cls = " ep-special" if s.get("special") else ("" if live else " ep-soon")
    wilderness = s.get("wilderness", "")
    claims_note = f"{ep_meta['verified_claims']} verified facts" if ep_meta.get("verified_claims") else (f"Wilderness: {wilderness}" if wilderness else "")
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


def premiere_card(
    ep_no: str = "01",
    subject: str = "Steve Jobs",
    iso_date: str = "2026-12-06T14:00:00Z",
    date_label: str = "Sunday 6 December 2026",
    ics_path: str = "/assets/calendar/ep01-steve-jobs.ics",
) -> str:
    gcal = gcal_url(
        f"DYEGU Episode {ep_no} Premiere: {subject}",
        iso_date,
        f"Watch Episode {ep_no} ({subject}) on YouTube @DYEGUOfficial.",
    )
    return f"""<div class="premiere-card" id="premiere">
  <img class="premiere-mark" src="/assets/phoenix.svg" alt="" width="76" height="86">
  <p class="eyebrow">Episode {ep_no} premieres</p>
  <p class="premiere-date">{date_label}</p>
  <p class="premiere-time" data-premiere-time>15:00 WAT · 14:00 GMT · 09:00 ET</p>
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


def portrait_card(caption: str = "Just another rebuilder") -> str:
    return f"""<figure class="portrait-frame" style="margin:0">
  <picture>
    <source srcset="/assets/sir-k-portrait.webp" type="image/webp">
    <img src="/assets/sir-k-portrait.jpg" alt="Portrait of the creator of DYEGU" width="800" height="1000" loading="lazy">
  </picture>
  <figcaption class="portrait-caption">{e(caption)}</figcaption>
</figure>"""


# ------------------------------------------------------------------ pages
def page_home():
    live = [s for s in STORIES if s.get("live_page")]

    # Inline JSON payload for Pure White instant consolation engine
    stage_payload = {
        s["key"]: {
            "short": s["short"],
            "tag": s["tag"],
            "exhale": s["exhale"],
            "proof_person": s["proof_person"],
            "proof_slug": s["proof_slug"],
            "proof_line": s["proof_line"],
            "move1_title": s["moves"][0][0],
            "move1_desc": s["moves"][0][1],
            "move1_day": s["moves"][0][2],
        }
        for s in STAGES
    }

    stage_buttons = []
    for s in STAGES:
        cnt = sum(1 for st in STORIES if s["key"] in st.get("stages", []))
        icon = STAGE_ICONS.get(s["key"], "")
        stage_buttons.append(
            f'<button class="stage-tile" type="button" data-inline-stage="{s["key"]}">'
            f'<div class="stage-tile-top">{icon}<span class="stage-count">{cnt} {"story" if cnt == 1 else "stories"}</span></div>'
            f'<div><span class="stage-tile-title">{e(s["short"])}</span><span class="stage-tile-sub">{e(s["sub"])}</span></div>'
            f'<div class="stage-tile-foot"><span>See proof &amp; move #1</span><span aria-hidden="true">↓</span></div>'
            f'</button>'
        )

    friend_cards = "".join(
        f'<article class="friend-card"><div><h3>{e(label)}</h3><p>“{e(msg)}”</p></div>'
        f'<div class="friend-actions">'
        f'<button class="btn btn-gold btn-sm" type="button" data-share-whatsapp data-share-msg="{e(msg)}">Send on WhatsApp</button>'
        f'<button class="btn btn-subtle btn-sm" type="button" data-share-copy data-share-msg="{e(msg)}">Copy note + link</button>'
        f'</div></article>'
        for label, msg in FRIEND_MESSAGES
    )

    wilderness_rows = "".join(
        f'<li><span class="w-person">{e(w["person"])}</span>'
        f'<div class="w-track"><div class="w-bar-bg"><div class="w-bar-fill" style="width:{w["pct"]}%"></div></div>'
        f'<span class="w-note">{e(w["note"])}</span></div>'
        f'<span class="w-span">{e(w["span"])}</span></li>'
        for w in WILDERNESS_TIMELINE
    )

    voices_html = "".join(
        f'<article class="voice-card" data-reveal><blockquote>“{e(v["quote"])}”</blockquote>'
        f'<div class="voice-meta"><strong>{e(v["person"])}</strong>{e(v["source"])} · <a class="link-gold" href="/stories/{v["slug"]}">Read dossier →</a></div></article>'
        for v in VERBATIM_VOICES
    )

    safety_cards = "".join(
        f'<div class="safety-card"><h4>{e(t)}</h4><p>{e(d)}</p></div>'
        for t, d in CIRCLE_SAFETY_PROMISES
    )

    never_items = "".join(f"<li>{e(x)}</li>" for x in ANTI_HYPE["never"])
    always_items = "".join(f"<li>{e(x)}</li>" for x in ANTI_HYPE["always"])

    sting_modal = """<div class="modal" id="sting-modal" role="dialog" aria-modal="true" aria-label="DYEGU Official Ident" hidden>
  <div class="modal-card">
    <button class="modal-close" type="button" data-close-sting aria-label="Close">×</button>
    <p class="eyebrow" style="margin-bottom:12px">Official 4-Second Ident · Season 1</p>
    <video class="modal-video" controls playsinline preload="metadata" poster="/assets/og.jpg">
      <source src="/assets/sting.mp4" type="video/mp4">
    </video>
  </div>
</div>"""

    body = f"""
<!-- BAND 1: VOID BLACK HERO — 100% ABOUT THE VISITOR (ZERO SELF-PROMOTION) -->
<section class="hero band-dark">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow eyebrow-rule">Don't You Ever Give Up</p>
      <h1 class="display">Your lowest chapter is <em>not your last.</em></h1>
      <p class="lede">If life just knocked the floor out from under you, take a breath. You are not broken — and you are not the first to rebuild from zero. Documented comebacks, honest timelines, and one steady move for this week.</p>
      <div class="hero-capture">
        {signup_form(button="Get the 7-Day Reset + Sunday Story", placeholder="Enter your email for instant access", fine="Free. Instant 7-day move guide tonight + one quiet email every Sunday. Unsubscribe in 1 click.")}
      </div>
      <div class="hero-secondary">
        <a href="#start">Not ready to subscribe? Tell us what you're carrying ↓</a>
        <button type="button" data-open-sting><span class="play-dot" aria-hidden="true">▶</span> Watch 4s Official Ident</button>
      </div>
    </div>

    <aside class="hero-proof-card" aria-label="Documented wilderness timelines">
      <p class="eyebrow" style="margin-bottom:6px">Real lives · Real timelines</p>
      <h2 class="h3" style="margin-bottom:6px">Every comeback took longer than people admit.</h2>
      <ul class="proof-rows">
        <li><div class="p-arc"><strong>Steve Jobs</strong>Stripped of every Apple role at 30 → returned to rebuild it</div><span class="p-span">11 yrs</span></li>
        <li><div class="p-arc"><strong>J.K. Rowling</strong>On benefits in Edinburgh, 12 rejections → one reader said yes</div><span class="p-span">3 yrs</span></li>
        <li><div class="p-arc"><strong>Tyler Perry</strong>30 people came to his play, slept in a car → 330-acre studio</div><span class="p-span">6 yrs</span></li>
      </ul>
      <div class="hero-proof-foot">
        <span>Episode 01 premieres Sun 6 Dec · 15:00 WAT</span>
        <a href="/assets/calendar/ep01-steve-jobs.ics" download>Add to calendar (.ics) →</a>
      </div>
    </aside>
  </div>
</section>

<!-- BAND 2: PURE CRISP WHITE — INSTANT CONSOLATION & 3-STATE READINESS ENGINE -->
<section class="section band-light" id="start" data-readiness>
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Start where you actually are</p>
    <h2 class="h2">What are you carrying today?</h2>
    <p class="lede">Nobody walks in the same emotional state. Choose what fits tonight — zero pressure, zero motivational noise.</p>

    <div class="readiness-tabs" role="tablist" aria-label="Choose how you want to start">
      <button class="readiness-tab active" type="button" role="tab" aria-selected="true" data-readiness-tab="move">I'm ready for one small move</button>
      <button class="readiness-tab" type="button" role="tab" aria-selected="false" data-readiness-tab="heavy">Tonight is heavy — just steady me</button>
      <button class="readiness-tab" type="button" role="tab" aria-selected="false" data-readiness-tab="friend">I'm here for someone I love</button>
    </div>

    <!-- PANE 1: 8-Stage Inline Consolation & First-Step Engine -->
    <div class="readiness-pane" data-readiness-pane="move">
      <div class="stage-grid">{''.join(stage_buttons)}</div>

      <div class="consolation-panel" id="consolation-panel" hidden>
        <div class="consolation-grid">
          <div>
            <p class="eyebrow" data-cp-tag>Your chapter</p>
            <p class="consolation-exhale" data-cp-exhale></p>
            <div class="consolation-proof" data-cp-proof></div>
            <div class="consolation-move">
              <span class="move-day" data-cp-move-day>Move I</span>
              <h4 data-cp-move-title></h4>
              <p data-cp-move-desc></p>
            </div>
          </div>
          <div class="consolation-cta-box">
            <p class="eyebrow" style="margin-bottom:8px">Keep going at your own pace</p>
            <h3 class="h3">Get the full 7-Day Reset + Sunday Comeback File</h3>
            <p class="muted small" style="margin:0 0 16px">Tailored to this exact chapter. Free every Sunday, unsubscribe anytime.</p>
            {signup_form(button="Send my 7-Day Reset", placeholder="Your email", fine="Private. Never shared. Zero spam.")}
            <div class="consolation-links">
              <a class="link-gold" data-cp-full-link href="/start/job">Open all 3 moves &amp; printable plan →</a>
              <a class="link-gold" data-cp-circle-link href="/community/circles">Join a free Rebuild Circle →</a>
              <a class="link-gold" data-cp-story-link href="/stories/steve-jobs">Read the verified dossier →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PANE 2: Heavy Tonight — Parasympathetic 60-Second Physiological Sigh -->
    <div class="readiness-pane" data-readiness-pane="heavy" hidden>
      <div class="heavy-box">
        <div>
          <p class="eyebrow">No homework tonight</p>
          <h3 class="h2" style="margin-bottom:14px">You do not have to fix your whole life tonight.</h3>
          <p class="lede">When a hard blow lands, your nervous system stays on high alert and makes every hour feel permanent. Give yourself sixty quiet seconds to let your shoulders drop. That is enough for tonight.</p>
          <div class="hero-actions" style="display:flex;gap:12px;flex-wrap:wrap">
            <a class="btn btn-dark btn-sm" href="#join">Get one quiet email on Sundays</a>
            <a class="btn btn-subtle btn-sm" href="{SUPPORT_URL}" target="_blank" rel="noopener">Need to talk to someone right now?</a>
          </div>
        </div>
        <div class="breath-stage">
          <div class="breath-ring" data-breath-ring>Ready</div>
          <p class="breath-cue" data-breath-cue>Six slow cycles · 4 seconds in, 6 seconds out.</p>
          <button class="btn btn-gold btn-sm" type="button" data-breath-start>Start 60-second exhale</button>
        </div>
      </div>
    </div>

    <!-- PANE 3: Helping Someone You Love — Dignified Viral Friend-Share -->
    <div class="readiness-pane" data-readiness-pane="friend" hidden>
      <p class="lede" style="margin-bottom:20px">When someone you love is hurting, loud advice rarely helps. Send one quiet, zero-cringe note that lets them know they aren't alone — when they open it, DYEGU will welcome them gently.</p>
      <div class="friend-grid">{friend_cards}</div>
    </div>
  </div>
</section>

<!-- BAND 3: WARM EDITORIAL PAPER — WILDERNESS DURATION REFRAME + VERBATIM VOICES -->
<section class="section band-warm">
  <div class="wrap">
    <div class="narrow">
      <p class="eyebrow eyebrow-rule">Perspective when it feels endless</p>
      <h2 class="h2">How long the wilderness actually lasted.</h2>
      <p class="lede">Despair happens when you assume month four is the final verdict. Look at the documented gap between rock bottom and breakthrough across Season 1 — you are not failing, you are simply in the middle.</p>
    </div>
    <ul class="wilderness-list" data-reveal>{wilderness_rows}</ul>
    <div class="voices-grid">{voices_html}</div>
  </div>
</section>

<!-- BAND 4: VOID BLACK CINEMA GALLERY — SEASON 1 DOCUMENTARIES -->
<section class="section band-dark" id="episodes">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow eyebrow-rule">Season 1 · 14 Sundays starting 6 December 2026</p><h2 class="h2">Real proof you can verify.</h2></div>
      <a class="link-gold" href="/stories">Explore all 14 Season 1 stories →</a>
    </div>
    <div class="episodes" data-episodes>{''.join(story_card(s) for s in live)}</div>
  </div>
</section>

<!-- BAND 5: PURE CRISP WHITE — ANTI-HYPE COVENANT + TANGIBLE COMEBACK FILE SPECIMEN -->
<section class="section band-light" id="standard">
  <div class="wrap trust-split">
    <div>
      <p class="eyebrow eyebrow-rule">Our covenant with you</p>
      <h2 class="h2">Hope with receipts — never hype.</h2>
      <p class="lede">When you've lost something real, slogans feel insulting. Every story here is audited against primary records before it is ever told.</p>
      <div class="covenant-grid">
        <div class="covenant-col never">
          <h3>What DYEGU will never be</h3>
          <ul>{never_items}</ul>
        </div>
        <div class="covenant-col always">
          <h3>What you can hold us to</h3>
          <ul>{always_items}</ul>
        </div>
      </div>
    </div>

    <aside class="specimen-card" data-reveal aria-label="Sample preview of The Comeback File email">
      <div class="specimen-meta">
        <span>Sample · The Comeback File</span>
        <span>Every Sunday · 4-min read</span>
      </div>
      <h3>Issue 01 · What Eleven Years in Exile Built</h3>
      <p class="muted small" style="margin:0">What lands quietly in your inbox every Sunday afternoon:</p>
      <ul class="specimen-parts">
        <li><strong>1. The 3-Minute Story</strong>How Steve Jobs turned public dismissal at 30 into NeXT, Pixar, and a return to Apple.</li>
        <li><strong>2. Three Primary Receipts</strong>Direct links to the 1985 Fortune &amp; WSJ filings and the 1996 NeXT S-1 — check every fact yourself.</li>
        <li><strong>3. The DYEGU Rule</strong>“Sometimes losing the version of your life you outgrew is how you build the one that lasts.”</li>
        <li><strong>4. One 30-Minute Move</strong>One calm, concrete step for your week — never a ten-step hustle lecture.</li>
      </ul>
    </aside>
  </div>
</section>

<!-- BAND 6: WARM PAPER — FREE COMMUNITY + 4-PROMISE PSYCHOLOGICAL SAFETY -->
<section class="section band-warm">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow eyebrow-rule">DYEGU Community · Always $0</p><h2 class="h2">Nobody should have to rebuild in silence.</h2></div>
      <a class="link-gold" href="/community">See how the community works →</a>
    </div>
    <div class="doors" data-reveal>
      <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h3 class="h3">Rebuild Circles</h3><p>Six weeks with 6–8 ordinary people navigating your exact chapter in your time zone, hosted by a trained volunteer.</p><span class="link-gold">Step into a circle →</span></a>
      <a class="door" href="/community/sessions"><p class="eyebrow">Practical help</p><h3 class="h3">Free Expert Sessions</h3><p>Vetted recruiters, accountants, lawyers, founders and counsellors giving honest, pitch-free guidance live.</p><span class="link-gold">Request a topic →</span></a>
      <a class="door" href="/volunteer"><p class="eyebrow">Walk beside others</p><h3 class="h3">Volunteer an hour</h3><p>Been through it yourself or carry useful professional skills? Give one hour a month to someone starting over.</p><span class="link-gold">Apply to volunteer →</span></a>
    </div>
    <div class="safety-grid" aria-label="Community psychological safety promises">{safety_cards}</div>
  </div>
</section>

<!-- BAND 7: VOID BLACK — PLAYBOOK & DROP 01 LUXURY STUDIO SHOWCASE -->
<section class="section band-dark">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow eyebrow-rule">Built to keep beside you</p><h2 class="h2">The Playbook &amp; Drop 01</h2></div>
      <a class="link-gold" href="/share">Or share your own rebuild story →</a>
    </div>
    <div class="offer-grid">
      <a class="offer offer-link offer-shop" href="/playbook" data-reveal>
        <img src="{product_img('playbook')}" alt="The Rebuild Playbook cover" width="460" height="460" loading="lazy">
        <div>
          <p class="eyebrow">Coming January 2027 · $19</p>
          <h3 class="h3">The Rebuild Playbook</h3>
          <p>The documented patterns across Season 1, turned into a 7-chapter practical workbook. Free Chapter 1 sample inside.</p>
          <span class="link-gold">Read Chapter 1 sample →</span>
        </div>
      </a>
      <a class="offer offer-link offer-shop" href="/shop" data-reveal>
        <img src="{product_img('mug')}" alt="The DYEGU Studio Mug" width="460" height="460" loading="lazy">
        <div>
          <p class="eyebrow">Drop 01 · Rise</p>
          <h3 class="h3">Quiet daily reminders</h3>
          <p>The matte-black Studio Mug, heavyweight Rise tee and hoodie, phoenix cap, and linen Rebuild Journal.</p>
          <span class="link-gold">Preview Drop 01 →</span>
        </div>
      </a>
    </div>
  </div>
</section>

<script id="stage-data" type="application/json">{json.dumps(stage_payload, ensure_ascii=False)}</script>
{sting_modal}
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
    ]
    return layout(
        "/",
        "DYEGU — Don't You Ever Give Up · Your lowest chapter is not your last",
        "Real documented comebacks, honest timelines, free peer Rebuild Circles, and one calm move for your week. No hype, no toxic positivity — just real proof that rebuilding is possible.",
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
        f'<aside class="care-note"><p><strong>If tonight feels heavier than a setback:</strong> please speak with a doctor, a counsellor, or someone you trust. If you\'re thinking about suicide or self-harm, contact a local crisis line or emergency services right now: <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free, confidential helpline in your country</a>.</p></aside>'
        if s.get("sensitive")
        else ""
    )
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/#start">What you're carrying</a> · {e(s['tag'])}</p>
    <h1 class="display-sm">{e(s['title'])}</h1>
    <p class="lede">{e(s['exhale'])}</p>
    <div class="stage-rule-banner">
      <p class="eyebrow" style="margin-bottom:6px">A grounding truth</p>
      <blockquote>“{e(s['rule_preview'])}”</blockquote>
    </div>
  </div>
</section>

<section class="section-tight band-light">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Small, honest momentum</p>
    <h2 class="h3">Your 7-day rebuild moves</h2>
    <div class="checklist-bar">
      <span class="checklist-status" data-checklist-status><strong>0 of 3</strong> moves completed this week</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-subtle btn-sm" type="button" data-print-plan>Print / save 1-page plan</button>
        <button class="btn btn-subtle btn-sm" type="button" data-share-copy data-share-self="1">Save page to phone</button>
        <button class="btn btn-gold btn-sm" type="button" data-quote-card data-quote="{e(s['rule_preview'])}" data-subject="{e(s['short'])}">Save rule card</button>
      </div>
    </div>
    <ol class="moves" data-checklist="{s['key']}">{''.join(moves_html)}</ol>
    {support}
    <div class="stage-bridge">
      <div>
        <p class="eyebrow" style="margin-bottom:6px">You don't have to walk this alone · $0</p>
        <h3>Step into a Rebuild Circle for this chapter</h3>
        <p>Meet 6–8 ordinary people navigating the exact same setback in your time zone, once a week for six weeks. Camera optional on rough days.</p>
      </div>
      <a class="btn btn-gold btn-sm" href="/community/circles?stage={s['key']}">Join matching circle →</a>
    </div>
  </div>
</section>

<section class="section band-dark">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Documented proof for where you are</p>
    <h2 class="h2">They stood in this exact storm.</h2>
    <div class="episodes" data-episodes>{''.join(story_card(x, compact=True) for x in stories)}</div>
  </div>
</section>

<section class="section band-light" id="stage-join">
  <div class="wrap narrow center">
    <p class="eyebrow">{e(s["short"])}</p>
    <h2 class="h2">One real story and one calm move every Sunday.</h2>
    <p class="lede">Picked for where you are right now. Free, quiet, and built for real life — never loud hype.</p>
    {signup_form(stage=s['key'], button="Send me the Comeback File", center=True, success="You're in. Until Sunday's issue arrives, start gently with Move I above.")}
  </div>
</section>

<section class="section-tight band-warm">
  <div class="wrap">
    <p class="eyebrow">Carrying something else?</p>
    <div class="chip-row">{others}</div>
  </div>
</section>
"""
    ld = [breadcrumb_ld([("Home", "/"), ("Start here", "/#start"), (s["short"], f"/start/{s['key']}")])]
    return layout(
        f"/start/{s['key']}",
        f"{s['title']} — 7-day moves and real comebacks · DYEGU",
        s["exhale"],
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
<section class="page-hero band-dark">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Season 1 · 14 Sundays · 6 December 2026 – 7 March 2027</p>
    <h1 class="display-sm">Stories you can check.</h1>
    <p class="lede">Every episode follows someone who lost real status, health, livelihood or direction and took the long road back. Every published dossier lists its primary sources openly.</p>
    <div style="margin-top:8px">
      <a class="btn btn-ghost btn-sm" href="/assets/calendar/dyegu-season1.ics" download>Add all 14 Sunday premieres to calendar (.ics)</a>
    </div>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap">
    <div class="filter-bar" data-story-filters role="group" aria-label="Filter Season 1 by life chapter">
      <span class="filter-label">Filter by chapter:</span>
      {filter_chips}
    </div>
    <p class="filter-meta" data-filter-count>Showing {len(STORIES)} of {len(STORIES)} Season 1 episodes</p>
    <div class="episodes" data-episodes>{''.join(story_card(s) for s in STORIES)}</div>
    <p class="muted small" style="margin-top:28px">Full research dossiers unlock as each episode clears verification. <a class="link-gold" href="#join">Get new dossiers in The Comeback File →</a></p>
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

    chapters = ep.get("chapters", [])
    chapters_html = ""
    if chapters:
        ch_items = "".join(
            f'<li><span class="axis-time">{e(c["timestamp"])}</span><h3 class="axis-title">{e(c["label"])}</h3></li>'
            for c in chapters
        )
        chapters_html = f"""<section class="section-tight band-light">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Episode anatomy</p>
    <h2 class="h3">Chapters &amp; timeline</h2>
    <ol class="axis-timeline">{ch_items}</ol>
  </div>
</section>"""

    rule_text = ep.get("dyegu_rule", "")
    comment_prompt = ep.get("comment_prompt", "")
    rule_html = ""
    if rule_text:
        rule_html = f"""<section class="section-tight band-dark">
  <div class="wrap narrow">
    <div class="dyegu-rule-box" data-reveal>
      <p class="eyebrow eyebrow-rule" style="margin-bottom:14px">The DYEGU Rule · Takeaway for your own road</p>
      <blockquote class="dyegu-rule-quote">“{e(rule_text)}”</blockquote>
      {f'<p class="dyegu-rule-prompt"><strong>Question to sit with:</strong> {e(comment_prompt)}</p>' if comment_prompt else ''}
      <div class="dyegu-rule-actions">
        <button class="btn btn-gold btn-sm" type="button" data-quote-card data-quote="{e(rule_text)}" data-subject="{e(s['subject'])}" data-ep="{s['no']}">Save shareable rule card (.png)</button>
        <button class="btn btn-subtle btn-sm" type="button" data-share-copy data-share-self="1">Save dossier to phone</button>
        <a class="btn btn-ghost btn-sm" href="/share">Share how this speaks to your rebuild</a>
      </div>
    </div>
  </div>
</section>"""

    shorts = ep.get("shorts", [])
    moments_html = ""
    if shorts:
        m_cards = "".join(
            f'<article class="moment-card"><div><p class="eyebrow" style="margin:0">Documented turning point</p>'
            f'<h3 class="moment-hook">“{e(sh["hook"])}”</h3></div>'
            f'<p class="moment-proof">{e(sh["proof"])}</p></article>'
            for sh in shorts
        )
        moments_html = f"""<section class="section-tight band-warm">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Three moments that mattered</p>
    <h2 class="h3">Inside the wilderness &amp; turning point</h2>
    <div class="moments-grid">{m_cards}</div>
  </div>
</section>"""

    tag_counts = src.get("tag_counts", {})
    held_back = src.get("held_back", 0)
    honesty_html = (
        f'<div class="honesty-badge"><strong>Editorial honesty:</strong> {held_back} unconfirmed claim{" was" if held_back == 1 else "s were"} held back and left out of the script.</div>'
        if held_back > 0
        else '<div class="honesty-badge"><strong>Audit result:</strong> Every narrated fact maps cleanly to a published record below.</div>'
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
    wilderness_str = s.get("wilderness", "Years")
    ics_rel = f"/assets/calendar/ep{s['no']}-{s['slug']}.ics"

    body = f"""
<section class="page-hero band-dark">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow"><a href="/stories">Season 1</a> · Episode {s['no']} · <span data-when="{s['date']}"></span></p>
      <h1 class="display-sm">{e(s['subject'])}</h1>
      <p class="lede">{e(s['synopsis'])}</p>
      <div class="dossier-rail">
        <div class="dossier-stat"><span>Wilderness</span><strong>{e(wilderness_str)}</strong></div>
        <div class="dossier-stat"><span>Runtime</span><strong>{e(runtime_str)}</strong></div>
        <div class="dossier-stat"><span>Verified facts</span><strong>{src['verified_claims']} published</strong></div>
      </div>
    </div>
    <div class="story-media" data-video="{e(s.get('youtube_id', ''))}" data-story-slug="{s['slug']}" data-title="Episode {s['no']}: {e(s['subject'])}" data-date="{s['date']}">
      {premiere_card(ep_no=s['no'], subject=s['subject'], iso_date=s['date'], date_label=f'<span data-when-long="{s["date"]}"></span>', ics_path=ics_rel)}
    </div>
  </div>
</section>

{chapters_html}
{moments_html}
{rule_html}

<section class="section-tight band-light" id="sources">
  <div class="wrap narrow" data-ledger>
    <p class="eyebrow eyebrow-rule">Receipts &amp; verification ledger</p>
    <h2 class="h3">{src['verified_claims']} claims checked against {len(src.get('sources', []))} sources</h2>
    <p class="muted">Every claim was verified against a primary record <strong>[V]</strong>, established reporting <strong>[E]</strong>, or attributed directly to the subject's own words <strong>[T]</strong>.</p>
    {honesty_html}
    <div class="filter-bar" role="group" aria-label="Filter sources by evidence type">
      <button class="filter-chip active" type="button" data-ledger-tag="all" aria-pressed="true">All ({len(src.get('sources', []))})</button>
      <button class="filter-chip" type="button" data-ledger-tag="V" aria-pressed="false">[V] Primary records ({tag_counts.get('V', 0)})</button>
      <button class="filter-chip" type="button" data-ledger-tag="E" aria-pressed="false">[E] Reporting ({tag_counts.get('E', 0)})</button>
      <button class="filter-chip" type="button" data-ledger-tag="T" aria-pressed="false">[T] Testimony ({tag_counts.get('T', 0)})</button>
    </div>
    <details class="sources" open>
      <summary>Published source ledger ({len(src.get('sources', []))} links)</summary>
      <ul class="ledger-list">{ledger_items}</ul>
    </details>
    {f'<details class="sources"><summary>Sample verified claims from the research file</summary><ul class="claims-sample">{claims_sample}</ul></details>' if claims_sample else ''}
  </div>
</section>

<section class="section-tight band-warm">
  <div class="wrap narrow">
    <h2 class="h3">If this story mirrors what you're carrying</h2>
    <p class="muted">Open the matching chapter for three quiet moves this week and a free Rebuild Circle.</p>
    <div class="chip-row">{stage_links}</div>
    {f'<p style="margin-top:28px"><span class="eyebrow" style="display:block;margin-bottom:6px">Next dossier</span><a class="link-gold big" href="/stories/{nxt["slug"]}">Episode {nxt["no"]}: {e(nxt["subject"])} →</a></p>' if nxt else ''}
  </div>
</section>
"""
    ld = [
        breadcrumb_ld([("Home", "/"), ("Stories", "/stories"), (s["subject"], f"/stories/{s['slug']}")]),
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": f"{s['subject']} — Documented Comeback (DYEGU Episode {s['no']})",
            "description": s["synopsis"],
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
<section class="page-hero band-dark">
  <div class="wrap narrow center">
    <p class="eyebrow">DYEGU Shop · Drop 01</p>
    <h1 class="display-sm">Rise</h1>
    <p class="lede">Five quiet objects worth keeping close on the hard mornings. Matte black, flat gold, the phoenix and the words. Made in small runs, never discounted.</p>
  </div>
</section>
<section class="section-tight band-dark" style="padding-top:0">
  <div class="wrap">
    <div class="products">{cards}</div>
    <p class="muted small center" style="margin-top:20px">Pre-production studio renders &amp; technical plates. Nothing ships until physical samples match our matte black and flat gold.</p>
    <div class="shop-tray" id="shop-tray" hidden>
      <p data-tray-text></p>
      <a class="btn btn-gold btn-sm" href="#drop">Join drop list →</a>
    </div>
  </div>
</section>
<section class="section band-light" id="drop">
  <div class="wrap narrow center">
    <p class="eyebrow">First access · Drop 01</p>
    <h2 class="h2">Join the drop list.</h2>
    <p class="lede">Tick what you'd keep on your desk or wear above, leave your email, and you'll hear first before public release.</p>
    {signup_form(list_='merch_waitlist', button='Join the drop list', center=True, fine='One email when Drop 01 opens. Nothing else unless you subscribe.', success="You're on the Drop 01 list. You'll hear first when Rise opens.").replace('<form ', '<form id="drop-form" ', 1)}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Shop · Drop 01", "/shop")])]
    return layout(
        "/shop",
        "Shop — Drop 01: Rise · DYEGU",
        "The DYEGU studio mug, Rise tee and hoodie, phoenix cap and Rebuild Journal. Join the drop list for first access.",
        body,
        join_band=False,
        join_href="#drop",
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
<section class="page-hero band-dark">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow eyebrow-rule">Coming January 2027</p>
      <h1 class="display-sm">The Rebuild Playbook</h1>
      <p class="lede">The documented patterns behind every comeback in Season 1, turned into a calm, unsentimental workbook for your own rebuild. Read it in an evening. Work through it over thirty days.</p>
      <p class="price-line"><span class="price-big">$19</span> <span class="muted">· digital workbook + printable worksheets · early price for subscribers</span></p>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn-gold" href="#waitlist">Join the early waitlist</a>
        <a class="btn btn-ghost" href="#sample">Read Chapter 1 sample</a>
      </div>
    </div>
    <div class="book-mock"><img src="{product_img('playbook')}" alt="The Rebuild Playbook cover" width="600" height="600"></div>
  </div>
</section>

<section class="section-tight band-light">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Table of contents</p>
    <h2 class="h3">Seven chapters, seven quiet worksheets</h2>
    <ol class="axis-timeline">{ch_items}</ol>
    <details class="sample-sheet" id="sample" open>
      <summary>Look inside · {e(PLAYBOOK_SAMPLE['chapter'])}: {e(PLAYBOOK_SAMPLE['title'])}</summary>
      <p class="muted" style="margin-top:16px">{e(PLAYBOOK_SAMPLE['intro'])}</p>
      <div class="sample-prompts">{sample_items}</div>
    </details>
  </div>
</section>

<section class="section-tight band-warm">
  <div class="wrap narrow">
    <h2 class="h3">Need something free tonight?</h2>
    <p class="muted">Choose your current chapter for three free moves right now:</p>
    <div class="chip-row">{tags}</div>
  </div>
</section>

<section class="section band-light" id="waitlist">
  <div class="wrap narrow center">
    <h2 class="h2">Get it first, at the early price.</h2>
    <p class="lede">One email when The Rebuild Playbook opens in January 2027.</p>
    {signup_form(list_='playbook_waitlist', button='Join the waitlist', ask_stage=True, center=True, fine="Private. One email at launch with the early subscriber price.", success="You're on the waitlist. We'll email you at launch with the early price.")}
  </div>
</section>"""
    ld = [
        breadcrumb_ld([("Home", "/"), ("The Rebuild Playbook", "/playbook")]),
        {
            "@context": "https://schema.org",
            "@type": "Book",
            "name": "The Rebuild Playbook",
            "publisher": {"@type": "Organization", "name": "DYEGU"},
            "offers": {"@type": "Offer", "price": "19", "priceCurrency": "USD", "availability": "https://schema.org/PreOrder"},
        },
    ]
    return layout(
        "/playbook",
        "The Rebuild Playbook — $19 · DYEGU",
        "A practical 7-chapter workbook built from Season 1's documented comebacks. Read a Chapter 1 sample and join the early waitlist.",
        body,
        join_band=False,
        join_href="#waitlist",
        og_file="playbook.jpg",
        ld=ld,
    )


def page_speaking():
    u = uid()
    aud_tags = "".join(f"<span>{e(a)}</span>" for a in SPEAKER_KIT["audiences"])
    fmt_tags = "".join(f"<span>{e(f)}</span>" for f in SPEAKER_KIT["formats"])
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap host">
    {portrait_card("Sir K · Founder, DYEGU")}
    <div>
      <p class="eyebrow eyebrow-rule">Talks &amp; workshops</p>
      <h1 class="display-sm">Honest conversations about rebuilding.</h1>
      <p class="lede">No motivational theatre or stage hype. Calm, evidence-grounded talks and workshops built from primary-sourced comebacks and twenty years of building teams and starting again.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn-gold" href="#enquire">Check availability</a>
        <a class="btn btn-ghost" href="#press-kit">Event organiser press kit</a>
      </div>
      <div class="tag-list">{aud_tags}</div>
    </div>
  </div>
</section>

<section class="section-tight band-light">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">Three grounded sessions</p>
    <h2 class="h2">Built for real rooms after real setbacks.</h2>
    <div class="pillars" data-reveal>
      <article>
        <span class="num">I</span>
        <h3>The Comeback Pattern</h3>
        <p>What documented rebuilds across Season 1 actually share — and the quiet, repeatable habits teams and individuals can apply without hype.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="The Comeback Pattern" data-prefill-kind="talk">Enquire about this talk</button></div>
      </article>
      <article>
        <span class="num">II</span>
        <h3>Rebuilding After a Hard Year</h3>
        <p>For organisations navigating restructuring, layoffs, or a painful miss. Honest, unsentimental clarity that restores agency.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="Rebuilding After a Hard Year" data-prefill-kind="workshop">Enquire about this workshop</button></div>
      </article>
      <article>
        <span class="num">III</span>
        <h3>Systems That Survive Failure</h3>
        <p>For founders and leaders: building companies, culture and decision habits that can absorb a hard hit and keep standing.</p>
        <div class="pillar-action"><button class="btn btn-subtle btn-sm" type="button" data-prefill-topic="Systems That Survive Failure" data-prefill-kind="talk">Enquire about this talk</button></div>
      </article>
    </div>
    <div class="tag-list" style="margin-top:24px">{fmt_tags}</div>
  </div>
</section>

<section class="section-tight band-warm" id="press-kit">
  <div class="wrap">
    <p class="eyebrow eyebrow-rule">For event organisers &amp; press</p>
    <h2 class="h3">Approved bios &amp; press portrait</h2>
    <div class="press-grid">
      <div class="press-box">
        <h3>Short introduction (60 words)</h3>
        <p id="bio-short">{e(SPEAKER_KIT['short_bio'])}</p>
        <button class="btn btn-subtle btn-sm" type="button" data-copy-target="bio-short">Copy short bio</button>
      </div>
      <div class="press-box">
        <h3>Conference bio</h3>
        <p id="bio-long">{e(SPEAKER_KIT['long_bio'])}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-subtle btn-sm" type="button" data-copy-target="bio-long">Copy bio</button>
          <a class="btn btn-ghost btn-sm" href="/assets/sir-k-portrait.jpg" download="SirK_DYEGU_Press_Portrait.jpg">Download portrait (.jpg)</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section band-light" id="enquire">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Booking desk</p>
    <h2 class="h2">Make an enquiry</h2>
    <form class="js-form enquiry" data-table="enquiries" data-success="Thank you. Our team will reply within a few working days." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">Name</label><input id="{u}n" name="name" autocomplete="name" required maxlength="120"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}o">Organisation</label><input id="{u}o" name="organisation" autocomplete="organization" maxlength="160"></div>
        <div><label for="{u}k">Enquiry</label><select id="{u}k" name="kind"><option value="talk">Talk or keynote</option><option value="workshop">Workshop</option><option value="sponsor">Sponsorship</option><option value="press">Press</option><option value="other">Something else</option></select></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}d">Date or timing</label><input id="{u}d" name="event_date" maxlength="60" placeholder="e.g. March 2027"></div>
        <div><label for="{u}b">Budget</label><select id="{u}b" name="budget"><option value="">Prefer to discuss</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$7,500</option><option>$7,500+</option></select></div>
      </div>
      <label for="{u}a">Audience</label><input id="{u}a" name="audience" maxlength="160" placeholder="Who, how many, in person or online">
      <label for="{u}m">Message</label>
      <textarea id="{u}m" name="message" rows="5" required maxlength="4000" placeholder="Tell us about your gathering, theme and goals"></textarea>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Check availability</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Speaking", "/speaking")])]
    return layout(
        "/speaking",
        "Talks & Workshops · DYEGU",
        "Evidence-grounded talks and workshops on setbacks and rebuilding, built from DYEGU's documented stories.",
        body,
        og_file="speaking.jpg",
        ld=ld,
    )


def page_about():
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">About DYEGU</p>
    <h1 class="display-sm">Every person rebuilding is the hero of this story.</h1>
    <p class="lede">DYEGU — <em>Don't You Ever Give Up</em> — is not a self-help cult, a stage for a miracle worker, or a motivational megaphone. It is a quiet, primary-sourced record of how ordinary and well-known people survived public collapse — and a free community so nobody has to rebuild alone.</p>
  </div>
</section>

<section class="section band-light">
  <div class="wrap host">
    {portrait_card("Sir K · Fellow Rebuilder & Creator")}
    <div>
      <p class="eyebrow eyebrow-rule">Who started this</p>
      <h2 class="h2">Not a guru. Just another person rebuilding.</h2>
      <p class="lede">I'm not a motivational speaker, a preacher, or a miracle worker. I've spent twenty years building teams and companies — and I've had to pick up the pieces and rebuild more than once, and I'm still rebuilding today.</p>
      <p class="muted">When things fell apart for me, loud slogans only made me feel more alone. What actually steadied me was reading honest, unvarnished proof of how long other people's wilderness years really lasted — and seeing that ordinary endurance works. DYEGU is simply that room, built carefully for anyone walking through a hard season right now.</p>
      <p class="signoff">“Until the next story… don't you ever give up.”</p>
    </div>
  </div>
</section>

<section class="section-tight band-warm">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">How every story is verified</p>
    <h2 class="h3">Three rules before a word is published</h2>
    <ol class="axis-timeline">
      <li><span class="axis-time">Step 01 · Primary records first</span><h3 class="axis-title">Check the dates and filings</h3><p class="axis-desc">Every claim enters a claims file tagged as primary record [V], established reporting [E], or the subject's own words [T].</p></li>
      <li><span class="axis-time">Step 02 · Hold back the uncertain</span><h3 class="axis-title">Never invent drama</h3><p class="axis-desc">Anything we cannot confirm is cut. Sensitive moments are treated with restraint and dignity — the rebuild leads, never the wound.</p></li>
      <li><span class="axis-time">Step 03 · Publish every receipt</span><h3 class="axis-title">Open to your scrutiny</h3><p class="axis-desc">Every story dossier publishes its complete source list openly so you never have to take anyone's word on faith.</p></li>
    </ol>
  </div>
</section>

<section class="section-tight band-light">
  <div class="wrap narrow">
    <h2 class="h3">Get involved</h2>
    <p class="muted">Share your own rebuild: <a class="link-gold" href="/share">write to us privately</a> · Volunteer an hour a month: <a class="link-gold" href="/volunteer">apply here</a> · Events or partnerships: <a class="link-gold" href="/speaking#enquire">use the enquiry desk</a>.</p>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("About DYEGU", "/about")])]
    return layout(
        "/about",
        "About DYEGU — Why This Place Exists",
        "Why DYEGU exists, how every comeback story is primary-sourced and checked, and why the person rebuilding is always the hero.",
        body,
        og_file="about.jpg",
        ld=ld,
        reading_bar=True,
    )


def page_share():
    u = uid()
    starter_btns = "".join(
        f'<button class="starter-pill" type="button" data-starter-text="{e(txt)}">“{e(lbl)}…”</button>'
        for lbl, txt in SHARE_PROMPTS
    )
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">Share your rebuild</p>
    <h1 class="display-sm">Your story belongs here too.</h1>
    <p class="lede">In the raw middle of it or standing on the other side — real people read every single story privately. Nothing is ever published without asking you again first.</p>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap narrow">
    <form class="js-form share" data-table="rebuilds" data-success="Thank you for trusting us with your story. We read every one privately." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">First name (optional)</label><input id="{u}n" name="first_name" autocomplete="given-name" maxlength="60"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      {stage_select(label="Which chapter is closest to your story?").replace("{uid}", u)}
      <label for="{u}s">Your story</label>
      <p class="muted small" style="margin:0 0 6px">Not sure how to start? Tap a quiet prompt below:</p>
      <div class="starter-pills">{starter_btns}</div>
      <textarea id="{u}s" name="story" rows="9" required minlength="20" maxlength="6000" placeholder="What happened, where you are today, and what is helping you keep standing. Please leave out details that identify other people."></textarea>
      <p class="char-count" data-story-count>0 / 6000</p>
      <aside class="care-note care-live" data-care-live hidden>
        <p><strong>You don't have to carry tonight alone.</strong> If you're feeling overwhelmed or thinking about harming yourself, free confidential support is available right now at <a href="{SUPPORT_URL}" target="_blank" rel="noopener">findahelpline.com</a>.</p>
      </aside>
      <label class="check"><input type="checkbox" name="consent_contact"> You can email me privately about my story.</label>
      <label class="check"><input type="checkbox" name="consent_feature"> You can share my story in The Comeback File using my first name only. I will always be asked again before anything is published.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Share privately</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <aside class="care-note"><p>This form isn't monitored around the clock. If you're in immediate danger or thinking about suicide or self-harm, please contact a local crisis line or emergency services right now: <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free, confidential helpline in your country</a>.</p></aside>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Share your rebuild", "/share")])]
    return layout("/share", "Share your rebuild · DYEGU", "Tell DYEGU your comeback story privately, in the middle of it or on the other side.", body, ld=ld)


CARE = f"""<aside class="care-note"><p><strong>Not for emergencies.</strong> Circles and sessions are peer support and general guidance, not therapy, medical care, or legal or financial advice for your individual case. If you're in danger or thinking about suicide or self-harm, contact a local crisis line or emergency services now: <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>"""


def checks(name: str, items: list[tuple[str, str]], form_id: str | None = None) -> str:
    fa = f' form="{form_id}"' if form_id else ""
    return '<div class="check-grid">' + "".join(
        f'<label class="check"><input type="checkbox" name="{name}" value="{k}"{fa}> {e(t)}</label>'
        for k, t in items
    ) + "</div>"


def page_community():
    safety_cards = "".join(
        f'<div class="safety-card"><h4>{e(t)}</h4><p>{e(d)}</p></div>'
        for t, d in CIRCLE_SAFETY_PROMISES
    )
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow center">
    <p class="eyebrow">DYEGU Community · Always $0</p>
    <h1 class="display-sm">Nobody should rebuild in silence.</h1>
    <p class="lede">Stories show it can be done. Community is where you breathe alongside ordinary people walking the same chapter — plus vetted experts giving practical guidance completely free.</p>
  </div>
</section>
<section class="section-tight band-warm">
  <div class="wrap">
    <div class="cohort-strip">
      <span><strong>Cohort 01 opens Q1 2027</strong> · Matched by stage across WAT, GMT, CET &amp; EST</span>
      <span><strong>100% free</strong> · Zero pitching or selling, strictly enforced</span>
    </div>
    <div class="doors">
      <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h2 class="h3">Rebuild Circles</h2><p>Six to eight people at the same stage meet online once a week for six weeks, with a trained volunteer host. One story, one move, and real accountability.</p><span class="link-gold">Step into a circle →</span></a>
      <a class="door" href="/community/sessions"><p class="eyebrow">Expert help</p><h2 class="h3">Free Rebuild Sessions</h2><p>Live group sessions with vetted volunteer experts: recruiters, accountants, lawyers, founders and counsellors. Practical Q&amp;A at zero cost.</p><span class="link-gold">Request a topic →</span></a>
      <a class="door" href="/volunteer"><p class="eyebrow">Walk beside others</p><h2 class="h3">Volunteer an hour</h2><p>Share practical experience for one hour a month with someone rebuilding after job loss, business failure, divorce, illness or grief.</p><span class="link-gold">Apply to volunteer →</span></a>
    </div>
    <div class="safety-grid">{safety_cards}</div>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap narrow">
    <p class="eyebrow eyebrow-rule">How it opens</p>
    <h2 class="h3">Calm, vetted, and built for safety</h2>
    <ol class="axis-timeline">
      <li><span class="axis-time">Step 01</span><h3 class="axis-title">Join the list for your chapter</h3><p class="axis-desc">Circles are matched by life stage and time zone band. Sessions are scheduled around the topics requested most.</p></li>
      <li><span class="axis-time">Step 02</span><h3 class="axis-title">Every volunteer is vetted by hand</h3><p class="axis-desc">Identity, experience and regulated licences are verified before anyone hosts. Everyone signs our <a class="link-gold" href="/community/guidelines">community guidelines</a>.</p></li>
      <li><span class="axis-time">Step 03</span><h3 class="axis-title">Cohort 01 launches early 2027</h3><p class="axis-desc">Each circle opens as soon as 6–8 peers in the same chapter and time zone band are ready. You'll receive a quiet email invite.</p></li>
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
    safety_cards = "".join(
        f'<div class="safety-card"><h4>{e(t)}</h4><p>{e(d)}</p></div>'
        for t, d in CIRCLE_SAFETY_PROMISES
    )
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Peer support</p>
    <h1 class="display-sm">Rebuild Circles</h1>
    <p class="lede">Six to eight ordinary people at the exact same stage of a setback, meeting online once a week for six weeks. Confidential, zero-pressure, and always $0.</p>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap narrow">
    <div class="facts">
      <div><span class="num">6–8</span><p>peers matched by stage &amp; time zone</p></div>
      <div><span class="num">6</span><p>weekly video calls, 60 minutes each</p></div>
      <div><span class="num">$0</span><p>always free, zero pitching</p></div>
    </div>
    <p class="eyebrow eyebrow-rule">What it actually feels like</p>
    <h2 class="h3">Zero awkwardness, zero forced sharing</h2>
    <div class="safety-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:36px">{safety_cards}</div>
    <p class="eyebrow eyebrow-rule">Six-week roadmap</p>
    <h2 class="h3">How the six weeks unfold</h2>
    <ol class="axis-timeline">{weeks_html}</ol>
    {CARE}
  </div>
</section>
<section class="section band-warm" id="join-circle">
  <div class="wrap narrow">
    <h2 class="h2">Step into a circle</h2>
    <p class="muted">We'll send a quiet invite as soon as a 6–8 person cohort for your chapter and time zone is ready.</p>
    {community_form('circle', 'Step into the circle list', "You're on the list. We'll email you as soon as a circle for your chapter and time zone opens.")}
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
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Practical guidance</p>
    <h1 class="display-sm">Free Rebuild Sessions</h1>
    <p class="lede">Live online sessions where a vetted volunteer expert walks through one practical topic and answers open questions. Free for anyone starting over.</p>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap narrow">
    <h2 class="h3">Topics we're scheduling first</h2>
    <ul class="topic-list">{topics}</ul>
    <p class="muted">Sessions provide practical general guidance for the room. Volunteers never charge, pitch, or solicit clients.</p>
    {CARE}
  </div>
</section>
<section class="section band-warm">
  <div class="wrap narrow">
    <h2 class="h2">Vote for the sessions you need</h2>
    <p class="muted">The topics with the highest demand go on the Q1 2027 calendar first. You'll receive a free invite for everything you tick.</p>
    {community_form('session', 'Request free sessions', "Thank you. We'll invite you as soon as sessions on your topics are scheduled.", topics=True)}
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community"), ("Free Sessions", "/community/sessions")])]
    return layout(
        "/community/sessions",
        "Free Rebuild Sessions with volunteer experts · DYEGU",
        "Free live sessions with volunteer recruiters, accountants, lawyers, founders and counsellors for people rebuilding after a setback.",
        body,
        og_file="community.jpg",
        ld=ld,
    )


def page_volunteer():
    u = uid()
    stage_checks = checks("stages", [(s["key"], s["short"]) for s in STAGES])
    body = f"""
<section class="page-hero band-dark">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Volunteer Charter</p>
    <h1 class="display-sm">Give an hour to someone starting over.</h1>
    <p class="lede">You've spent years learning what most people only discover the hard way. Offer one focused hour a month, free, to people rebuilding after job loss, business failure, divorce, illness or grief.</p>
  </div>
</section>
<section class="section-tight band-light">
  <div class="wrap">
    <div class="pillars">
      <article><span class="num">I</span><h3>Lead a session</h3><p>45 minutes on one practical subject, then Q&amp;A. We handle scheduling, hosting, moderation and audience.</p></article>
      <article><span class="num">II</span><h3>Host a circle</h3><p>Six weekly calls with 6–8 peers at the same stage. Structured facilitator guide and onboarding provided.</p></article>
      <article><span class="num">III</span><h3>Answer in writing</h3><p>Reply to a reader question for The Comeback File, credited by name and profession, monthly or quarterly.</p></article>
    </div>
    <p class="muted small" style="margin-top:20px">Approved volunteers are credited by name and profession. Pitching, selling or taking clients from sessions is strictly prohibited under our <a class="link-gold" href="/community/guidelines">guidelines</a>.</p>
  </div>
</section>
<section class="section band-warm">
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
      <p class="label">Chapters you know best</p>
      {stage_checks}
      <label for="{u}h">Time you can give</label>
      <select id="{u}h" name="hours_per_month"><option value="1/month">About an hour a month</option><option value="2-4/month">2–4 hours a month</option><option value="1/quarter">An hour a quarter</option><option value="one-off">A one-off session</option></select>
      <label for="{u}w">Why do you want to volunteer? (optional)</label>
      <textarea id="{u}w" name="why" rows="4" maxlength="2000"></textarea>

      <p class="form-step-title">04 · Volunteer charter</p>
      <input type="hidden" name="timezone" data-tz>
      <label class="check"><input type="checkbox" name="agreed_code" required> I've read and agree to the <a href="/community/guidelines" target="_blank">volunteer code</a>: no selling or soliciting, general guidance only, confidentiality, and escalating anyone at risk.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Offer an hour</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    ld = [breadcrumb_ld([("Home", "/"), ("Community", "/community"), ("Volunteer", "/volunteer")])]
    return layout(
        "/volunteer",
        "Volunteer as an expert · DYEGU Community",
        "Give an hour a month to people rebuilding after a setback. Lead a free session, host a circle or answer reader questions.",
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
<p>This page explains what DYEGU's website collects, why, and what you can ask us to do with it.</p>
<h2>What we collect</h2>
<ul>
<li><strong>Your email address</strong> when you join The Comeback File, The Rebuild Playbook waitlist or the shop drop list, with the list you joined, the chapter you chose (if any), the products you ticked, the page you signed up on and the campaign link you arrived from.</li>
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
<p>DYEGU is an independent documentary house and free rebuilding community. Every story is primary-sourced and audited before narration — making it a calm, brand-safe environment for long-term partners.</p>
<p>Our first audience media kit, with verified Season 1 performance metrics, follows the opening quarter (early 2027). Until then we welcome conversations with founding launch partners.</p>
<p><a class="btn btn-gold" href="/speaking#enquire">Start a conversation</a></p>
<h2>What partners can expect</h2>
<ul><li>Clearly labelled integrations, disclosed on screen and in YouTube's paid-promotion setting.</li><li>Zero unverified claims — about your product or anyone else.</li><li>Zero pitching or commercial intrusion inside our free peer community.</li></ul>"""


def simple(path: str, title: str, desc: str, inner: str, noindex: bool = False, band: bool = True, reading_bar: bool = False):
    return layout(
        path,
        title,
        desc,
        f'<section class="page band-light"><div class="wrap narrow">{inner}</div></section>',
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
        write("studio/index.html", simple("/studio", "Sponsors & partners · DYEGU", "Partner with DYEGU, the documented comeback series.", STUDIO)),
        write("404.html", simple("/404", "Not found · DYEGU", "Page not found.", '<h1>Lost the thread?</h1><p>This page doesn\'t exist, but your story isn\'t over. <a href="/">Back to DYEGU</a> or <a href="/#start">start where you are today</a>.</p>', noindex=True)),
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
