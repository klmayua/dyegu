import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SESSION_TOPICS } from "@/lib/dyegu-data";
import { CommunityFormClient } from "@/components/CommunityFormClient";

export const metadata: Metadata = {
  title: "Free Expert Sessions · DYEGU Community",
  description:
    "Vote for the practical topics we schedule first with vetted volunteer experts in Q1 2027.",
};

export default function SessionsPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">
            <Link href="/community" className="hover:underline">
              Community
            </Link>{" "}
            · Opens Q1 2027 · $0
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
            Free Rebuild Sessions
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#8E8E8A]">
            Live online sessions where a vetted volunteer expert walks through one practical topic
            and answers open questions. Zero pitching or client solicitation, strictly enforced.
          </p>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Topics on the Q1 2027 Slate</p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SESSION_TOPICS.map(([k, t]) => (
              <li key={k} className="border-b border-[#444444] py-3 text-sm text-[#F5F5F0]/90">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[720px] px-6">
          <h2 className="font-display text-4xl text-[#F5F5F0]">Vote for the sessions you need</h2>
          <p className="mt-3 mb-8 text-sm text-[#8E8E8A]">
            Highest-demand topics are scheduled first. We&apos;ll send a free invite when your
            selected topics go on the Q1 2027 calendar.
          </p>
          <CommunityFormClient
            kind="session"
            buttonLabel="Request Free Sessions"
            successText="Thank you. We'll invite you as soon as sessions on your requested topics are scheduled."
          />
        </div>
      </section>
    </div>
  );
}
