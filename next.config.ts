import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/ep1", destination: "/stories/steve-jobs", permanent: false },
      { source: "/ep2", destination: "/stories/jk-rowling", permanent: false },
      { source: "/ep3", destination: "/stories/tyler-perry", permanent: false },
      { source: "/circle", destination: "/community/circles", permanent: false },
      {
        source: "/watch",
        destination: "https://youtube.com/@DYEGUOfficial?sub_confirmation=1",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://i.ytimg.com; media-src 'self'; connect-src 'self' https://hhnvirsisuxumwchntjf.supabase.co https://va.vercel-scripts.com; frame-src https://www.youtube-nocookie.com https://www.youtube.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
