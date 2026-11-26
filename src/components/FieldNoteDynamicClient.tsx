"use client";

import React, { useEffect, useState } from "react";
import { resolveMasterChapter, type MasterChapter } from "@/lib/chapters-data";

export function FieldNoteDynamicClient() {
  const [chapter, setChapter] = useState<MasterChapter | null>(null);
  const [savedReflection, setSavedReflection] = useState<string>("");

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("chapter") || p.get("stage");
      const resolved = resolveMasterChapter(raw);
      if (raw) setChapter(resolved);
      const note = localStorage.getItem(`dyegu_bench_${resolved.slug}`) || "";
      setSavedReflection(note.trim());
    } catch {
      // ignore
    }
  }, []);

  if (!chapter && !savedReflection) return null;

  return (
    <div className="mt-6 border border-[rgba(197,160,89,0.60)] p-5 space-y-4">
      {chapter && (
        <div>
          <p className="label-track text-[#C5A059]">
            Custom Chapter Edition · {chapter.shortLabel} → {chapter.mirrorSubject} (
            {chapter.wildernessDuration})
          </p>
          <p className="mt-2 text-xs text-[#8E8E8A]">Tomorrow Morning Protocol (Before Noon):</p>
          <ul className="mt-2 space-y-2 text-sm text-[#F5F5F0]/90">
            {chapter.protocolSteps.map((st) => (
              <li key={st.step}>
                <strong className="text-[#C5A059]">{st.step}:</strong> {st.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {savedReflection && (
        <div className={chapter ? "border-t border-[#444444] pt-4" : ""}>
          <p className="label-track text-[#8E8E8A]">
            Your Private 7:00 AM Note (Loaded Locally · Never Uploaded)
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#F5F5F0]">
            {savedReflection}
          </p>
        </div>
      )}
    </div>
  );
}
