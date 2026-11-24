# dyegu.co — DYEGU brand home

Static site (HTML/CSS/JS, no build step) plus one Vercel function. Every push to `main` deploys to production.

| Path | What it is |
| --- | --- |
| `index.html` | Home: promise + premiere countdown, standard, episodes, Comeback File signup, Rebuild Playbook waitlist, talk enquiries, host, follow row, footer |
| `studio/` | Sponsors & partners placeholder (media kit from ~March 2027) |
| `privacy/` | Privacy notice (UK/EU-ready) |
| `app.js` | **All config lives in the `CONFIG` block at the top**: Supabase, premiere time, follow links |
| `api/episodes.js` | Pulls long-form uploads from YouTube RSS. Needs env var `YT_CHANNEL_ID` (the `UC…` id of @DYEGUOfficial) |
| `assets/` | Brand marks generated from `01_DYEGU/brand/` (flat gold #C5A059 on void #000). Replace with Uche's vector masters when they land |

## Data (Supabase project `DYEGU360`, eu-west-2)

- `subscribers` — email, list (`comeback_file` / `playbook_waitlist`), source, created_at, exported_at
- `enquiries` — talks / workshops / sponsor / press messages

The browser can only INSERT (row-level security + column grants). Read them in the Supabase dashboard → Table editor.

**Moving subscribers to Substack:** export `subscribers where list='comeback_file' and exported_at is null` as CSV → Substack → Subscribers → Import. Then `update subscribers set exported_at = now() where exported_at is null and list='comeback_file';`

## Adding a social account

Uncomment its line in `CONFIG.follow` in `app.js`, commit, push. Only add accounts that exist (claim the handle first).

## Domain

Add `dyegu.co` in Vercel → Project → Domains once bought, then point DNS as Vercel shows. Update nothing in code: canonical/OG tags already use dyegu.co.

## Hosting note

Vercel Hobby is for non-commercial use. Before the Rebuild Playbook goes on sale (~13 Jan 2027) or any affiliate link is added, upgrade the project to Vercel Pro or move it to Cloudflare Pages (the static files move as-is; `api/episodes.js` would become a Pages Function).
