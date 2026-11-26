"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, FileText, PlayCircle } from "lucide-react";
import { EPISODES, STORIES, YOUTUBE_HANDLE, YOUTUBE_URL, type StoryMeta } from "@/lib/dyegu-data";
import { SOFT } from "./MotionPrimitives";

function useStackedDesktop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 961px) and (min-height: 640px)");
    const sync = () => setOn(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  return on;
}

const EPISODE_PLATE_META: Record<
  string,
  { citation: string; quote: string; image?: string }
> = {
  "steve-jobs": {
    citation: "FORTUNE MAGAZINE · 5 AUGUST 1985",
    quote: "“No role for Steve Jobs at Apple, now or ever.”",
    image: "/assets/cards/ep01-fortune-1985.webp",
  },
  "jk-rowling": {
    citation: "HARVARD GAZETTE & THE HERALD · 1997",
    quote: "“By every usual standard, I was the biggest failure I knew.”",
  },
  "tyler-perry": {
    citation: "ATLANTA RECORD · 1992–1998",
    quote: "“He bet $12,000 on one play. Thirty people came. He slept in a Geo Metro.”",
  },
};

function EpisodeStackCard({
  story,
  index,
  total,
  progress,
  stacked,
  onSelect,
  onPeek,
}: {
  story: StoryMeta;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
  onSelect: (s: StoryMeta) => void;
  onPeek: (active: boolean) => void;
}) {
  const still = useReducedMotion();
  const ep = EPISODES[story.slug];
  const plate = EPISODE_PLATE_META[story.slug];
  const last = index === total - 1;

  // Exact UcheChineke WorkGrid sticky-stack physics: card scales back & dims as next card slides over
  const scale = useTransform(progress, [index / total, (index + 1) / total], [1, last ? 1 : 0.94]);
  const shade = useTransform(progress, [index / total, (index + 1) / total], [0, last ? 0 : 0.52]);
  const live = stacked && !still;

  return (
    <li
      className={
        stacked
          ? "sticky top-[88px] pb-8"
          : "pb-8 last:pb-0"
      }
    >
      <motion.div
        style={live ? { scale, transformOrigin: "50% 0%", position: "relative" } : { position: "relative" }}
      >
        <div className="grid grid-cols-1 border border-[rgba(197,160,89,0.60)] bg-[#000000] lg:grid-cols-12 lg:min-h-[470px]">
          {/* Left: Documentary Dossier Details */}
          <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-6 lg:border-r lg:border-[#444444]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="label-track text-[#C5A059]">
                  EPISODE {story.no} · {story.category}
                </span>
                <span className="label-track text-[#8E8E8A]">
                  {ep?.verified_claims ?? 0} verified receipts
                </span>
              </div>

              <h3 className="mt-4 font-display text-4xl font-medium leading-[1.02] text-[#F5F5F0] sm:text-5xl">
                {story.subject}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/80 sm:text-base">
                {story.synopsis}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#444444] py-4">
                <div>
                  <dt className="label-track text-[#8E8E8A]">Wilderness Span</dt>
                  <dd className="mt-1 font-display text-2xl text-[#C5A059]">{story.wilderness}</dd>
                </div>
                <div>
                  <dt className="label-track text-[#8E8E8A]">Narrative Arc</dt>
                  <dd className="mt-1 text-xs text-[#F5F5F0]">{story.arc}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelect(story)}
                className="label-track inline-flex items-center gap-2 border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.35} />
                <span>Inspect Receipts</span>
              </button>
              <Link
                href={`/stories/${story.slug}`}
                className="label-track inline-flex items-center gap-1.5 border border-[#444444] px-5 py-3 text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                <span>Full Dossier</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.35} />
              </Link>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-track inline-flex items-center gap-1.5 px-2 py-2 text-[#8E8E8A] hover:text-[#C5A059]"
              >
                <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.25} />
                <span>{YOUTUBE_HANDLE}</span>
              </a>
            </div>
          </div>

          {/* Right: Clickable Archival Screening Plate */}
          <button
            type="button"
            onClick={() => onSelect(story)}
            onPointerEnter={() => onPeek(true)}
            onPointerLeave={() => onPeek(false)}
            className="group flex flex-col justify-between bg-[#000000] p-7 text-left sm:p-10 lg:col-span-6"
          >
            <div className="flex w-full items-center justify-between gap-2 border-b border-[#444444] pb-3">
              <span className="label-track text-[#C5A059]">
                ARCHIVAL PLATE · {plate?.citation ?? `EPISODE ${story.no}`}
              </span>
              <span className="label-track text-[#8E8E8A]">4K</span>
            </div>

            {plate?.image ? (
              <div className="my-6 w-full border border-[#444444] p-1.5">
                <img
                  src={plate.image}
                  alt={plate.citation}
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover saturate-[0.6] contrast-[1.08] transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </div>
            ) : (
              <div className="my-8 flex flex-1 flex-col justify-center">
                <p className="font-display text-3xl italic leading-[1.34] text-[#F5F5F0] sm:text-4xl">
                  <span className="bg-[rgba(197,160,89,0.30)] px-1.5 py-0.5">
                    {plate?.quote ?? story.fall}
                  </span>
                </p>
              </div>
            )}

            <div className="flex w-full items-center justify-between border-t border-[#444444] pt-4">
              <span className="text-xs text-[#8E8E8A] max-w-sm">
                {plate?.image ? plate.quote : story.rise}
              </span>
              <span className="label-track shrink-0 text-[#C5A059]">Open →</span>
            </div>
          </button>
        </div>

        {/* Dim veil as next card slides cleanly over */}
        {live && !last && (
          <motion.span
            aria-hidden="true"
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 bg-[#000000]"
          />
        )}
      </motion.div>
    </li>
  );
}

export function EpisodeStack({ onSelectStory }: { onSelectStory: (s: StoryMeta) => void }) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const stacked = useStackedDesktop();
  const openingThree = STORIES.filter((s) => s.livePage);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  // Floating desktop pointer badge ("Open Dossier") modeled on UcheChineke WorkGrid
  const [peek, setPeek] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });

  return (
    <>
      <ul
        ref={listRef}
        onPointerMove={(e) => {
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        className="relative"
      >
        {openingThree.map((story, idx) => (
          <EpisodeStackCard
            key={story.slug}
            story={story}
            index={idx}
            total={openingThree.length}
            progress={scrollYProgress}
            stacked={stacked}
            onSelect={onSelectStory}
            onPeek={setPeek}
          />
        ))}
      </ul>

      <motion.span
        aria-hidden="true"
        style={{ x: sx, y: sy }}
        initial={false}
        animate={{ scale: peek ? 1 : 0, opacity: peek ? 1 : 0 }}
        transition={{ duration: 0.28, ease: SOFT }}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-11 -mt-11 hidden h-[88px] w-[88px] place-items-center rounded-full bg-[#C5A059] text-center label-track text-[9px] text-[#000000] lg:grid"
      >
        Inspect
      </motion.span>
    </>
  );
}
