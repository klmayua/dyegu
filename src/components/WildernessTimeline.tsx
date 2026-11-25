"use client";

import React, { useEffect, useRef, useState } from "react";
import { WILDERNESS_TIMELINE } from "@/lib/dyegu-data";

export function WildernessTimeline() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="wilderness"
      aria-label="Act III: How long the wilderness actually lasted"
      className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <p className="label-track text-[#C5A059]">Act III · Perspective Data Graphic</p>
          <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
            How long the wilderness actually lasted.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
            Documented elapsed time between public collapse and confirmed breakthrough across
            Season 1. Year two is rarely a verdict—it is usually the middle.
          </p>
        </div>

        {/* Strict Post-Production Chart Spec: 1.5px solid #444444 left & bottom axes, zero gridlines, zero gradients */}
        <div ref={chartRef} className="mt-12">
          <div className="border-l-[1.5px] border-b-[1.5px] border-[#444444] pl-5 pb-6 sm:pl-8">
            <ul className="space-y-7" role="list" aria-label="Wilderness durations by subject">
              {WILDERNESS_TIMELINE.map((item, idx) => (
                <li
                  key={item.person}
                  className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center md:gap-6"
                >
                  <div className="md:col-span-3">
                    <p className="font-display text-2xl font-medium leading-tight text-[#F5F5F0]">
                      {item.person}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8E8E8A]">{item.arc}</p>
                  </div>

                  <div className="md:col-span-7 flex items-center">
                    <div className="relative flex w-full items-center py-2">
                      <div
                        className="relative flex items-center"
                        style={{ width: `${item.pct}%` }}
                      >
                        <div
                          className="wilderness-bar-inner h-[2px] w-full bg-[#C5A059]"
                          data-visible={visible ? "true" : "false"}
                          style={{ transitionDelay: `${idx * 90}ms` }}
                        />
                        <span
                          className="wilderness-node h-[6px] w-[6px] shrink-0 rounded-full bg-[#C5A059]"
                          data-visible={visible ? "true" : "false"}
                          style={{ transitionDelay: `${idx * 90 + 550}ms` }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 md:text-right">
                    <span className="font-display text-2xl font-medium text-[#C5A059]">
                      {item.span}
                    </span>
                  </div>
                </li>
              ))}
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
      </div>
    </section>
  );
}
