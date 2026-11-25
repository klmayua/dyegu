import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORT_URL } from "@/lib/dyegu-data";

export const metadata: Metadata = {
  title: "Community Safety & Guidelines",
  description: "Rules for DYEGU Rebuild Circles, free sessions, and vetted volunteers.",
};

export default function GuidelinesPage() {
  return (
    <div className="bg-[#000000] py-20">
      <div className="mx-auto max-w-[760px] px-6 space-y-8 text-sm leading-relaxed text-[#8E8E8A]">
        <div>
          <p className="label-track text-[#C5A059]">DYEGU Community</p>
          <h1 className="mt-3 font-display text-5xl text-[#F5F5F0]">Safety &amp; Guidelines</h1>
          <p className="mt-4 text-base text-[#F5F5F0]/85">
            DYEGU&apos;s circles and sessions exist so people rebuilding after a setback can find
            support and practical guidance free of charge. Everyone who joins or volunteers agrees
            to these rules.
          </p>
        </div>

        <section className="border-t border-[#444444] pt-6 space-y-3">
          <h2 className="font-display text-2xl text-[#C5A059]">What this is, and isn&apos;t</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Circles are <strong className="text-[#F5F5F0]">peer support</strong>. Sessions are <strong className="text-[#F5F5F0]">general guidance</strong> for a group.</li>
            <li>Neither is therapy, medical care, or legal, financial, or tax advice for your individual situation.</li>
            <li>Neither is an emergency service. If you&apos;re in danger or thinking about suicide or self-harm, contact a crisis line now: <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-[#C5A059] underline">findahelpline.com</a>.</li>
          </ul>
        </section>

        <section className="border-t border-[#444444] pt-6 space-y-3">
          <h2 className="font-display text-2xl text-[#C5A059]">For everyone</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-[#F5F5F0]">Confidentiality.</strong> What people share in a circle stays in the circle. No recording, screenshots, or quoting without consent.</li>
            <li><strong className="text-[#F5F5F0]">Respect.</strong> No harassment, discrimination, hate, or unsolicited lecturing.</li>
            <li><strong className="text-[#F5F5F0]">Zero selling.</strong> No promoting products, services, loans, or investments.</li>
            <li><strong className="text-[#F5F5F0]">Adults only.</strong> Circles and sessions are for people aged 18 and over.</li>
          </ul>
        </section>

        <section className="border-t border-[#444444] pt-6 space-y-3">
          <h2 className="font-display text-2xl text-[#C5A059]">Volunteer code</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-[#F5F5F0]">General guidance only.</strong> Explain options; never advise on an individual case inside a group session.</li>
            <li><strong className="text-[#F5F5F0]">No soliciting.</strong> Never pitch services or move members into paid client work.</li>
            <li><strong className="text-[#F5F5F0]">Escalate risk.</strong> Share crisis-line resources calmly and alert the DYEGU team the same day if anyone expresses risk of harm.</li>
          </ul>
        </section>

        <p className="border-t border-[#444444] pt-6">
          Need to report a concern? Use the{" "}
          <Link href="/speaking#enquire" className="text-[#C5A059] underline underline-offset-4">
            contact desk
          </Link>{" "}
          or reply to any DYEGU email.
        </p>
      </div>
    </div>
  );
}
