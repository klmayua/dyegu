import React from "react";
import type { Metadata } from "next";
import { PhoenixMark } from "@/components/BrandMarks";
import { AllyDeskContent } from "@/components/AllyDeskContent";

export const metadata: Metadata = {
  title: "Ally Desk — Custodians of the Rebuild",
  description:
    "For vetted practitioners, mentors, organizations, NGOs, and documentary underwriters supporting DYEGU's rebuild sanctuary without commercial dilution.",
};

export default function AlliesPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[920px] px-6">
          <div className="mb-5 flex items-center gap-3">
            <PhoenixMark size={18} />
            <p className="label-track text-[#C5A059]">Ally Desk · Custodians of the Rebuild</p>
          </div>
          <h1 className="font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
            Stand beside people rebuilding—without noise or pitching.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
            Our main screening room stays 100% focused on the individual walking through a hard
            season. This desk is for practitioners, organizations, NGOs, and documentary
            underwriters who want to protect and expand that room.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[920px] px-6">
          <AllyDeskContent initialTab="practitioners" />
        </div>
      </section>
    </div>
  );
}
