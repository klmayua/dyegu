import React from "react";
import type { Metadata } from "next";
import { SPEAKER_KIT } from "@/lib/dyegu-data";
import { EnquiryFormClient } from "@/components/EnquiryFormClient";

export const metadata: Metadata = {
  title: "Talks & Workshops · DYEGU",
  description:
    "Evidence-grounded talks and workshops hosted by Sir K, built from DYEGU's primary-sourced comeback dossiers.",
};

export default function SpeakingPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[960px] px-6">
          <p className="label-track text-[#C5A059]">Talks, Workshops &amp; Editorial Desk</p>
          <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
            Honest conversations about rebuilding.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
            No motivational theatre or stage hype. Evidence-grounded talks and executive sessions
            drawn from primary-sourced comebacks and twenty years building teams and starting again.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SPEAKER_KIT.audiences.map((a) => (
              <span key={a} className="label-track border border-[#444444] px-3 py-1.5 text-[#8E8E8A]">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[960px] px-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border border-[#444444] p-6">
            <p className="label-track text-[#C5A059]">Approved Short Introduction</p>
            <p className="mt-3 text-sm leading-relaxed text-[#F5F5F0]/85">{SPEAKER_KIT.shortBio}</p>
          </div>
          <div className="border border-[#444444] p-6">
            <p className="label-track text-[#C5A059]">Conference Bio</p>
            <p className="mt-3 text-sm leading-relaxed text-[#F5F5F0]/85">{SPEAKER_KIT.longBio}</p>
          </div>
        </div>
      </section>

      <section id="enquire" className="py-16">
        <div className="mx-auto max-w-[760px] px-6">
          <p className="label-track text-[#C5A059]">Booking &amp; Editorial Desk</p>
          <h2 className="mt-2 mb-8 font-display text-4xl text-[#F5F5F0]">Make an enquiry</h2>
          <EnquiryFormClient />
        </div>
      </section>
    </div>
  );
}
