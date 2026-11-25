import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · DYEGU",
  description: "How DYEGU collects, protects, and deletes your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#000000] py-20">
      <div className="mx-auto max-w-[760px] px-6 space-y-7 text-sm leading-relaxed text-[#8E8E8A]">
        <div>
          <p className="label-track text-[#C5A059]">Last Updated 26 November 2026</p>
          <h1 className="mt-3 font-display text-5xl text-[#F5F5F0]">Privacy Policy</h1>
          <p className="mt-4 text-base text-[#F5F5F0]/85">
            This page explains what DYEGU collects, why we collect it, and how you can ask us to
            delete it at any time.
          </p>
        </div>

        <section className="border-t border-[#444444] pt-6 space-y-2">
          <h2 className="font-display text-2xl text-[#C5A059]">What we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your email address when you subscribe to The Comeback File, The Rebuild Playbook waitlist, or The Studio Mug preview list.</li>
            <li>Your chapter selection, time zone, and optional notes for Founding Cohort Waitlist matching.</li>
            <li>Your name, email, and message on speaking, sponsorship, volunteer, or private story submissions.</li>
            <li>Private on-device checklist progress is stored exclusively in your browser&apos;s localStorage and never leaves your device.</li>
          </ul>
          <p className="pt-2">We use zero advertising cookies or tracking pixels, and we never sell or rent your data.</p>
        </section>

        <section className="border-t border-[#444444] pt-6 space-y-2">
          <h2 className="font-display text-2xl text-[#C5A059]">Infrastructure &amp; Your Rights</h2>
          <p>
            Submissions are validated via our Vercel server function and stored in Supabase (UK
            region). Transactional confirmations use Resend; weekly issues use Substack. You may
            request access, correction, or deletion within 30 days by replying to any DYEGU email or
            writing via the{" "}
            <Link href="/speaking#enquire" className="text-[#C5A059] underline">
              contact desk
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
