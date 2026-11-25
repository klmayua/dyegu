"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STAGES, YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";
import { SubscribeForm } from "./SubscribeForm";

export function ResetSqueezeClient() {
  const [stage, setStage] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[680px] border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-10">
      <p className="label-track text-[#C5A059]">Optional · Where did the floor give way?</p>
      <div className="mt-4 mb-7 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStage((prev) => (prev === s.key ? null : s.key))}
            className={`label-track border px-3 py-2 transition-colors ${
              stage === s.key
                ? "border-[#C5A059] bg-[#C5A059] text-[#000000]"
                : "border-[#444444] text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#F5F5F0]"
            }`}
          >
            {s.short}
          </button>
        ))}
      </div>

      <SubscribeForm
        stage={stage}
        buttonLabel="Open My 1-Page Field Note"
        placeholder="Enter your email address"
      />

      <p className="mt-7 border-t border-[#444444] pt-5 text-center label-track text-[#8E8E8A]">
        <Link href="/" className="text-[#C5A059] hover:underline">
          Enter the Screening Room →
        </Link>{" "}
        ·{" "}
        <a
          href={YOUTUBE_SUBSCRIBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F5F5F0]"
        >
          YouTube ({YOUTUBE_HANDLE})
        </a>
      </p>
    </div>
  );
}
