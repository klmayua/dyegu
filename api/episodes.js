// GET /api/episodes — DYEGU long-form uploads from YouTube's public RSS feed.
// Set the Vercel env var YT_CHANNEL_ID (starts with "UC") once @dyegulive is live.
// Uses the long-form-only uploads playlist (UULF…), so Shorts never appear in the library,
// and matches uploads to Season 1 story slugs for automatic card upgrades.

const SLUG_PATTERNS = [
  ["steve-jobs", /steve\s+jobs/i],
  ["jk-rowling", /rowling/i],
  ["tyler-perry", /tyler\s+perry/i],
  ["nwankwo-kanu", /\bkanu\b/i],
  ["brendan-fraser", /brendan\s+fraser/i],
  ["tina-turner", /tina\s+turner/i],
  ["season-1-marathon", /marathon|90\s+minutes/i],
  ["denzel-washington", /denzel\s+washington/i],
  ["monica-seles", /monica\s+seles/i],
  ["tyson-fury", /tyson\s+fury/i],
  ["shania-twain", /shania\s+twain/i],
  ["simone-biles", /simone\s+biles/i],
  ["george-foreman", /george\s+foreman/i],
];

function matchSlug(title) {
  for (const [slug, rx] of SLUG_PATTERNS) {
    if (rx.test(title)) return slug;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");
  const id = (process.env.YT_CHANNEL_ID || "").trim();
  if (!/^UC[\w-]{22}$/.test(id)) {
    return res.status(200).json({ items: [], bySlug: {}, configured: false });
  }
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${id.slice(2)}`);
    if (!r.ok) return res.status(200).json({ items: [], bySlug: {}, configured: true, error: r.status });
    const xml = await r.text();
    const items = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
      const vid = (e.match(/<yt:videoId>([^<]+)</) || [])[1];
      const title = decode((e.match(/<title>([^<]*)</) || [])[1] || "");
      const published = (e.match(/<published>([^<]+)</) || [])[1] || "";
      const slug = matchSlug(title);
      return {
        id: vid,
        title,
        published,
        slug,
        thumb: vid ? `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg` : null,
        thumbFallback: vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : null,
      };
    }).filter(v => v.id);

    const bySlug = {};
    for (const item of items) {
      if (item.slug && !bySlug[item.slug]) bySlug[item.slug] = item;
    }

    return res.status(200).json({ items, bySlug, configured: true });
  } catch (_) {
    return res.status(200).json({ items: [], bySlug: {}, configured: true, error: "fetch_failed" });
  }
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
