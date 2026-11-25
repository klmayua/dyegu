"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EPISODES, STAGES, STORIES, type StoryMeta } from "@/lib/dyegu-data";
import { DossierDrawer } from "./DossierDrawer";
import { downloadSundayPremiereIcs } from "@/lib/calendar";

export function StoriesArchiveClient() {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [drawerStory, setDrawerStory] = useState<StoryMeta | null>(null);

  const visible = STORIES.filter(
    (s) => stageFilter === "all" || s.stages.includes(stageFilter)
  );

  return (
    <>
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="label-track text-[#C5A059]">
            Season 1 Archive · 14 Sundays · 6 December 2026 – 7 March 2027
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
            Stories you can check.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
            Every episode follows someone who lost real status, health, livelihood, or direction and
            endured the years it took to rebuild. Every published dossier lists its primary sources
            openly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadSundayPremiereIcs()}
              className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
            >
              Add All 14 Sundays (.ics)
            </button>
            <Link
              href="/standards"
              className="label-track border border-[#444444] px-5 py-3 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              Verification Standards →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <div
            role="group"
            aria-label="Filter Season 1 by life chapter"
            className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#444444]"
          >
            <span className="label-track mr-2 text-[#8E8E8A]">Chapter:</span>
            <button
              type="button"
              onClick={() => setStageFilter("all")}
              aria-pressed={stageFilter === "all"}
              className={`label-track border px-3 py-1.5 transition-colors ${
                stageFilter === "all"
                  ? "border-[#C5A059] bg-[#C5A059] text-[#000000]"
                  : "border-[#444444] text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#F5F5F0]"
              }`}
            >
              All 14
            </button>
            {STAGES.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => setStageFilter(st.key)}
                aria-pressed={stageFilter === st.key}
                className={`label-track border px-3 py-1.5 transition-colors ${
                  stageFilter === st.key
                    ? "border-[#C5A059] bg-[#C5A059] text-[#000000]"
                    : "border-[#444444] text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#F5F5F0]"
                }`}
              >
                {st.short}
              </button>
            ))}
          </div>

          <p className="mt-5 mb-6 label-track text-[#8E8E8A]">
            Showing {visible.length} of {STORIES.length} Season 1 Episodes
          </p>

          <div className="grid grid-cols-1 border-t border-l border-[#444444] md:grid-cols-2 lg:grid-cols-3">
            {visible.map((story) => {
              const ep = EPISODES[story.slug];
              const isLive = Boolean(story.livePage);
              return (
                <article
                  key={story.slug}
                  className={`flex flex-col justify-between border-r border-b border-[#444444] bg-[#000000] p-7 ${
                    story.special ? "border-t-2 border-t-[#C5A059]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-4xl font-medium text-[#C5A059]">
                        {story.no}
                      </span>
                      <span
                        className={`label-track border px-2.5 py-0.5 text-[10px] ${
                          isLive
                            ? "border-[rgba(197,160,89,0.60)] text-[#C5A059]"
                            : "border-[#444444] text-[#8E8E8A]"
                        }`}
                      >
                        {isLive
                          ? `${ep?.verified_claims ?? 0} verified facts`
                          : story.special
                            ? "90-Min Special"
                            : story.tbc
                              ? "In Verification"
                              : "Coming Soon"}
                      </span>
                    </div>
                    <p className="mt-4 label-track text-[#8E8E8A]">{story.category}</p>
                    <h2 className="mt-1.5 font-display text-3xl font-medium text-[#F5F5F0]">
                      {story.subject}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                      {story.fall} {story.rise}
                    </p>
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#444444]/60 pt-4">
                    <span className="label-track text-[#8E8E8A]">
                      {new Date(story.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {isLive ? (
                      <div className="flex items-center gap-4 label-track">
                        <button
                          type="button"
                          onClick={() => setDrawerStory(story)}
                          className="text-[#8E8E8A] hover:text-[#C5A059]"
                        >
                          Quick Inspect
                        </button>
                        <Link
                          href={`/stories/${story.slug}`}
                          className="text-[#C5A059] hover:underline"
                        >
                          Full Dossier →
                        </Link>
                      </div>
                    ) : (
                      <span className="label-track text-[#8E8E8A]">
                        Wilderness · {story.wilderness}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <DossierDrawer story={drawerStory} onClose={() => setDrawerStory(null)} />
    </>
  );
}
