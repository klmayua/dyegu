import React from "react";
import type { Metadata } from "next";
import { ShareFormClient } from "@/components/ShareFormClient";
import { SUPPORT_URL } from "@/lib/dyegu-data";

export const metadata: Metadata = {
  title: "Share Your Rebuild",
  description: "Share your comeback story privately with DYEGU.",
};

export default function SharePage() {
  return (
    <div className="bg-[#000000] py-20">
      <div className="mx-auto max-w-[760px] px-6">
        <p className="label-track text-[#C5A059]">Private Reader Archive</p>
        <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0]">
          Your story belongs here too.
        </h1>
        <p className="mt-4 mb-10 text-base leading-relaxed text-[#8E8E8A]">
          In the middle of it or standing on the other side—real people read every submission
          privately. Nothing is ever published without asking you again first.
        </p>

        <ShareFormClient />

        <aside className="mt-10 border-l border-[#444444] pl-4 text-xs text-[#8E8E8A]">
          This form is not monitored around the clock. If you are in immediate danger or thinking
          about self-harm, please reach a local crisis line:{" "}
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] underline"
          >
            findahelpline.com
          </a>
          .
        </aside>
      </div>
    </div>
  );
}
