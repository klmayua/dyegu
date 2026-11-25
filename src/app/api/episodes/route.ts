import { NextResponse } from "next/server";

// GET /api/episodes — DYEGU long-form uploads from YouTube's public RSS feed.
// Set the Vercel env var YT_CHANNEL_ID (starts with "UC") once @DYEGUOfficial is live.

const SLUG_PATTERNS: [string, RegExp][] = [
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

function matchSlug(title: string): string | null {
  for (const [slug, rx] of SLUG_PATTERNS) {
    if (rx.test(title)) return slug;
  }
  return null;
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function GET() {
  const id = (process.env.YT_CHANNEL_ID || "").trim();
  if (!/^UC[\w-]{22}$/.test(id)) {
    return NextResponse.json(
      { items: [], bySlug: {}, configured: false },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } }
    );
  }

  try {
    const r = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${id.slice(2)}`,
      { next: { revalidate: 900 } }
    );
    if (!r.ok) {
      return NextResponse.json({ items: [], bySlug: {}, configured: true, error: r.status });
    }
    const xml = await r.text();
    const items = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => {
        const vid = (entry.match(/<yt:videoId>([^<]+)</) || [])[1];
        const title = decodeXml((entry.match(/<title>([^<]*)</) || [])[1] || "");
        const published = (entry.match(/<published>([^<]+)</) || [])[1] || "";
        const slug = matchSlug(title);
        return {
          id: vid,
          title,
          published,
          slug,
          thumb: vid ? `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg` : null,
          thumbFallback: vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : null,
        };
      })
      .filter((v) => Boolean(v.id));

    const bySlug: Record<string, (typeof items)[number]> = {};
    for (const item of items) {
      if (item.slug && !bySlug[item.slug]) bySlug[item.slug] = item;
    }

    return NextResponse.json(
      { items, bySlug, configured: true },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ items: [], bySlug: {}, configured: true, error: "fetch_failed" });
  }
}
