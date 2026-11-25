import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PhoenixMark } from "@/components/BrandMarks";

export const metadata: Metadata = {
  title: "About DYEGU — Don't You Ever Give Up",
  description:
    "Why DYEGU exists, how every comeback documentary is verified against primary filings, and the quiet standard behind Season 1.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">About DYEGU</p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
            Documented comebacks—not highlight reels.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#8E8E8A]">
            DYEGU (<em className="text-[#F5F5F0]">Don&apos;t You Ever Give Up</em>) is a 4K
            documentary screening room and investigative archive examining how real people survived
            public collapse and endured the years nobody filmed.
          </p>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <div className="mx-auto max-w-[300px] lg:mx-0">
              <div className="flex aspect-[4/5] w-full flex-col items-center justify-between border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6">
                <div className="flex w-full justify-between label-track text-[#8E8E8A]">
                  <span>4:5</span>
                  <span>STUDIO 01</span>
                </div>
                <div className="flex flex-col items-center gap-4 text-center">
                  <PhoenixMark size={30} />
                  <p className="label-track text-[#C5A059]">SIR K · HOST OF DYEGU</p>
                </div>
                <div className="w-full border-t border-[#444444] pt-3 text-center label-track text-[#8E8E8A]">
                  DYEGU ARCHIVE · 2026
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <p className="label-track text-[#C5A059]">Note from the Host</p>
            <h2 className="font-display text-4xl font-medium text-[#F5F5F0]">
              Not a guru. Just another person rebuilding.
            </h2>
            <p className="text-base leading-relaxed text-[#F5F5F0]/85">
              I&apos;m not a motivational speaker, a preacher, or a miracle worker. I&apos;ve spent
              twenty years building teams and companies—and I&apos;ve had to pick up the pieces and
              rebuild more than once.
            </p>
            <p className="text-sm leading-relaxed text-[#8E8E8A]">
              When things fell apart, loud slogans only made the room feel emptier. What actually
              steadied me was reading honest, dated proof of how long other people&apos;s wilderness
              years really lasted—and seeing that ordinary endurance works.
            </p>
            <blockquote className="border-l border-[#C5A059] pl-4 font-display text-2xl italic text-[#C5A059]">
              &ldquo;Until the next story… don&apos;t you ever give up.&rdquo;
            </blockquote>
            <div className="pt-2 flex flex-wrap gap-6 label-track">
              <Link href="/standards" className="text-[#C5A059] hover:underline">
                Read Verification Standards →
              </Link>
              <Link href="/stories" className="text-[#F5F5F0] hover:text-[#C5A059]">
                Season 1 Archive →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
