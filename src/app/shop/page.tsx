import React from "react";
import type { Metadata } from "next";
import { STUDIO_MUG } from "@/lib/dyegu-data";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "The Studio Mug — Coming Soon · Edition 01",
  description:
    "Minimal coming-soon preview of The Studio Mug: 12 oz matte-black straight-wall ceramic with matte gold DYEGU phoenix.",
};

export default function ShopPage() {
  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[380px] border border-[rgba(197,160,89,0.60)] bg-[#000000] p-3">
              <img
                src={STUDIO_MUG.image}
                alt="The Studio Mug — 12 oz matte-black straight-wall ceramic with matte gold phoenix"
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="label-track text-[#C5A059]">Coming Soon · Edition 01</p>
            <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
              {STUDIO_MUG.name}
            </h1>
            <p className="mt-3 label-track text-[#8E8E8A]">{STUDIO_MUG.spec}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F5F5F0]/85">
              {STUDIO_MUG.note}
            </p>
            <p className="mt-4 text-xs text-[#8E8E8A]">
              Produced in small runs, never discounted. Nothing ships until physical ceramic
              glaze and flat-gold print samples pass studio inspection.
            </p>

            <div className="mt-8 border-t border-[#444444] pt-7 max-w-xl">
              <p className="label-track text-[#F5F5F0] mb-3">Join the Edition 01 Preview List</p>
              <SubscribeForm
                list="merch_waitlist"
                interest={["mug"]}
                buttonLabel="Notify Me First"
                finePrint="One email when The Studio Mug opens for pre-order."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
