import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CIRCLE_SAFETY_PROMISES, CIRCLE_WEEKS } from "@/lib/dyegu-data";
import { CommunityFormClient } from "@/components/CommunityFormClient";

export const metadata: Metadata = {
  title: "Rebuild Circles — Founding Cohort Waitlist · Opens January 2027",
  description:
    "Founding Cohort Waitlist for DYEGU Rebuild Circles opening January 2027. Free 6-week peer cohorts matched by chapter and time zone.",
};

export default function CirclesPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">
            <Link href="/community" className="hover:underline">
              Community
            </Link>{" "}
            · Founding Cohort Waitlist · Opens January 2027
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
            Rebuild Circles
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#8E8E8A]">
            Six to eight peers navigating the same setback in the same time-zone band, meeting
            online once a week for six weeks with a trained volunteer host. Confidential, zero
            pitching, always $0. Founding cohorts open January 2027.
          </p>

          <div className="mt-8 grid grid-cols-3 divide-x divide-[#444444] border-y border-[#444444] py-4">
            <div className="pr-4">
              <p className="font-display text-3xl text-[#C5A059]">6–8</p>
              <p className="mt-1 text-xs text-[#8E8E8A]">peers per cohort</p>
            </div>
            <div className="px-4">
              <p className="font-display text-3xl text-[#F5F5F0]">Jan 2027</p>
              <p className="mt-1 text-xs text-[#8E8E8A]">founding cohorts open</p>
            </div>
            <div className="pl-4">
              <p className="font-display text-3xl text-[#C5A059]">$0</p>
              <p className="mt-1 text-xs text-[#8E8E8A]">always free</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Four Non-Negotiable Ground Rules</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CIRCLE_SAFETY_PROMISES.map(([t, d]) => (
              <div key={t} className="border border-[#444444] p-5">
                <h2 className="font-display text-2xl text-[#F5F5F0]">{t}</h2>
                <p className="mt-1.5 text-sm text-[#8E8E8A]">{d}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 label-track text-[#C5A059]">Six-Week Structure</p>
          <ol className="mt-6 border-l-[1.5px] border-[#444444] pl-7 space-y-6">
            {CIRCLE_WEEKS.map(([w, title, desc]) => (
              <li key={w} className="relative">
                <span
                  className="absolute -left-[31.5px] top-1.5 h-[6px] w-[6px] rounded-full bg-[#C5A059]"
                  aria-hidden="true"
                />
                <span className="label-track text-[#C5A059]">{w}</span>
                <h3 className="mt-0.5 font-display text-2xl text-[#F5F5F0]">{title}</h3>
                <p className="mt-1 text-sm text-[#8E8E8A]">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="waitlist" className="py-16">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="label-track text-[#C5A059]">Founding Cohort Waitlist · Opens January 2027</p>
          <h2 className="mt-2 font-display text-4xl text-[#F5F5F0]">Reserve your cohort place</h2>
          <p className="mt-3 mb-8 text-sm text-[#8E8E8A]">
            We&apos;ll send a quiet invitation in January 2027 as soon as 6–8 peers in your chapter
            and time zone are matched.
          </p>
          <CommunityFormClient
            kind="circle"
            buttonLabel="Join Founding Cohort Waitlist"
            successText="You're on the Founding Cohort Waitlist (opening January 2027). We'll write quietly when your chapter cohort is ready."
          />
        </div>
      </section>
    </div>
  );
}
