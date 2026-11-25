import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/dyegu-data";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "D Y E G U — Documented Comebacks & Investigative Archive",
    template: "%s · DYEGU",
  },
  description:
    "Documented comebacks—not highlight reels. Real dates, primary filings, and what year three actually felt like. Hosted by Sir K.",
  openGraph: {
    type: "website",
    siteName: "DYEGU",
    url: SITE_URL,
    title: "D Y E G U — Everything broke. Your story didn't.",
    description:
      "Documented comebacks—not highlight reels. Real dates, primary filings, and what year three actually felt like.",
    images: [{ url: "/assets/og.jpg", width: 1200, height: 630, alt: "DYEGU" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable} bg-[#000000]`}>
      <body className="min-h-screen bg-[#000000] text-[#F5F5F0] font-sans antialiased selection:bg-[rgba(197,160,89,0.30)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#C5A059] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-[#000000]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="bg-[#000000]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
