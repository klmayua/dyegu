import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CIRCLE_SAFETY_PROMISES, SUPPORT_URL } from "@/lib/dyegu-data";

export const metadata: Metadata = {
  title: "Community — Founding Cohort Waitlist · Opens January 2027",
  description:
    "Founding Cohort Waitlist for free peer Rebuild Circles and vetted Expert Sessions, opening January 2027.",
};

export default function CommunityPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="label-track text-[#C5A059]">
            Founding Cohort Waitlist · Opens January 2027 · Always $0
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
            Nobody should rebuild in silence.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
            Season 1 launches in December 2026. Our first vetted peer cohorts and free expert
            sessions open in January 2027—built deliberately, never rushed, and strictly free of
            pitching.
          </p>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0">
            <Link href="/community/circles" className="group block py-8 md:pr-8">
              <p className="label-track text-[#C5A059]">Founding Cohort Waitlist · Jan 2027</p>
              <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] group-hover:text-[#C5A059]">
                Rebuild Circles
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Six to eight peers at the exact same chapter in your time zone, meeting weekly for
                six weeks with a trained volunteer facilitator.
              </p>
              <span className="mt-5 inline-block label-track text-[#C5A059]">
                Join Founding Waitlist →
              </span>
            </Link>

            <Link href="/community/sessions" className="group block py-8 md:px-8">
              <p className="label-track text-[#C5A059]">Practical Guidance · Opens Q1 2027</p>
              <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] group-hover:text-[#C5A059]">
                Free Expert Sessions
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Vetted recruiters, accountants, lawyers, founders, and counsellors answering
                practical questions live with zero commercial pitching.
              </p>
              <span className="mt-5 inline-block label-track text-[#C5A059]">
                Vote for First Topics →
              </span>
            </Link>

            <Link href="/volunteer" className="group block py-8 md:pl-8">
              <p className="label-track text-[#C5A059]">Volunteer Charter · Vetting Now</p>
              <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] group-hover:text-[#C5A059]">
                Volunteer an Hour
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                We are vetting founding volunteer facilitators and subject-matter experts ahead of
                January 2027.
              </p>
              <span className="mt-5 inline-block label-track text-[#C5A059]">
                Apply to Volunteer →
              </span>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CIRCLE_SAFETY_PROMISES.map(([title, desc]) => (
              <div key={title} className="border border-[#444444] p-5">
                <h3 className="font-display text-xl text-[#F5F5F0]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8E8E8A]">{desc}</p>
              </div>
            ))}
          </div>

          <aside className="mt-10 border-l border-[#C5A059] pl-5 text-sm text-[#8E8E8A]">
            <strong className="text-[#F5F5F0]">Not for emergencies.</strong> Circles and sessions
            are peer support and general guidance, not therapy or emergency care. Crisis lines:{" "}
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] underline underline-offset-4"
            >
              findahelpline.com
            </a>
            .
          </aside>
        </div>
      </section>
    </div>
  );
}
