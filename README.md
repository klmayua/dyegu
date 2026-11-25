# dyegu.co — DYEGU Screening Room & Investigative Archive

Next.js App Router + React + TypeScript + Tailwind CSS application aligned 100% with the DYEGU Brand & Post-Production Bible (v1.1).

## Quick Commands

```bash
# 1. Sync verified claims, chapters & DYEGU Rules from ../episodes/
python tools/sync_episodes.py

# 2. Run local dev server
npm run dev

# 3. Production build
npm run build
```

## Architecture

| Component | Path | Purpose |
| :--- | :--- | :--- |
| Brand Marks | `src/components/BrandMarks.tsx` | `<BrandLockup />` (D + phoenix Y + EGU) & standalone `<PhoenixMark />` vector components. |
| Act I: Hero | `src/components/HeroIdent.tsx` | Date-aware Screening Room Hero (`2026-12-06T14:00:00Z`), 4.0s ident mount animation, live `Intl.DateTimeFormat` timezone pill, `.ics` download, 4s Ident modal. |
| Act II: Proof | `src/components/ArchivalPlate.tsx`, `src/components/DossierDrawer.tsx` | Featured Episode 01 archival plate with scroll-triggered gold highlight bar + 3-column hairline dossier grid + slide-over citation drawer. |
| Act III: Timeline | `src/components/WildernessTimeline.tsx` | 7-bar horizontal perspective chart (`1.5px #444444` axes, `#C5A059` bars + `6px` milestone nodes). |
| Act IV: Triage | `src/components/FloorTriage.tsx` | 8-chapter 2-column hairline index with `?chapter=slug` URL sync, inline reading pane, 1-line email signup, and quiet share controls. |
| Act V: Host Rule | `src/components/HostRule.tsx` | Sir K Studio 01 editorial block, Sunday Comeback File, Founding Cohort Waitlist (Jan 2027), and The Studio Mug preview. |
| Standards Route | `src/app/standards/page.tsx` | Dedicated verification methodology (`[V] / [E] / [T]`, AI-assisted research & human source audit, held-back claims policy). |
| API Routes | `src/app/api/submit/route.ts`, `src/app/api/episodes/route.ts` | Hardened Supabase/Resend/Care-Review submission proxy & `@DYEGUOfficial` YouTube RSS sync. |

## Vercel Environment Variables

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `YT_CHANNEL_ID` | Recommended | `UC…` channel ID for `@DYEGUOfficial` |
| `SUPABASE_URL` | Optional | Defaults to `https://hhnvirsisuxumwchntjf.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Enables server-side `priority_flag = 'care_review'` writes & `ops_cli.py` |
| `RESEND_API_KEY` | Recommended | Sends Void & Gold branded confirmation emails |
| `RESEND_FROM` | Optional | Defaults to `DYEGU <hello@dyegu.co>` |
| `TEAM_ALERT_WEBHOOK_URL` | Recommended | Webhook alerted immediately on Enquiries, Volunteers & Care-Review stories |
| `TURNSTILE_SECRET_KEY` | Optional | Optional Cloudflare Turnstile verification |
