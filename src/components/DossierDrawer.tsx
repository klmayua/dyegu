"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { EPISODES, SOURCES, TAG_LABELS, type StoryMeta } from "@/lib/dyegu-data";
import { PhoenixMark } from "./BrandMarks";
import { SOFT, lockPageScroll } from "./MotionPrimitives";

interface DossierDrawerProps {
  story: StoryMeta | null;
  onClose: () => void;
}

export function DossierDrawer({ story, onClose }: DossierDrawerProps) {
  const still = useReducedMotion();

  useEffect(() => {
    if (!story) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockPageScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [story, onClose]);

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Episode ${story.no} Dossier: ${story.subject}`}
          data-lenis-prevent
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: SOFT }}
          className="fixed inset-0 z-[100] flex justify-end bg-[#000000]/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <DossierDrawerInner story={story} onClose={onClose} still={Boolean(still)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DossierDrawerInner({
  story,
  onClose,
  still,
}: {
  story: StoryMeta;
  onClose: () => void;
  still: boolean;
}) {
  const ep = EPISODES[story.slug];
  const src = SOURCES[story.slug];
  const citations =
    story.sampleCitations ??
    (src?.sources.slice(0, 3).map((s) => ({
      citation: s.title || s.label,
      tag: (s.tag as "V" | "E" | "T") || "E",
      url: s.url,
    })) ??
      []);

  return (
    <motion.div
      data-lenis-prevent
      initial={still ? false : { x: "100%" }}
      animate={{ x: 0 }}
      exit={still ? undefined : { x: "100%" }}
      transition={{ duration: 0.42, ease: SOFT }}
      className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-[#C5A059] bg-[#000000] p-7 sm:p-10"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#444444] pb-5">
        <div className="flex items-center gap-3">
          <PhoenixMark size={18} />
          <span className="label-track text-[#C5A059]">
            Episode {story.no} · Investigative Dossier
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dossier drawer"
          className="border border-[#444444] p-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
        >
          <X className="h-4 w-4" strokeWidth={1.25} />
        </button>
      </div>

      <div className="mt-7 flex-1">
        <div className="inline-block border border-[rgba(197,160,89,0.60)] px-3 py-1 label-track text-[#C5A059]">
          Narrative Arc · {story.arc}
        </div>

        <h2 className="mt-4 font-display text-4xl font-medium text-[#F5F5F0] sm:text-5xl">
          {story.subject}
        </h2>

        <div className="mt-5 grid grid-cols-3 divide-x divide-[#444444] border-y border-[#444444] py-3.5">
          <div className="pr-3">
            <p className="label-track text-[#8E8E8A]">Wilderness</p>
            <p className="mt-1 font-display text-xl text-[#C5A059]">{story.wilderness}</p>
          </div>
          <div className="px-3">
            <p className="label-track text-[#8E8E8A]">Verified Facts</p>
            <p className="mt-1 font-display text-xl text-[#F5F5F0]">
              {ep?.verified_claims ?? src?.verified_claims ?? 0}
            </p>
          </div>
          <div className="pl-3">
            <p className="label-track text-[#8E8E8A]">Sources</p>
            <p className="mt-1 font-display text-xl text-[#F5F5F0]">
              {ep?.source_count ?? src?.sources.length ?? 0}
            </p>
          </div>
        </div>

        {story.synopsis && (
          <p className="mt-6 text-sm leading-relaxed text-[#F5F5F0]/85">{story.synopsis}</p>
        )}

        <div className="mt-8">
          <p className="label-track text-[#C5A059]">
            Sample Primary Source Citations (3 of {src?.sources.length ?? citations.length})
          </p>
          <ul className="mt-3 divide-y divide-[#444444] border-y border-[#444444]">
            {citations.map((c, idx) => (
              <li key={idx} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm leading-snug text-[#F5F5F0] hover:text-[#C5A059] transition-colors"
                  >
                    {c.citation}
                  </a>
                  <span className="label-track shrink-0 border border-[rgba(197,160,89,0.60)] px-2 py-0.5 text-[10px] text-[#C5A059]">
                    [{c.tag}]
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8E8E8A]">
                  {TAG_LABELS[c.tag] || "Documented Record"}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {ep?.dyegu_rule && (
          <blockquote className="mt-7 border-l border-[#C5A059] pl-4 font-display text-xl italic text-[#F5F5F0]">
            &ldquo;{ep.dyegu_rule}&rdquo;
          </blockquote>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-[#444444] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/stories/${story.slug}`}
          onClick={onClose}
          className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-center text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
        >
          Read Full Dossier &amp; All Sources →
        </Link>
        <Link
          href="/standards"
          onClick={onClose}
          className="label-track text-center text-[#8E8E8A] hover:text-[#C5A059]"
        >
          Verification Standards
        </Link>
      </div>
    </motion.div>
  );
}
