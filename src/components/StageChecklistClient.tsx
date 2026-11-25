"use client";

import React, { useEffect, useState } from "react";

export function StageChecklistClient({
  stageKey,
  moves,
}: {
  stageKey: string;
  moves: [string, string, string][];
}) {
  const storageKey = `dyegu_moves_${stageKey}`;
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setChecked(saved);
    } catch {
      // ignore
    }
  }, [storageKey]);

  function toggle(idx: number) {
    setChecked((prev) => {
      const next = prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border border-[#444444] p-4">
        <p className="text-sm text-[#8E8E8A]">
          <strong className="text-[#C5A059]">
            {checked.length} of {moves.length}
          </strong>{" "}
          moves completed this week (saved privately on your device)
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print label-track border border-[#444444] px-3.5 py-2 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
        >
          Print 1-Page Plan
        </button>
      </div>

      <ol className="mt-6 divide-y divide-[#444444] border-y border-[#444444]">
        {moves.map(([title, desc, day], idx) => {
          const isDone = checked.includes(idx);
          return (
            <li key={title} className="py-6">
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(idx)}
                  className="mt-1.5 h-5 w-5 accent-[#C5A059]"
                />
                <div>
                  <span className="label-track text-[#C5A059]">{day}</span>
                  <h3
                    className={`mt-1 font-display text-2xl ${
                      isDone ? "line-through text-[#8E8E8A]" : "text-[#F5F5F0]"
                    }`}
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">{desc}</p>
                </div>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
