# dyegu.co — DYEGU Brand Home

Static prestige documentary site (HTML/CSS/JS, zero framework bloat) + hardened Vercel serverless APIs (`/api/submit`, `/api/episodes`) + automated episode-to-site sync pipeline.

## Quick Commands

```bash
# 1. Process portraits, studio renders, strip SVG bloat & generate bespoke OG cards
python tools/prepare_assets.py

# 2. Sync verified claims, chapters, shorts & Sir K's DYEGU Rules from ../episodes/, then build all pages + .ics calendars
python tools/build.py --sync

# 3. Run the automated pre-deploy quality gate (links, anchors, assets, JSON-LD, CSP, NEEDS_CHECK check)
python tools/check_site.py
```

## Architecture

| Component | Path | Purpose |
| :--- | :--- | :--- |
| Episode Sync | `tools/sync_episodes.py` | Ingests `../episodes/ep*` (`01_claims.md`, `03_master_script.json`, `publish.json`, `teleprompter.txt`) into `content/sources.json` + `content/episodes.json` (excludes `NEEDS_CHECK`). |
| Media & OG Prep | `tools/prepare_assets.py` | Grades `SirK_Profile Pix.jpeg` into WebP/JPG portrait + avatar, copies `brand/sting.mp4`, strips C2PA bloat from SVGs, generates 1200×630 Void & Gold OG cards. |
| Site Generator | `tools/build.py` + `tools/content.py` | Builds all 26+ HTML pages, JSON-LD structured data, `.ics` calendar feeds (`assets/calendar/`), and `sitemap.xml`. |
| Quality Gate | `tools/check_site.py` | Zero-tolerance check for broken links, broken `#anchors`, missing assets, SVG bloat, invalid JSON-LD, CSP gaps, and `NEEDS_CHECK` leaks. |
| Ops CLI | `tools/ops_cli.py` | Zero-SQL triage CLI for `subscribers` (Substack batch export), `enquiries`, `volunteers`, `community_requests` cohorts, and `rebuilds`. |
| Submission Proxy | `api/submit.js` | Server-side validation, IP rate limiting, optional Turnstile, care-review flagging, Supabase insert, branded Resend confirmation email, and priority team webhook alerts. |
| YouTube Sync | `api/episodes.js` | Pulls long-form `UULF` RSS uploads once `YT_CHANNEL_ID` is set and matches videos to Season 1 story slugs. |

## Vercel Environment Variables

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `YT_CHANNEL_ID` | Recommended | `UC…` channel ID for `@dyegulive` (powers live player & card thumbnails) |
| `SUPABASE_URL` | Optional | Defaults to `https://hhnvirsisuxumwchntjf.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Enables server-side `priority_flag = 'care_review'` writes & `ops_cli.py` |
| `RESEND_API_KEY` | Recommended | Sends Void & Gold branded confirmation emails on every form submission |
| `RESEND_FROM` | Optional | Defaults to `DYEGU <hello@dyegu.co>` |
| `TEAM_ALERT_WEBHOOK_URL` | Recommended | n8n / Slack / Telegram webhook alerted immediately on Enquiries, Volunteers & Care-Review stories |
| `TURNSTILE_SECRET_KEY` | Optional | Enables Cloudflare Turnstile verification in `api/submit.js` |

## Supabase Operations Upgrade

Run `supabase/migrations/001_ops_schema.sql` once in the Supabase SQL Editor to add non-destructive triage columns (`status`, `priority_flag`, `cohort_id`, `internal_notes`) and 4 operational views (`v_circle_cohorts_ready`, `v_session_topic_demand`, `v_merch_drop_demand`, `v_funnel_by_utm`).
