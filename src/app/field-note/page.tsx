import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { WILDERNESS_TIMELINE, YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";
import { PrintButtonClient } from "@/components/PrintButtonClient";
import { FieldNoteDynamicClient } from "@/components/FieldNoteDynamicClient";

export const metadata: Metadata = {
  title: "The 1-Page Wilderness Field Note",
  description:
    "Printable one-page Two-Column Reality Audit and perspective check for anyone navigating a rebuild.",
};

export default function FieldNotePage() {
  return (
    <div className="bg-[#000000] py-14">
      <div className="mx-auto max-w-[820px] px-6">
        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#444444] pb-5">
          <p className="label-track text-[#8E8E8A]">
            Print or save as a 1-page PDF for your desk
          </p>
          <div className="flex flex-wrap gap-3">
            <PrintButtonClient />
            <a
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="label-track border border-[#444444] px-4 py-3 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              YouTube ({YOUTUBE_HANDLE})
            </a>
            <Link
              href="/stories"
              className="label-track border border-[#444444] px-4 py-3 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#F5F5F0]"
            >
              Season 1 Archive
            </Link>
          </div>
        </div>

        <article className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-12">
          <p className="label-track text-[#C5A059]">D Y E G U · The Wilderness Field Note</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-[#F5F5F0] sm:text-5xl">
            Put the facts on one clean page.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
            Before a single comeback in Season 1 began, someone separated what actually happened
            from the private verdict looping at 2 a.m. Take ten quiet minutes with a pen.
          </p>

          <FieldNoteDynamicClient />

          <h2 className="mt-8 font-display text-2xl text-[#C5A059]">
            1. The Two-Column Reality Audit
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="border border-[#444444] p-5">
              <h3 className="font-display text-xl text-[#F5F5F0]">
                Column A · Documented Facts
              </h3>
              <p className="mt-1 text-xs text-[#8E8E8A]">
                5 lines a journalist could verify with dates and figures. Zero adjectives about
                your worth.
              </p>
              <ul className="mt-4 space-y-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="border-b border-[#444444]" />
                ))}
              </ul>
            </div>
            <div className="border border-[#444444] p-5">
              <h3 className="font-display text-xl text-[#F5F5F0]">
                Column B · Verdicts to Cross Out
              </h3>
              <p className="mt-1 text-xs text-[#8E8E8A]">
                Write the private sentences looping at 2 a.m. Draw one straight line through each.
              </p>
              <ul className="mt-4 space-y-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="border-b border-[#444444]" />
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mt-8 font-display text-2xl text-[#C5A059]">2. What Survived the Wreck</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="border border-[#444444] p-5">
              <h3 className="font-display text-xl text-[#F5F5F0]">
                Three things nobody can repossess
              </h3>
              <ul className="mt-4 space-y-6">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="border-b border-[#444444]" />
                ))}
              </ul>
            </div>
            <div className="border border-[#444444] p-5">
              <h3 className="font-display text-xl text-[#F5F5F0]">
                One finishable move in the next 7 days
              </h3>
              <ul className="mt-4 space-y-6">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="border-b border-[#444444]" />
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mt-8 font-display text-2xl text-[#C5A059]">
            3. Perspective Check · Documented Wilderness Spans
          </h2>
          <ul className="mt-3 divide-y divide-[#444444] border-y border-[#444444]">
            {WILDERNESS_TIMELINE.map((w) => (
              <li key={w.person} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <span className="text-[#F5F5F0]">{w.person}</span>
                <span className="hidden sm:inline text-xs text-[#8E8E8A]">{w.arc}</span>
                <span className="font-display text-lg text-[#C5A059]">{w.span}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 label-track text-[#8E8E8A]">
            DYEGU · Don&apos;t You Ever Give Up · dyegu.co · {YOUTUBE_HANDLE}
          </p>
        </article>
      </div>
    </div>
  );
}
