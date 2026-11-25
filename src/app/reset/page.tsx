import React from "react";
import type { Metadata } from "next";
import { ResetSqueezeClient } from "@/components/ResetSqueezeClient";

export const metadata: Metadata = {
  title: "Open the 1-Page Wilderness Field Note",
  description:
    "Receive the printable 1-Page Wilderness Field Note immediately plus one documented comeback every Sunday.",
};

export default function ResetPage() {
  return (
    <div className="bg-[#000000] py-16 lg:py-24">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <p className="label-track text-[#C5A059]">Free · Takes 60 Seconds</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
          Everything broke.{" "}
          <span className="text-[#C5A059]">Take one steady page.</span>
        </h1>
        <p className="mx-auto mt-4 mb-10 max-w-xl text-base leading-relaxed text-[#8E8E8A]">
          Enter your email to open the printable 1-Page Wilderness Field Note immediately—plus one
          primary-sourced comeback every Sunday in The Comeback File.
        </p>
      </div>
      <div className="px-6">
        <ResetSqueezeClient />
      </div>
    </div>
  );
}
