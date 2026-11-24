# dyegu.co — DYEGU brand home

Static site (HTML/CSS/JS, no build step) plus one Vercel function. Every push to `main` deploys to production.

## How it's built

Words live in `tools/content.py` (stories, the 8 "Where are you right now?" stages, shop products). Page templates live in `tools/build.py`. After any change:

```
python3 tools/build.py   # regenerates every page + sitemap
git commit -am "..." && git push   # Vercel deploys in ~10 s
```

Runtime config (Supabase, premiere time, social links) is the `CONFIG` block at the top of `app.js`. Episode sources come from `content/sources.json`, generated from each episode's `01_claims.md` (NEEDS_CHECK rows are excluded).

| Page | Path | Converts to |
| --- | --- | --- |
| Home | `/` | stage pick → stage page; Comeback File |
| 8 stage pages | `/start/<job,money,breakup,health,rejected,later,stuck,grief>` | Comeback File tagged with the stage |
| Stories | `/stories`, `/stories/<slug>` | sources published; Comeback File |
| Shop · Drop 01 Rise | `/shop` | drop list with ticked products (`merch_waitlist` + `interest`) |
| Rebuild Playbook | `/playbook` | `playbook_waitlist` + stage |
| Speaking | `/speaking` | `enquiries` (date, audience, budget) |
| Share your rebuild | `/share` | `rebuilds` (with two consents) |
| About, Studio, Privacy | `/about`, `/studio`, `/privacy` | — |

Every page ends with the Comeback File band and the crisis-support line. Every signup records list, stage, products, page and `utm_*` campaign.

## Data (Supabase project `DYEGU360`, eu-west-2)

- `subscribers`: email, list (`comeback_file` / `playbook_waitlist` / `merch_waitlist`), stage, interest[], page, utm, created_at, exported_at
- `enquiries`: talks / workshops / sponsor / press, with date, audience, budget
- `rebuilds`: shared stories with consent_contact / consent_feature. Treat as sensitive: read, never publish without asking again

The browser can only INSERT (row-level security + column grants). Read in Supabase → Table editor.

Useful queries:
```sql
select stage, count(*) from subscribers group by 1 order by 2 desc;          -- which stages convert
select unnest(interest) item, count(*) from subscribers where list='merch_waitlist' group by 1 order by 2 desc;  -- merch demand
select utm, count(*) from subscribers group by 1 order by 2 desc;            -- which campaigns work
```

**Moving subscribers to Substack:** export `subscribers where list='comeback_file' and exported_at is null` as CSV → Substack → Subscribers → Import. Then `update subscribers set exported_at = now() where exported_at is null and list='comeback_file';`

## Episodes from YouTube

`api/episodes.js` pulls long-form uploads once the Vercel env var `YT_CHANNEL_ID` (the `UC…` id of @DYEGUOfficial) is set. To embed a specific episode on its story page, add `youtube_id="<11-char id>"` to that story in `tools/content.py`.

## Analytics

Vercel Web Analytics (cookie-free) is wired in. Turn it on once: Vercel → project `dyegu` → Analytics → Enable.

## Domain

When bought, add it in Vercel → Project → Domains, then change `SITE` in `tools/content.py` and rebuild (canonical + OG tags).

## Before selling anything

Shop is a drop list only. Open sales after: vector masters (N-01), trademark search (N-17), gold-matched samples, and Vercel Pro.
