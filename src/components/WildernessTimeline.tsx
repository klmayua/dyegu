"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { WILDERNESS_CHART_BARS } from "@/lib/chapters-data";

const CINEMA_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface WildernessTimelineProps {
  activeChapterSlug?: string;
  highlightedSubjects?: string[];
  embedded?: boolean;
}

export function WildernessTimeline({
  activeChapterSlug,
  highlightedSubjects = [],
  embedded = false,
}: WildernessTimelineProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.25 });
  const prefersReduced = useReducedMotion();

  const hasFilter = Boolean(activeChapterSlug) || highlightedSubjects.length > 0;

  const content = (
    <div ref={chartRef}>
      <div className="max-w-2xl">
        <p className="label-track text-[#C5A059]">EMPIRICAL TIMELINE · SEASON 1 ARCHIVE</p>
        <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
          How long the wilderness actually lasted.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
          Social media compresses ten-year rebuilds into sixty-second clips, making Year Two feel
          like a permanent verdict. Look at the documented gap between rock bottom and breakthrough
          across Season 1:
        </p>
      </div>

      {/* Strict Post-Production Chart Spec: 1.5px solid #444444 left & bottom axes, zero gridlines, zero gradients */}
      <div className="mt-12 border-l-[1.5px] border-b-[1.5px] border-[#444444] pl-5 pb-6 sm:pl-8">
        <ul className="space-y-6" role="list" aria-label="Wilderness durations by subject">
          {WILDERNESS_CHART_BARS.map((item, idx) => {
            const matchesSubject = highlightedSubjects.includes(item.subject);
            const matchesSlug = Boolean(activeChapterSlug && item.chapterSlug === activeChapterSlug);
            const isHighlighted = matchesSubject || matchesSlug;
            const dimmed = hasFilter && !isHighlighted;

            return (
              <li
                key={item.subject}
                className={`grid grid-cols-1 gap-2 transition-opacity duration-500 md:grid-cols-12 md:items-center md:gap-6 ${
                  dimmed ? "opacity-45" : "opacity-100"
                }`}
              >
                <div className="md:col-span-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`font-display text-2xl font-medium leading-tight ${
                        isHighlighted ? "text-[#C5A059]" : "text-[#F5F5F0]"
                      }`}
                    >
                      {item.subject}
                    </p>
                    {isHighlighted && (
                      <span className="label-track border border-[rgba(197,160,89,0.60)] px-2 py-0.5 text-[9px] text-[#C5A059]">
                        Your Mirror
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#8E8E8A]">{item.label}</p>
                </div>

                <div className="md:col-span-7 flex items-center">
                  <div className="relative flex w-full items-center py-2">
                    <div className="relative flex items-center" style={{ width: `${item.pct}%` }}>
                      <motion.div
                        initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                        animate={inView || prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{
                          duration: 0.9,
                          delay: prefersReduced ? 0 : idx * 0.08,
                          ease: CINEMA_EASE,
                        }}
                        style={{ transformOrigin: "left center" }}
                        className={`w-full bg-[#C5A059] ${isHighlighted ? "h-[3px]" : "h-[2px]"}`}
                      />
                      <motion.span
                        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                        animate={inView || prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: prefersReduced ? 0 : idx * 0.08 + 0.55,
                          ease: CINEMA_EASE,
                        }}
                        className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#C5A059]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <span className="font-display text-2xl font-medium text-[#C5A059]">
                    {item.duration}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Axis Scale Labels */}
      <div className="mt-3 flex justify-between pl-5 sm:pl-8 label-track text-[#8E8E8A]">
        <span>0 Yrs</span>
        <span>5 Yrs</span>
        <span>10 Yrs</span>
        <span>15 Yrs</span>
        <span>20 Yrs</span>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section
      id="wilderness"
      aria-label="Wilderness Reality Check"
      className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">{content}</div>
    </section>
  );
}
