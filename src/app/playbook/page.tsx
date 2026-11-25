import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PLAYBOOK_CHAPTERS } from "@/lib/dyegu-data";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "The Rebuild Playbook — $19 · January 2027",
  description:
    "A 7-chapter practical workbook drawn from Season 1's documented comebacks. Opens January 2027.",
};

export default function PlaybookPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="label-track text-[#C5A059]">Coming January 2027 · $19</p>
            <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
              The Rebuild Playbook
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#8E8E8A]">
              The documented operational patterns behind Season 1&apos;s comebacks, distilled into a
              calm, unsentimental 7-chapter workbook. Read it in an evening; work through it over
              thirty days.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href="#waitlist"
                className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Join Early-Price Waitlist
              </a>
              <Link
                href="/field-note"
                className="label-track border border-[#444444] px-6 py-3.5 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                Open Free 1-Page Field Note →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[340px] border border-[rgba(197,160,89,0.60)] p-3">
              <img
                src="/assets/products/playbook.webp"
                alt="The Rebuild Playbook cover"
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Table of Contents</p>
          <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] sm:text-4xl">
            Seven chapters, seven quiet worksheets
          </h2>
          <ol className="mt-8 border-l-[1.5px] border-[#444444] pl-7 space-y-6">
            {PLAYBOOK_CHAPTERS.map(([num, title, desc]) => (
              <li key={num} className="relative">
                <span
                  className="absolute -left-[31.5px] top-1.5 h-[6px] w-[6px] rounded-full bg-[#C5A059]"
                  aria-hidden="true"
                />
                <span className="label-track text-[#C5A059]">Chapter {num}</span>
                <h3 className="mt-0.5 font-display text-2xl text-[#F5F5F0]">{title}</h3>
                <p className="mt-1 text-sm text-[#8E8E8A]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="waitlist" className="py-16">
        <div className="mx-auto max-w-[680px] px-6 text-center">
          <p className="label-track text-[#C5A059]">Early Access · January 2027</p>
          <h2 className="mt-2 font-display text-4xl text-[#F5F5F0]">
            One email when it opens.
          </h2>
          <p className="mt-3 mb-7 text-sm text-[#8E8E8A]">
            Subscribers receive first access at the early $19 edition price.
          </p>
          <SubscribeForm
            list="playbook_waitlist"
            buttonLabel="Join Playbook Waitlist"
            finePrint="One email at launch in January 2027. Never shared."
          />
        </div>
      </section>
    </div>
  );
}
