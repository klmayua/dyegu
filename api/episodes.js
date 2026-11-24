// GET /api/episodes — DYEGU long-form uploads from YouTube's public RSS feed.
// Set the Vercel env var YT_CHANNEL_ID (starts with "UC") once @DYEGUOfficial is live.
// Uses the long-form-only uploads playlist (UULF…), so Shorts never appear in the library.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
  const id = (process.env.YT_CHANNEL_ID || "").trim();
  if (!/^UC[\w-]{22}$/.test(id)) return res.status(200).json({ items: [], configured: false });
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${id.slice(2)}`);
    if (!r.ok) return res.status(200).json({ items: [], error: r.status });
    const xml = await r.text();
    const items = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
      id: (e.match(/<yt:videoId>([^<]+)</) || [])[1],
      title: decode((e.match(/<title>([^<]*)</) || [])[1] || ""),
      published: (e.match(/<published>([^<]+)</) || [])[1],
    })).filter(v => v.id);
    return res.status(200).json({ items, configured: true });
  } catch (err) {
    return res.status(200).json({ items: [], error: "fetch_failed" });
  }
}
function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
