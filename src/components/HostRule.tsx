import React from "react";
import Link from "next/link";
import { PhoenixMark } from "./BrandMarks";
import { SubscribeForm } from "./SubscribeForm";
import { STUDIO_MUG } from "@/lib/dyegu-data";

export function HostRule() {
  return (
    <section
      aria-label="Act V: Host Signature and Quiet Ritual"
      className="bg-[#000000] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Sir K Editorial Block — Split on #000000 separated by 1px #444444 vertical rule */}
        <div className="grid grid-cols-1 gap-10 border-b border-[#444444] pb-16 lg:grid-cols-12 lg:gap-0">
          {/* Left: 4:5 aspect frame with 1px rgba(197, 160, 89, 0.60) border — reserved studio portrait */}
          <div className="lg:col-span-4 lg:pr-12">
            <div className="mx-auto max-w-[300px] lg:mx-0">
              <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-between border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6">
                <div className="flex w-full items-center justify-between label-track text-[#8E8E8A]">
                  <span>4:5</span>
                  <span>24FPS</span>
                </div>

                <div className="flex flex-col items-center gap-4 text-center">
                  <PhoenixMark size={30} />
                  <p className="label-track text-[#C5A059]">SIR K · STUDIO 01</p>
                  <p className="text-xs text-[#8E8E8A]">Portrait Plate Reserved</p>
                </div>

                <div className="w-full border-t border-[#444444] pt-3 text-center label-track text-[#8E8E8A]">
                  DYEGU ARCHIVE · 2026
                </div>
              </div>
            </div>
          </div>

          {/* Right: 1px #444444 vertical rule on desktop + THE DYEGU RULE */}
          <div className="flex flex-col justify-center lg:col-span-8 lg:border-l lg:border-[#444444] lg:pl-14">
            <p className="label-track text-[#C5A059]">Act V · The DYEGU Rule</p>
            <blockquote className="mt-5 font-display text-[32px] font-medium italic leading-[1.24] text-[#F5F5F0] sm:text-[44px]">
              &ldquo;Sometimes losing the version of your life you outgrew is how you build the one
              that lasts.&rdquo;
            </blockquote>
            <p className="mt-6 label-track text-[#8E8E8A]">— Sir K, Host of DYEGU</p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#8E8E8A]">
              No motivational theatre. No invented dialogue. Every Sunday we open the record on how
              a real person endured the years nobody filmed—and what carried them through.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 label-track">
              <Link href="/about" className="text-[#C5A059] hover:underline underline-offset-4">
                About the Archive →
              </Link>
              <Link href="/speaking" className="text-[#8E8E8A] hover:text-[#F5F5F0]">
                Talks &amp; Workshops →
              </Link>
            </div>
          </div>
        </div>

        {/* The Sunday Comeback File & Founding Circle — Compact 2-column hairline section */}
        <div
          id="comeback-file"
          className="mt-16 grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] lg:grid-cols-12 lg:divide-x lg:divide-y-0"
        >
          {/* Left: The Comeback File */}
          <div className="py-10 lg:col-span-7 lg:pr-12">
            <p className="label-track text-[#C5A059]">The Comeback File · Free Every Sunday</p>
            <h2 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
              No sermons. No slogans. Just what actually happened.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#8E8E8A]">
              Receive the printable 1-Page Wilderness Field Note immediately—plus one primary-sourced
              comeback dossier, three verifiable receipts, and one quiet move every Sunday.
            </p>
            <div className="mt-6 max-w-xl">
              <SubscribeForm buttonLabel="Open the Field Note" />
            </div>
          </div>

          {/* Right: Founding Cohort Waitlist + Playbook + Studio Mug Preview */}
          <div className="flex flex-col divide-y divide-[#444444] lg:col-span-5 lg:pl-12">
            <div className="py-8">
              <p className="label-track text-[#C5A059]">
                Founding Cohort Waitlist · Opens January 2027
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium text-[#F5F5F0]">
                Rebuild Circles &amp; The Rebuild Playbook
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">
                Free 6-week peer cohorts matched by chapter and time zone ($0), alongside the
                7-chapter practical workbook ($19) drawn from Season 1.
              </p>
              <div className="mt-4 flex flex-wrap gap-5 label-track">
                <Link
                  href="/community/circles"
                  className="text-[#C5A059] hover:underline underline-offset-4"
                >
                  Join Founding Cohort Waitlist →
                </Link>
                <Link href="/playbook" className="text-[#F5F5F0] hover:text-[#C5A059]">
                  Preview Playbook ($19) →
                </Link>
              </div>
            </div>

            {/* Merchandise Hold: Minimal Coming-Soon Preview of The Studio Mug ONLY */}
            <div className="flex items-center gap-5 py-8">
              <div className="h-24 w-24 shrink-0 border border-[rgba(197,160,89,0.60)] bg-[#000000] overflow-hidden">
                <img
                  src={STUDIO_MUG.image}
                  alt={STUDIO_MUG.name}
                  width={240}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="label-track text-[#8E8E8A]">Coming Soon · Edition 01</p>
                <h3 className="mt-1 font-display text-2xl font-medium text-[#F5F5F0]">
                  {STUDIO_MUG.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#8E8E8A]">
                  12 oz straight-wall matte-black ceramic · matte-gold phoenix.
                </p>
                <Link
                  href="/shop"
                  className="mt-2 inline-block label-track text-[#C5A059] hover:underline underline-offset-4"
                >
                  Join Preview List →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
