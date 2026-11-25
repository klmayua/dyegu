import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { VolunteerFormClient } from "@/components/VolunteerFormClient";

export const metadata: Metadata = {
  title: "Volunteer an Hour · DYEGU Community",
  description:
    "Offer one focused hour a month ahead of our January 2027 founding cohorts to help people rebuilding after a setback.",
};

export default function VolunteerPage() {
  return (
    <div className="bg-[#000000] py-20">
      <div className="mx-auto max-w-[760px] px-6">
        <p className="label-track text-[#C5A059]">
          <Link href="/community" className="hover:underline">
            Community
          </Link>{" "}
          · Volunteer Charter · Vetting for Jan 2027
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0]">
          Give an hour to someone starting over.
        </h1>
        <p className="mt-4 mb-10 text-base leading-relaxed text-[#8E8E8A]">
          We vet every founding facilitator and subject-matter volunteer by hand ahead of January
          2027. Approved volunteers are credited by name and profession; pitching or client
          solicitation is strictly prohibited.
        </p>
        <VolunteerFormClient />
      </div>
    </div>
  );
}
