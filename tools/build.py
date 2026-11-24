#!/usr/bin/env python3
"""Builds every HTML page of dyegu.co from tools/content.py + content/sources.json.
Run from the repo root:  python3 tools/build.py   (then commit and push; Vercel deploys)."""
import json, html, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from content import SITE, YOUTUBE, SUPPORT_URL, STORIES, STAGES, PRODUCTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES = json.load(open(os.path.join(ROOT, "content", "sources.json")))
STAGE = {s["key"]: s for s in STAGES}
e = html.escape

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">')

NAV = [("/#start", "Find your story"), ("/stories", "Stories"), ("/playbook", "Playbook"),
       ("/shop", "Shop"), ("/speaking", "Speaking"), ("/about", "About")]


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
  <div class="wrap share-strip">
    <div>
      <p class="eyebrow">Your story matters too</p>
      <h2 class="h2">Tell us your rebuild.</h2>
      <p class="lede">Halfway through it or on the other side, we want to hear it. With your permission, some stories will be shared in the Comeback File, and may one day become an episode.</p>
    </div>
    <a class="btn btn-gold" href="/share">Share your story</a>
  </div>
</section>

<section class="section section-alt" id="host">
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


def simple(path, title, desc, inner, noindex=False, band=True):
    return layout(path, title, desc, f'<section class="page"><div class="wrap narrow">{inner}</div></section>', join_band=band, noindex=noindex)


PRIVACY = """<p class="eyebrow">Last updated 24 November 2026</p>
<h1>Privacy</h1>
<p>This page explains what DYEGU's website collects, why, and what you can ask us to do with it. DYEGU is a documentary series presented by Sir K.</p>
<h2>What we collect</h2>
<ul>
<li><strong>Your email address</strong> when you join the Comeback File, the Rebuild Playbook waitlist or the shop drop list, with the list you joined, the situation you chose (if any), the products you ticked, the page you signed up on and the campaign link you arrived from.</li>
<li><strong>Your name, email, organisation and message</strong> when you send a talk, workshop, sponsorship or press enquiry.</li>
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
<p>List emails are kept until you unsubscribe or ask us to delete them. Enquiries are kept for up to two years. Shared stories are kept until you ask us to delete them, or for two years if not featured.</p>
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
            write("privacy/index.html", simple("/privacy", "Privacy · DYEGU", "How DYEGU collects and uses your data.", PRIVACY)),
            write("studio/index.html", simple("/studio", "Sponsors & partners · DYEGU", "Partner with DYEGU, the documented comeback series presented by Sir K.", STUDIO)),
            write("404.html", simple("/404", "Not found · DYEGU", "Page not found.", '<h1>Lost the thread?</h1><p>This page doesn\'t exist, but the story isn\'t over. <a href="/">Back to DYEGU</a> or <a href="/#start">find the story for where you are</a>.</p>', noindex=True))]
    urls = ["/"] + [f"/start/{s['key']}" for s in STAGES] + ["/stories"] + [f"/stories/{s['slug']}" for s in STORIES if s.get("live_page")] + ["/shop", "/playbook", "/speaking", "/about", "/share", "/studio", "/privacy"]
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n")
    print(f"built {len(out)} pages + sitemap ({len(urls)} urls)")


if __name__ == "__main__":
    main()
