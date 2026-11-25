import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsors & Partners · DYEGU",
  description: "Partner with DYEGU, an independent 4K documentary house and investigative archive.",
};

export default function StudioPage() {
  return (
    <div className="bg-[#000000] py-20">
      <div className="mx-auto max-w-[760px] px-6 space-y-6 text-sm leading-relaxed text-[#8E8E8A]">
        <p className="label-track text-[#C5A059]">Sponsors &amp; Founding Partners</p>
        <h1 className="font-display text-5xl text-[#F5F5F0]">Partner with DYEGU</h1>
        <p className="text-base text-[#F5F5F0]/85">
          DYEGU is an independent 4K documentary house and investigative comeback archive. Every
          episode is audited against primary sources before narration—making it a calm, brand-safe
          screening room for long-term partners.
        </p>
        <p>
          Our first audience media kit with verified Season 1 metrics follows Q1 2027. Until then
          we welcome conversations with founding launch partners.
        </p>
        <div className="pt-2">
          <Link
            href="/speaking#enquire"
            className="label-track inline-block border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
          >
            Start a Conversation →
          </Link>
        </div>
      </div>
    </div>
  );
}
