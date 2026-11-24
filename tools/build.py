#!/usr/bin/env python3
"""Builds every HTML page of dyegu.co from tools/content.py + content/sources.json.
Run from the repo root:  python3 tools/build.py   (then commit and push; Vercel deploys)."""
import json, html, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from content import SITE, YOUTUBE, SUPPORT_URL, STORIES, STAGES, PRODUCTS, SESSION_TOPICS, VOLUNTEER_FORMATS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = json.load(open(os.path.join(ROOT, "content", "sources.json")))
STAGE = {s["key"]: s for s in STAGES}
e = html.escape

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">')

NAV = [("/#start", "Find your story"), ("/stories", "Stories"), ("/community", "Community"),
       ("/playbook", "Playbook"), ("/shop", "Shop"), ("/speaking", "Speaking")]


def layout(path, title, desc, body, join_band=True, noindex=False):
    url = SITE + (path if path != "/" else "/")
    nav = "".join(f'<a href="{h}"{" aria-current=page" if h == path else ""}>{t}</a>' for h, t in NAV)
    band = join_form_band(path) if join_band else ""
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
<meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
{FONTS}
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/" aria-label="DYEGU home"><img src="/assets/dyegu-wordmark-sm.webp" alt="DYEGU" width="560" height="139"></a>
    <nav class="nav" aria-label="Main">{nav}</nav>
    <a class="btn btn-gold btn-sm header-cta" href="#join">Join free</a>
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
    return (f'<label for="f-{name}-{{uid}}">{label}</label>'
            f'<select id="f-{name}-{{uid}}" name="{name}"{" required" if required else ""}><option value="">Choose one</option>{opts}</select>')


_uid = [0]
def uid():
    _uid[0] += 1
    return f"u{_uid[0]}"


def signup_form(list_="comeback_file", button="Subscribe free", stage=None, fine="Free. One email a week. Unsubscribe anytime.",
                success=None, ask_stage=False, center=False, extra=""):
    u = uid()
    attrs = f'data-table="subscribers" data-list="{list_}"'
    if stage: attrs += f' data-stage="{stage}"'
    if success: attrs += f' data-success="{e(success)}"'
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


def join_form_band(path):
    stage = path.split("/start/")[1] if path.startswith("/start/") else None
    return f"""<section class="join-band" id="join">
  <div class="wrap join-grid">
    <div>
      <p class="eyebrow">The Comeback File · free, weekly</p>
      <h2 class="h3">One story. One lesson. One move for your week.</h2>
      <p class="muted">From Sir K, every week. Subscribers also get the Rebuild Playbook first, at the early price.</p>
    </div>
    {signup_form(stage=stage, ask_stage=not stage)}
  </div>
</section>"""


def story_card(s, compact=False):
    live = s.get("live_page")
    tag = "a" if live else "div"
    href = f' href="/stories/{s["slug"]}"' if live else ""
    return f"""<{tag} class="ep{' ep-soon' if not live else ''}"{href} data-date="{s['date']}">
  <span class="ep-no">{s['no']}</span>
  <h3 class="ep-subject">{e(s['subject'])}</h3>
  <p class="ep-tease">{e(s['fall'])}{(' ' + e(s['rise'])) if s.get('rise') and not compact else ''}</p>
  <p class="ep-when"></p>
</{tag}>"""


def stage_tiles():
    return "".join(f'<a class="stage-tile" href="/start/{s["key"]}"><span>{e(s["short"])}</span><span class="arrow" aria-hidden="true">→</span></a>' for s in STAGES)


def premiere_card():
    return """<div class="premiere-card" id="premiere">
  <img class="premiere-mark" src="/assets/phoenix.svg" alt="" width="120" height="138">
  <p class="eyebrow">Episode 01 premieres</p>
  <p class="premiere-date">Sunday 6 December 2026</p>
  <p class="premiere-time" data-premiere-time>15:00 WAT · 14:00 GMT · 09:00 ET</p>
  <div class="countdown" data-countdown aria-label="Time until premiere">
    <div><span data-u="d">--</span><small>days</small></div>
    <div><span data-u="h">--</span><small>hours</small></div>
    <div><span data-u="m">--</span><small>min</small></div>
  </div>
  <a class="btn btn-ghost" href="%s?sub_confirmation=1" rel="noopener" target="_blank">Subscribe on YouTube</a>
</div>""" % YOUTUBE


# ------------------------------------------------------------------ pages
def page_home():
    live = [s for s in STORIES if s.get("live_page")]
    body = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">True comeback stories · presented by Sir K</p>
      <h1 class="display">Don't you ever<br><em>give up.</em></h1>
      <p class="lede">Lost your job, your business, your health, your marriage or your way? You're not the first, and you won't be the last to rebuild. Every Sunday, Sir K tells the documented story of someone who lost it all and came back, and what you can take from it.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="#start">Find the story for where you are</a>
        <a class="btn btn-ghost" href="#join">Get the weekly Comeback File</a>
      </div>
    </div>
    <div class="hero-media" data-latest>{premiere_card()}</div>
  </div>
</section>

<section class="section" id="start">
  <div class="wrap">
    <p class="eyebrow">Start here</p>
    <h2 class="h2">Where are you right now?</h2>
    <p class="lede">Pick the one closest to your life today. You'll get the stories that match it and three moves you can make this week.</p>
    <div class="stage-grid">{stage_tiles()}</div>
  </div>
</section>

<section class="section section-alt" id="standard">
  <div class="wrap">
    <p class="eyebrow">The DYEGU standard</p>
    <h2 class="h2">Comebacks you can check.</h2>
    <div class="pillars">
      <article><span class="num">I</span><h3>Real people</h3><p>Names you know. People who held real status, health, money or fame, lost it in public, and climbed back.</p></article>
      <article><span class="num">II</span><h3>Documented facts</h3><p>Every claim is checked before it's narrated, and every source is published on the story's page so you can read it yourself.</p></article>
      <article><span class="num">III</span><h3>No invention</h3><p>No made-up inner thoughts, no guessed net worths, no dramatised quotes. The truth is dramatic enough.</p></article>
    </div>
  </div>
</section>

<section class="section" id="episodes">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow">Season 1 · every Sunday</p><h2 class="h2">The first three stories</h2></div>
      <a class="link-gold" href="/stories">The whole season →</a>
    </div>
    <div class="episodes" data-episodes>{''.join(story_card(s) for s in live)}</div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap offer-grid">
    <a class="offer offer-link" href="/playbook">
      <p class="eyebrow">Coming January 2027 · $19</p>
      <h2 class="h3">The Rebuild Playbook</h2>
      <p>The patterns behind every comeback in Season 1, turned into a workbook for your own. Subscribers get it first, at the early price.</p>
      <span class="link-gold">See what's inside →</span>
    </a>
    <a class="offer offer-link offer-shop" href="/shop">
      <img src="/assets/products/mug.svg" alt="" width="460" height="440" loading="lazy">
      <div>
        <p class="eyebrow">Drop 01 · Rise</p>
        <h2 class="h3">Wear the reminder</h2>
        <p>The studio mug, the Rise tee and hoodie, the phoenix cap. Join the drop list for first access.</p>
        <span class="link-gold">See the drop →</span>
      </div>
    </a>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><div><p class="eyebrow">DYEGU Community · free</p><h2 class="h2">Nobody rebuilds alone.</h2></div><a class="link-gold" href="/community">How the community works →</a></div>
    <div class="doors">
      <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h3 class="h3">Rebuild Circles</h3><p>Six weeks with six to eight people at your stage, hosted by a trained volunteer.</p><span class="link-gold">Join a circle →</span></a>
      <a class="door" href="/community/sessions"><p class="eyebrow">Expert help</p><h3 class="h3">Free expert sessions</h3><p>Recruiters, accountants, lawyers and founders giving practical guidance, free.</p><span class="link-gold">Request a session →</span></a>
      <a class="door" href="/volunteer"><p class="eyebrow">Give back</p><h3 class="h3">Volunteer as an expert</h3><p>Give an hour a month to someone starting over.</p><span class="link-gold">Apply →</span></a>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap share-strip">
    <div>
      <p class="eyebrow">Your story matters too</p>
      <h2 class="h2">Tell us your rebuild.</h2>
      <p class="lede">Halfway through it or on the other side, we want to hear it. With your permission, some stories will be shared in the Comeback File, and may one day become an episode.</p>
    </div>
    <a class="btn btn-gold" href="/share">Share your story</a>
  </div>
</section>

<section class="section" id="host">
  <div class="wrap host">
    <img class="host-mark" src="/assets/phoenix.svg" alt="" width="160" height="184">
    <div>
      <p class="eyebrow">Your host</p>
      <h2 class="h2">Sir K</h2>
      <p class="lede">Sir K has spent more than twenty years building companies, teams and technology across Africa and beyond, and has had to rebuild more than once. DYEGU is the series he wanted when things went wrong: real people, real setbacks, and the honest work of coming back.</p>
      <p class="signoff">“Until the next story… don't you ever give up.”</p>
      <p><a class="link-gold" href="/about">More about Sir K and how DYEGU is made →</a> &nbsp; <a class="link-gold" href="/speaking">Book Sir K to speak →</a></p>
    </div>
  </div>
</section>
"""
    return layout("/", "DYEGU — Don't You Ever Give Up · True comeback stories with Sir K",
                  "Lost your job, business, health, marriage or way? True, documented stories of people who lost it all and rebuilt, told by Sir K every Sunday, plus moves for your own comeback.", body)


def page_stage(s):
    stories = [x for x in STORIES if s["key"] in x["stages"]]
    moves = "".join(f'<li><h3>{e(t)}</h3><p>{e(d)}</p></li>' for t, d in s["moves"])
    others = "".join(f'<a href="/start/{o["key"]}">{e(o["short"])}</a>' for o in STAGES if o["key"] != s["key"])
    support = f"""<aside class="care-note"><p><strong>If it's more than a setback right now:</strong> please talk to a doctor, a counsellor or someone you trust. If you're thinking about suicide or self-harm, contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>""" if s.get("sensitive") else ""
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/#start">Where are you right now?</a> · {e(s['short'])}</p>
    <h1 class="display-sm">{e(s['title'])}</h1>
    <p class="lede">{e(s['lede'])}</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Three moves for this week</h2>
    <ol class="moves">{moves}</ol>
    {support}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">Stories for where you are</p>
    <h2 class="h2">They've been here.</h2>
    <div class="episodes" data-episodes>{''.join(story_card(x, compact=True) for x in stories)}</div>
  </div>
</section>
<section class="section">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">{e(s["short"])}</p>
    <h2 class="h2">Get one story and one move a week, picked for where you are.</h2>
    {signup_form(stage=s['key'], button="Send me the Comeback File", center=True, success="You're in. Your first Comeback File arrives with Episode 01. Until then, start with move one above.")}
  </div>
</section>
<section class="section-tight section-alt">
  <div class="wrap">
    <p class="eyebrow">Somewhere else?</p>
    <div class="chip-row">{others}</div>
  </div>
</section>
"""
    return layout(f"/start/{s['key']}", f"{s['title']} — stories and moves for your comeback · DYEGU",
                  s["lede"], body, join_band=False)


def page_stories():
    body = f"""
<section class="page-hero">
  <div class="wrap">
    <p class="eyebrow">Season 1 · Sundays, 6 December 2026 – 7 March 2027</p>
    <h1 class="display-sm">Stories</h1>
    <p class="lede">Every episode follows one person who had it, lost it and rebuilt. Each story page publishes the sources behind it.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap"><div class="episodes" data-episodes>{''.join(story_card(s) for s in STORIES)}</div>
  <p class="muted small">More stories are announced each week. <a class="link-gold" href="#join">Get them in the Comeback File →</a></p></div>
</section>"""
    return layout("/stories", "Stories — Season 1 · DYEGU", "Documented comeback stories, one every Sunday: Steve Jobs, J.K. Rowling, Tyler Perry and more.", body)


def page_story(i, s):
    src = SOURCES.get(s["slug"], {"sources": [], "verified_claims": 0})
    items = "".join(f'<li><a href="{e(x["url"])}" rel="noopener nofollow" target="_blank">{e(x["label"])}</a></li>' for x in src["sources"])
    nxt = next((x for x in STORIES[i + 1:] if x.get("live_page")), None)
    stage_links = "".join(f'<a href="/start/{k}">{e(STAGE[k]["short"])}</a>' for k in s["stages"])
    body = f"""
<section class="page-hero">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow">Episode {s['no']} · <span data-when="{s['date']}"></span></p>
      <h1 class="display-sm">{e(s['subject'])}</h1>
      <p class="lede">{e(s['synopsis'])}</p>
    </div>
    <div class="story-media" data-video="{e(s.get('youtube_id', ''))}" data-date="{s['date']}">{premiere_card().replace('Episode 01 premieres', f'Episode {s["no"]} premieres').replace('Sunday 6 December 2026', '<span data-when-long="' + s['date'] + '"></span>')}</div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">If this is where you are</h2>
    <div class="chip-row">{stage_links}</div>
  </div>
</section>
<section class="section-tight section-alt">
  <div class="wrap narrow">
    <p class="eyebrow">How we checked this story</p>
    <h2 class="h3">{src['verified_claims']} claims checked against {len(src['sources'])} sources</h2>
    <p class="muted">Every fact in the episode was checked against a primary record or two independent reputable reports, or is clearly attributed as the person's own account. Anything we couldn't confirm was left out.</p>
    <details class="sources"><summary>See all sources</summary><ul>{items}</ul></details>
  </div>
</section>
{f'''<section class="section-tight"><div class="wrap narrow"><p class="eyebrow">Next story</p><a class="link-gold big" href="/stories/{nxt['slug']}">Episode {nxt['no']}: {e(nxt['subject'])} →</a></div></section>''' if nxt else ''}
"""
    return layout(f"/stories/{s['slug']}", f"{s['subject']} — a documented comeback · DYEGU Episode {s['no']}", s["synopsis"][:155], body)


def page_shop():
    cards = "".join(f"""<label class="product">
  <img src="/assets/products/{p['key']}.svg" alt="{e(p['name'])}, illustrative mockup" width="460" height="440" loading="lazy">
  <h3>{e(p['name'])}</h3><p>{e(p['note'])}</p>
  <span class="want"><input type="checkbox" name="interest" value="{p['key']}" form="drop-form"> I'd want this</span>
</label>""" for p in PRODUCTS)
    body = f"""
<section class="page-hero">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">DYEGU Shop · Drop 01</p>
    <h1 class="display-sm">Rise</h1>
    <p class="lede">A few things worth keeping close on the hard days. Black, gold, the phoenix and the words. Made in small runs, never discounted.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="products">{cards}</div>
    <p class="muted small center">Illustrative mockups. Final products may differ.</p>
  </div>
</section>
<section class="section section-alt" id="drop">
  <div class="wrap narrow center">
    <p class="eyebrow">Not on sale yet</p>
    <h2 class="h2">Join the drop list.</h2>
    <p class="lede">We're matching the gold on real samples before anything ships. Tick what you'd want above, leave your email, and you'll get first access and the launch date before anyone else.</p>
    {signup_form(list_='merch_waitlist', button='Join the drop list', center=True, fine='One email when Drop 01 opens. Nothing else unless you subscribe.', success="You're on the drop list. You'll hear first when Rise opens.").replace('<form ', '<form id="drop-form" ', 1)}
  </div>
</section>"""
    return layout("/shop", "Shop — Drop 01: Rise · DYEGU", "The DYEGU studio mug, Rise tee and hoodie, phoenix cap and Rebuild Journal. Join the drop list for first access.", body)


def page_playbook():
    chapters = ["Name the fall: what actually happened, without the story you've been telling yourself",
                "Stop the bleeding: the first two weeks after a setback",
                "Count what you still have: skills, people, proof and time",
                "The first thirty days: small moves that rebuild momentum",
                "The long middle: how the people in Season 1 kept going when nothing was working",
                "Building proof: getting others to believe in you again",
                "Your own DYEGU rule: the sentence you'll carry forward"]
    tags = "".join(f'<a href="/start/{s["key"]}">{e(s["short"])}</a>' for s in STAGES)
    body = f"""
<section class="page-hero">
  <div class="wrap story-grid">
    <div>
      <p class="eyebrow">Coming January 2027</p>
      <h1 class="display-sm">The Rebuild Playbook</h1>
      <p class="lede">The patterns behind every comeback in Season 1, turned into a practical workbook for your own. Read it in an evening. Work through it over a month.</p>
      <p class="price-line"><span class="price-big">$19</span> <span class="muted">· digital workbook · early price for subscribers</span></p>
      <a class="btn btn-gold" href="#waitlist">Join the waitlist</a>
    </div>
    <div class="book-mock"><img src="/assets/products/journal.svg" alt="" width="460" height="440"></div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">What's inside (planned)</h2>
    <ol class="chapters">{''.join(f'<li>{e(c)}</li>' for c in chapters)}</ol>
    <p class="muted">Each chapter ends with a worksheet. The examples come from the documented stories, with sources.</p>
  </div>
</section>
<section class="section-tight section-alt">
  <div class="wrap narrow">
    <h2 class="h3">Who it's for</h2>
    <p class="muted">Anyone in the middle of a rebuild:</p>
    <div class="chip-row">{tags}</div>
  </div>
</section>
<section class="section" id="waitlist">
  <div class="wrap narrow center">
    <h2 class="h2">Get it first, at the early price.</h2>
    {signup_form(list_='playbook_waitlist', button='Join the waitlist', ask_stage=True, center=True, fine="We'll email you when it launches, with the early price.", success="You're on the waitlist. We'll email you at launch with the early price.")}
  </div>
</section>"""
    return layout("/playbook", "The Rebuild Playbook — $19 · DYEGU", "A practical workbook built from Season 1's documented comebacks. Join the waitlist for the early price.", body)


def page_speaking():
    u = uid()
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow">Talks &amp; workshops</p>
    <h1 class="display-sm">Bring Sir K to your people.</h1>
    <p class="lede">Keynotes and workshops on setbacks, resilience and rebuilding, grounded in documented comebacks and twenty years of building companies and teams.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="pillars">
      <article><span class="num">I</span><h3>The Comeback Pattern</h3><p>What every rebuild in Season 1 has in common, and how people and teams can use it. For conferences, schools and communities.</p></article>
      <article><span class="num">II</span><h3>Rebuilding after a setback</h3><p>For organisations after layoffs, a failed launch or a hard year. Practical, honest, no motivational fog.</p></article>
      <article><span class="num">III</span><h3>Systems that survive failure</h3><p>For founders and leaders: building companies and teams that can take a hit and keep going.</p></article>
    </div>
    <p class="muted small">Formats: keynote (30–60 min) · half-day workshop · fireside or panel · virtual sessions.</p>
  </div>
</section>
<section class="section section-alt" id="enquire">
  <div class="wrap narrow">
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
      <textarea id="{u}m" name="message" rows="5" required maxlength="4000" placeholder="What you have in mind"></textarea>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send enquiry</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    return layout("/speaking", "Book Sir K — talks and workshops · DYEGU", "Keynotes and workshops on setbacks, resilience and rebuilding with Sir K, host of DYEGU.", body)


def page_about():
    body = f"""
<section class="page-hero">
  <div class="wrap host">
    <img class="host-mark" src="/assets/phoenix.svg" alt="" width="160" height="184">
    <div>
      <p class="eyebrow">About</p>
      <h1 class="display-sm">Sir K, and why DYEGU exists</h1>
      <p class="lede">Sir K has spent more than twenty years building companies, teams and technology across Africa and beyond, and has had to rebuild more than once. When things went wrong, what helped most wasn't advice. It was knowing that someone else had been somewhere worse and found a way back.</p>
      <p class="lede">DYEGU, short for Don't You Ever Give Up, is that reminder, made carefully: real people, real setbacks, documented facts, and the honest work of coming back.</p>
    </div>
  </div>
</section>
<section class="section-tight section-alt">
  <div class="wrap narrow">
    <h2 class="h3">How each story is made</h2>
    <ol class="moves">
      <li><h3>Research</h3><p>Every claim goes into a claims file with its source: primary records first, then reputable reporting, then the person's own words, clearly attributed.</p></li>
      <li><h3>Check</h3><p>Anything that can't be confirmed is held back. Sensitive subjects follow strict rules: no invented details, no graphic reconstruction, the comeback in the title, not the wound.</p></li>
      <li><h3>Tell</h3><p>Sir K presents and narrates every episode himself. Research is done with AI assistance and checked by people against the sources, which are published on each story's page.</p></li>
    </ol>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Get in touch</h2>
    <p class="muted">Talks, workshops, sponsorship or press: <a class="link-gold" href="/speaking#enquire">use the enquiry form</a>. Your own story: <a class="link-gold" href="/share">share your rebuild</a>.</p>
  </div>
</section>"""
    return layout("/about", "About Sir K and DYEGU", "Who Sir K is, why DYEGU exists, and how every comeback story is researched and checked.", body)


def page_share():
    u = uid()
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow">Share your rebuild</p>
    <h1 class="display-sm">Tell us where you are.</h1>
    <p class="lede">In the middle of it or out the other side: we read every story. With your permission, some will be shared in the Comeback File, and some may one day become an episode.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <form class="js-form share" data-table="rebuilds" data-success="Thank you for trusting us with your story. We read every one." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">First name (optional)</label><input id="{u}n" name="first_name" autocomplete="given-name" maxlength="60"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      {stage_select(label="Which is closest to your story?").replace("{uid}", u)}
      <label for="{u}s">Your story</label>
      <textarea id="{u}s" name="story" rows="9" required minlength="20" maxlength="6000" placeholder="What happened, where you are now, what's helping. Please leave out details that identify other people."></textarea>
      <label class="check"><input type="checkbox" name="consent_contact"> You can email me about my story.</label>
      <label class="check"><input type="checkbox" name="consent_feature"> You can share my story in the Comeback File or on DYEGU, using my first name only. I'll be asked again before anything is published.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send my story</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
    <aside class="care-note"><p>This form isn't monitored around the clock. If you're in danger or thinking about suicide or self-harm, please contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>
  </div>
</section>"""
    return layout("/share", "Share your rebuild · DYEGU", "Tell DYEGU your comeback story, in the middle of it or on the other side.", body)


CARE = f"""<aside class="care-note"><p><strong>Not for emergencies.</strong> Circles and sessions are peer support and general guidance, not therapy, medical care, or legal or financial advice for your situation. If you're in danger or thinking about suicide or self-harm, contact a local crisis line or emergency services now. <a href="{SUPPORT_URL}" target="_blank" rel="noopener">Find a free helpline in your country</a>.</p></aside>"""


def checks(name, items, form_id=None):
    fa = f' form="{form_id}"' if form_id else ""
    return '<div class="check-grid">' + "".join(f'<label class="check"><input type="checkbox" name="{name}" value="{k}"{fa}> {e(t)}</label>' for k, t in items) + '</div>'


def page_community():
    body = f"""
<section class="page-hero">
  <div class="wrap narrow center">
    <img class="mark-sm" src="/assets/phoenix.svg" alt="" width="56" height="64">
    <p class="eyebrow">DYEGU Community · free</p>
    <h1 class="display-sm">Nobody rebuilds alone.</h1>
    <p class="lede">The stories show it can be done. The community is where you do it: with people at the same stage, and with experts who give their time for free.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap doors">
    <a class="door" href="/community/circles"><p class="eyebrow">Peer support</p><h2 class="h3">Rebuild Circles</h2><p>Six to eight people at the same stage meet online once a week for six weeks, with a trained volunteer host. One story, one move, and people who notice whether you made it.</p><span class="link-gold">Join a circle →</span></a>
    <a class="door" href="/community/sessions"><p class="eyebrow">Expert help</p><h2 class="h3">Free Rebuild Sessions</h2><p>Live group sessions with volunteer experts: recruiters, accountants, lawyers, founders, coaches. Practical guidance and open Q&amp;A, at no cost.</p><span class="link-gold">Request a session →</span></a>
    <a class="door" href="/volunteer"><p class="eyebrow">Give back</p><h2 class="h3">Volunteer your expertise</h2><p>Consultants and professionals: give an hour a month to someone starting over. Lead a session, host a circle or answer reader questions.</p><span class="link-gold">Apply to volunteer →</span></a>
  </div>
</section>
<section class="section-tight section-alt">
  <div class="wrap narrow">
    <h2 class="h3">How it opens</h2>
    <ol class="moves">
      <li><h3>Join the list for what you need</h3><p>Circles are matched by stage and time zone. Sessions are scheduled around the topics most people ask for.</p></li>
      <li><h3>We vet every volunteer</h3><p>Identity, experience and, for regulated professions, licences are checked before anyone hosts. Everyone agrees to the <a class="link-gold" href="/community/guidelines">community guidelines</a>.</p></li>
      <li><h3>First circles and sessions start in early 2027</h3><p>The first circle for a stage opens when enough people in the same time zone have joined. You'll be invited by email.</p></li>
    </ol>
    {CARE}
  </div>
</section>"""
    return layout("/community", "Community — Rebuild Circles, free expert sessions, volunteers · DYEGU", "Free peer support circles and expert sessions for people rebuilding after a setback, hosted by vetted volunteers.", body)


def community_form(kind, button, success, topics=False):
    u = uid()
    return f"""<form class="js-form community" id="{u}" data-table="community_requests" data-kind="{kind}" data-success="{e(success)}" novalidate>
  <div class="grid-2">
    <div><label for="{u}n">First name (optional)</label><input id="{u}n" name="first_name" autocomplete="given-name" maxlength="60"></div>
    <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
  </div>
  {stage_select(label="Which is closest to where you are?", required=(kind == 'circle')).replace("{uid}", u)}
  {('<p class="label">Topics you want help with</p>' + checks('topics', SESSION_TOPICS)) if topics else ''}
  <label for="{u}x">Anything we should know? (optional)</label>
  <textarea id="{u}x" name="note" rows="3" maxlength="1500" placeholder="Please don't include medical or legal details here."></textarea>
  <input type="hidden" name="timezone" data-tz>
  <label class="check"><input type="checkbox" name="agreed_terms" required> I've read the <a href="/community/guidelines" target="_blank">community guidelines</a> and understand this is peer support and general guidance, not professional advice or emergency help.</label>
  <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
  <button class="btn btn-gold" type="submit">{button}</button>
  <p class="form-msg" role="status" aria-live="polite"></p>
</form>"""


def page_circles():
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Peer support</p>
    <h1 class="display-sm">Rebuild Circles</h1>
    <p class="lede">A small group of people at the same stage of a setback, meeting online once a week for six weeks. Free, hosted by a trained volunteer.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <div class="facts">
      <div><span class="num">6–8</span><p>people, matched by stage and time zone</p></div>
      <div><span class="num">6</span><p>weekly video calls, 60 minutes each</p></div>
      <div><span class="num">$0</span><p>always free</p></div>
    </div>
    <h2 class="h3">What happens in a circle</h2>
    <ol class="moves">
      <li><h3>Check in</h3><p>Where you are this week, in a few sentences. No one has to share more than they want to.</p></li>
      <li><h3>One story</h3><p>A short comeback story from the series or from someone in the room, and what it says about your week.</p></li>
      <li><h3>One move</h3><p>Everyone picks one small action. Next week the group asks how it went. That's the accountability.</p></li>
    </ol>
    {CARE}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2 class="h2">Join the circle list</h2>
    <p class="muted">We'll invite you when a circle for your stage and time zone is ready.</p>
    {community_form('circle', 'Join the circle list', "You're on the list. We'll email you when a circle for your stage and time zone is ready.")}
  </div>
</section>"""
    return layout("/community/circles", "Rebuild Circles — free peer support groups · DYEGU", "Six weeks, six to eight people at the same stage, one trained volunteer host. Free peer support for rebuilding after a setback.", body)


def page_sessions():
    topics = "".join(f'<li>{e(t)}</li>' for _, t in SESSION_TOPICS)
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · Expert help</p>
    <h1 class="display-sm">Free Rebuild Sessions</h1>
    <p class="lede">Live online sessions where a volunteer expert walks through one practical topic and answers questions. Free, open to anyone rebuilding.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap narrow">
    <h2 class="h3">Topics we're lining up</h2>
    <ul class="topic-list">{topics}</ul>
    <p class="muted">Sessions give general guidance for everyone in the room. Volunteers won't advise on your individual case in a session and never charge, sell or ask for payment.</p>
    {CARE}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2 class="h2">Tell us what would help</h2>
    <p class="muted">The topics with the most requests are scheduled first. You'll get an invite for anything you ticked.</p>
    {community_form('session', 'Request sessions', "Thank you. We'll invite you as soon as sessions on your topics are scheduled.", topics=True)}
  </div>
</section>"""
    return layout("/community/sessions", "Free Rebuild Sessions with volunteer experts · DYEGU", "Free live sessions with volunteer recruiters, accountants, lawyers, founders and coaches for people rebuilding after a setback.", body)


def page_volunteer():
    u = uid()
    stage_checks = checks("stages", [(s["key"], s["short"]) for s in STAGES])
    body = f"""
<section class="page-hero">
  <div class="wrap narrow">
    <p class="eyebrow"><a href="/community">Community</a> · For consultants and professionals</p>
    <h1 class="display-sm">Give an hour to someone starting over.</h1>
    <p class="lede">You've spent years learning what most people only find out the hard way. Give a little of it, for free, to people rebuilding after a job loss, a failed business, a divorce, a health setback or grief.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="pillars">
      <article><span class="num">I</span><h3>Lead a session</h3><p>45 minutes on one practical topic, then Q&amp;A. We handle the scheduling, the room and the audience.</p></article>
      <article><span class="num">II</span><h3>Host a circle</h3><p>Six weekly calls with six to eight people at the same stage. Short training and a host guide provided.</p></article>
      <article><span class="num">III</span><h3>Answer in writing</h3><p>Reply to a reader question for the Comeback File, credited to you, once a month or once a quarter.</p></article>
    </div>
    <p class="muted small">Volunteers are credited by name and profession on the site and in the Comeback File. Selling, pitching or taking clients from sessions isn't allowed; full rules are in the <a class="link-gold" href="/community/guidelines">guidelines</a>.</p>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2 class="h2">Apply to volunteer</h2>
    <p class="muted">We review every application by hand and check identity, experience and, for regulated professions, your licence. We'll reply within two weeks.</p>
    <form class="js-form volunteer" data-table="volunteers" data-success="Thank you. Your application is in; we'll reply within two weeks." novalidate>
      <div class="grid-2">
        <div><label for="{u}n">Full name</label><input id="{u}n" name="full_name" autocomplete="name" required maxlength="120"></div>
        <div><label for="{u}e">Email</label><input id="{u}e" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="grid-2">
        <div><label for="{u}p">Profession or expertise</label><input id="{u}p" name="profession" required maxlength="160" placeholder="e.g. Recruiter, chartered accountant, employment lawyer"></div>
        <div><label for="{u}l">LinkedIn or website</label><input id="{u}l" name="profile_url" type="url" maxlength="300" placeholder="https://"></div>
      </div>
      <label for="{u}c">Qualifications or licences (for regulated professions)</label>
      <input id="{u}c" name="credentials" maxlength="300" placeholder="Body and number, e.g. ICAN, SRA, state bar, HCPC">
      <div class="grid-2">
        <div><label for="{u}o">Country</label><input id="{u}o" name="country" autocomplete="country-name" maxlength="80"></div>
        <div><label for="{u}g">Languages</label><input id="{u}g" name="languages" maxlength="160" placeholder="English, French, Hausa…"></div>
      </div>
      <p class="label">How would you like to help?</p>
      {checks("formats", VOLUNTEER_FORMATS)}
      <p class="label">Which stages do you know best?</p>
      {stage_checks}
      <label for="{u}h">Time you can give</label>
      <select id="{u}h" name="hours_per_month"><option value="1/month">About an hour a month</option><option value="2-4/month">2–4 hours a month</option><option value="1/quarter">An hour a quarter</option><option value="one-off">A one-off session</option></select>
      <label for="{u}w">Why do you want to do this? (optional)</label>
      <textarea id="{u}w" name="why" rows="4" maxlength="2000"></textarea>
      <input type="hidden" name="timezone" data-tz>
      <label class="check"><input type="checkbox" name="agreed_code" required> I've read and agree to the <a href="/community/guidelines" target="_blank">volunteer code</a>: no selling or soliciting, general guidance only, confidentiality, and escalating anyone at risk.</label>
      <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn btn-gold" type="submit">Send application</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>"""
    return layout("/volunteer", "Volunteer as an expert · DYEGU Community", "Consultants and professionals: give an hour a month to people rebuilding after a setback. Lead a free session, host a circle or answer reader questions.", body)


GUIDELINES = """<p class="eyebrow">DYEGU Community</p>
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


def simple(path, title, desc, inner, noindex=False, band=True):
    return layout(path, title, desc, f'<section class="page"><div class="wrap narrow">{inner}</div></section>', join_band=band, noindex=noindex)


PRIVACY = """<p class="eyebrow">Last updated 24 November 2026</p>
<h1>Privacy</h1>
<p>This page explains what DYEGU's website collects, why, and what you can ask us to do with it. DYEGU is a documentary series presented by Sir K.</p>
<h2>What we collect</h2>
<ul>
<li><strong>Your email address</strong> when you join the Comeback File, the Rebuild Playbook waitlist or the shop drop list, with the list you joined, the situation you chose (if any), the products you ticked, the page you signed up on and the campaign link you arrived from.</li>
<li><strong>Your name, email, organisation and message</strong> when you send a talk, workshop, sponsorship or press enquiry.</li>
<li><strong>Your circle or session request</strong>: the stage you choose, your time zone, the topics you tick and any note, so we can match you to a circle or schedule sessions.</li>
<li><strong>Volunteer applications</strong>: name, email, profession, qualifications, profile link, country, languages and availability, so we can vet and schedule volunteers. Approved volunteers are credited by name and profession.</li>
<li><strong>Your story</strong> when you share your rebuild, with your first name if you give it and the permissions you tick. Please leave out details that identify other people.</li>
<li><strong>Anonymous visit statistics</strong> (pages viewed, country, device type) through Vercel Web Analytics, which uses no cookies.</li>
</ul>
<p>We don't use advertising cookies or tracking pixels, and we don't sell or rent your details to anyone.</p>
<h2>Why we use it</h2>
<ul>
<li>To send the emails you asked for. Every email has a one-click unsubscribe.</li>
<li>To reply to enquiries.</li>
<li>To read the stories you share and, only with your permission, feature them. We ask again before publishing anything.</li>
<li>To understand which pages help people, so we can improve them.</li>
</ul>
<p>Our legal basis is your consent for emails and stories, and our legitimate interest in answering messages and running the site.</p>
<h2>Who processes it</h2>
<p>Form submissions are stored with Supabase (database hosted in the UK). Newsletter subscribers are sent through Substack. The site is hosted by Vercel. Episodes embedded from YouTube load only when you press play, using YouTube's privacy-enhanced mode.</p>
<h2>How long we keep it</h2>
<p>List emails, circle and session requests are kept until you unsubscribe or ask us to delete them. Declined volunteer applications are deleted after six months. Enquiries are kept for up to two years. Shared stories are kept until you ask us to delete them, or for two years if not featured.</p>
<h2>Your rights</h2>
<p>You can ask to see, correct or delete your data, or withdraw consent, at any time: reply to any email we send you, or use the <a href="/speaking#enquire">enquiry form</a> and choose "Something else". We'll act within 30 days. If you're in the UK or EU and unhappy with how we've handled your data, you can complain to your data protection authority (in the UK, the ICO).</p>"""

STUDIO = """<p class="eyebrow">Sponsors &amp; partners</p>
<h1>Partner with DYEGU</h1>
<p>DYEGU is the flagship series of a growing studio of documentary channels, each with a clear audience and one named host, Sir K. Every story is sourced and checked, which makes it a safe place for a brand to stand.</p>
<p>Our first media kit, with real audience numbers, follows the opening months of Season 1 (early 2027). Until then we're happy to talk about early partnerships.</p>
<p><a class="btn btn-gold" href="/speaking#enquire">Start a conversation</a></p>
<h2>What partners can expect</h2>
<ul><li>Clearly labelled integrations, disclosed on screen and in YouTube's paid-promotion setting.</li><li>No claims we can't source, about your product or anyone else.</li><li>One accountable host and team, start to finish.</li></ul>"""


def write(rel, content):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w").write(content)
    return rel


def main():
    out = [write("index.html", page_home())]
    for s in STAGES:
        out.append(write(f"start/{s['key']}/index.html", page_stage(s)))
    out.append(write("stories/index.html", page_stories()))
    for i, s in enumerate(STORIES):
        if s.get("live_page"):
            out.append(write(f"stories/{s['slug']}/index.html", page_story(i, s)))
    out += [write("shop/index.html", page_shop()), write("playbook/index.html", page_playbook()),
            write("speaking/index.html", page_speaking()), write("about/index.html", page_about()),
            write("share/index.html", page_share()),
            write("community/index.html", page_community()), write("community/circles/index.html", page_circles()),
            write("community/sessions/index.html", page_sessions()), write("volunteer/index.html", page_volunteer()),
            write("community/guidelines/index.html", simple("/community/guidelines", "Community safety & guidelines · DYEGU", "Rules for DYEGU Rebuild Circles, free sessions and volunteers.", GUIDELINES)),
            write("privacy/index.html", simple("/privacy", "Privacy · DYEGU", "How DYEGU collects and uses your data.", PRIVACY)),
            write("studio/index.html", simple("/studio", "Sponsors & partners · DYEGU", "Partner with DYEGU, the documented comeback series presented by Sir K.", STUDIO)),
            write("404.html", simple("/404", "Not found · DYEGU", "Page not found.", '<h1>Lost the thread?</h1><p>This page doesn\'t exist, but the story isn\'t over. <a href="/">Back to DYEGU</a> or <a href="/#start">find the story for where you are</a>.</p>', noindex=True))]
    urls = ["/"] + [f"/start/{s['key']}" for s in STAGES] + ["/stories"] + [f"/stories/{s['slug']}" for s in STORIES if s.get("live_page")] + ["/community", "/community/circles", "/community/sessions", "/volunteer", "/community/guidelines", "/shop", "/playbook", "/speaking", "/about", "/share", "/studio", "/privacy"]
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    print(f"built {len(out)} pages + sitemap ({len(urls)} urls)")


if __name__ == "__main__":
    main()
