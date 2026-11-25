"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EPISODES, STORIES, type StoryMeta } from "@/lib/dyegu-data";
import { DossierDrawer } from "./DossierDrawer";

export function ArchivalPlate() {
  const plateRef = useRef<HTMLDivElement | null>(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryMeta | null>(null);

  const openingThree = STORIES.filter((s) => s.livePage);

  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setHighlightActive(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHighlightActive(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="proof"
      aria-label="Act II: The Proof"
      className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label-track text-[#C5A059]">Act II · The Proof</p>
            <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
              Primary filings. Zero mythmaking.
            </h2>
          </div>
          <Link
            href="/stories"
            className="label-track text-[#C5A059] hover:underline underline-offset-4"
          >
            Explore All 14 Season 1 Dossiers →
          </Link>
        </div>

        {/* Featured Archival Plate (Episode 01 · Steve Jobs) */}
        <div
          ref={plateRef}
          className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-10 lg:p-12"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#444444] pb-4">
            <p className="label-track text-[#C5A059]">
              ARCHIVAL PLATE · EPISODE 01 · FORTUNE, 5 AUGUST 1985
            </p>
            <span className="label-track text-[#8E8E8A]">49 VERIFIED CLAIMS · 0 HELD BACK</span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="border border-[#444444] bg-[#000000] p-2">
                <img
                  src="/assets/cards/ep01-fortune-1985.webp"
                  alt="Archival plate: Apple reorganises, cuts 20% of staff, posts first-ever quarterly loss — Fortune, 5 August 1985"
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover"
                />
              </div>
              <p className="mt-3 label-track text-[#8E8E8A]">
                Exhibit A · Contemporary Press Record (Aug–Sep 1985)
              </p>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <h3 className="font-display text-3xl font-medium text-[#F5F5F0] sm:text-[38px] leading-[1.1]">
                An office, a title, and no job.
              </h3>
              <p className="font-display text-[21px] leading-[1.58] text-[#F5F5F0]/90">
                At the end of May 1985, Apple reorganised in a rush. At thirty, Steve Jobs was
                stripped of every operating role at the company he co-founded. He kept one thing:
                the title of chairman, with nothing to run.
              </p>
              <p className="font-display text-[21px] leading-[1.58] text-[#F5F5F0]/90">
                Weeks later, John Sculley told Wall Street analysts there was{" "}
                <span
                  className="quote-highlight-wrap text-[#F5F5F0]"
                  data-active={highlightActive ? "true" : "false"}
                >
                  &ldquo;no role for Steve Jobs at Apple, now or ever.&rdquo;
                </span>{" "}
                Most careers do not survive a sentence like that.
              </p>
              <p className="text-sm leading-relaxed text-[#8E8E8A]">
                His did—not quickly, and not cleanly. It took eleven years of public losses at NeXT
                and $50 million of his own money into Pixar before Toy Story, Pixar&apos;s IPO, and
                Apple&apos;s $400 million purchase of NeXT brought him back.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStory(openingThree[0])}
                  className="label-track border border-[#C5A059] px-5 py-3 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
                >
                  Inspect Exhibit Citations
                </button>
                <Link
                  href="/stories/steve-jobs"
                  className="label-track text-[#F5F5F0] hover:text-[#C5A059]"
                >
                  Open Full Episode 01 Dossier →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Season 1 Dossier Grid (Eps 01–03) — 3-column hairline grid, zero rounded boxes */}
        <div className="mt-14">
          <div className="mb-4 flex items-center justify-between">
            <p className="label-track text-[#8E8E8A]">
              Opening Season 1 Dossiers · Click any dossier to inspect citations
            </p>
            <Link href="/standards" className="label-track text-[#8E8E8A] hover:text-[#C5A059]">
              Verification Standards →
            </Link>
          </div>

          <div className="grid grid-cols-1 border-t border-b border-[#444444] md:grid-cols-3 md:divide-x md:divide-[#444444]">
            {openingThree.map((story) => {
              const ep = EPISODES[story.slug];
              const claims = ep?.verified_claims ?? 0;
              return (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className="group flex flex-col justify-between border-b border-[#444444] bg-[#000000] p-7 text-left transition-colors last:border-b-0 md:border-b-0 hover:bg-[#000000] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#C5A059]"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-4xl font-medium text-[#C5A059]">
                        {story.no}
                      </span>
                      <span className="label-track text-[#8E8E8A]">
                        {claims} verified facts
                      </span>
                    </div>
                    <p className="mt-4 label-track text-[#8E8E8A]">{story.category}</p>
                    <h3 className="mt-1.5 font-display text-3xl font-medium text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
                      {story.subject}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                      {story.fall}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-[#444444]/60 pt-4">
                    <span className="label-track text-[#C5A059]">
                      Wilderness · {story.wilderness}
                    </span>
                    <span className="label-track text-[#F5F5F0] group-hover:text-[#C5A059]">
                      Open Drawer →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <DossierDrawer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </section>
  );
}
