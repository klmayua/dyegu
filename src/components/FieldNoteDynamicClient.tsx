"use client";

import React, { useEffect, useState } from "react";
import { CHAPTER_MAP, resolveChapterSlug, type JourneyChapter } from "@/lib/dyegu-data";

export function FieldNoteDynamicClient() {
  const [chapter, setChapter] = useState<JourneyChapter | null>(null);
  const [savedReflection, setSavedReflection] = useState<string>("");

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("chapter") || p.get("stage");
      const slug = resolveChapterSlug(raw);
      if (raw && CHAPTER_MAP[slug]) {
        setChapter(CHAPTER_MAP[slug]);
      }
      const note = localStorage.getItem(`dyegu_bench_${slug}`) || "";
      setSavedReflection(note.trim());
    } catch {
      // ignore
    }
  }, []);

  if (!chapter && !savedReflection) return null;

  return (
    <div className="mt-6 border border-[rgba(197,160,89,0.60)] p-5">
      {chapter && (
        <div>
          <p className="label-track text-[#C5A059]">
            Custom Chapter Edition · {chapter.shortLabel} → {chapter.parallelSubject} (
            {chapter.parallelDuration})
          </p>
          <p className="mt-2 text-sm text-[#F5F5F0]/90">
            <strong className="text-[#C5A059]">Tonight&apos;s One Quiet Move:</strong>{" "}
            {chapter.quietMoveTitle} — {chapter.quietMoveDesc}
          </p>
        </div>
      )}

      {savedReflection && (
        <div className={chapter ? "mt-4 border-t border-[#444444] pt-4" : ""}>
          <p className="label-track text-[#8E8E8A]">
            Your Private Builder&apos;s Bench Reflection (Loaded Locally · Never Uploaded)
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#F5F5F0]">
            {savedReflection}
          </p>
        </div>
      )}
    </div>
  );
}
