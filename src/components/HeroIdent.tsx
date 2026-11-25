"use client";

import React, { useEffect, useState } from "react";
import { PhoenixMark } from "./BrandMarks";
import { downloadSundayPremiereIcs, formatLocalBroadcastTime } from "@/lib/calendar";
import { PREMIERE_ISO, YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";

export function HeroIdent() {
  const [isLive, setIsLive] = useState(false);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [identOpen, setIdentOpen] = useState(false);
  const [identKey, setIdentKey] = useState(0);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    const launchTs = new Date(PREMIERE_ISO).getTime();
    const nowLive = Date.now() >= launchTs;
    setIsLive(nowLive);
    setLocalTime(formatLocalBroadcastTime(PREMIERE_ISO));

    if (nowLive) {
      fetch("/api/episodes")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const ep1 = d?.bySlug?.["steve-jobs"] || d?.items?.[0];
          if (ep1?.id) setLiveVideoId(ep1.id);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!identOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [identOpen]);

  return (
    <section
      aria-label="Act I: Screening Room Hero"
      className="relative bg-[#000000] border-b border-[#444444]"
    >
      <div className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1200px] flex-col justify-center px-6 py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[820px] text-center">
          {/* 0–0.8s: 1px #C5A059 hairline draws left-to-right */}
          <div className="mx-auto mb-8 flex max-w-[320px] items-center justify-center">
            <span
              className="ident-hairline block h-px w-full bg-[#C5A059]"
              aria-hidden="true"
            />
          </div>

          {/* 0.8–3.2s: Phoenix rises smoothly from center */}
          <div className="ident-phoenix mb-7 flex flex-col items-center justify-center gap-3">
            <PhoenixMark size={40} />
            <p className="label-track text-[#8E8E8A]">
              Act I · Season 1 Screening Room · {YOUTUBE_HANDLE}
            </p>
          </div>

          {/* Settled Hero Headline & Subhead */}
          <div className="ident-settle">
            <h1 className="font-display text-[48px] font-medium leading-[0.98] tracking-[-0.015em] text-[#F5F5F0] sm:text-[68px] lg:text-[86px]">
              Everything broke.{" "}
              <em className="block sm:inline text-[#C5A059] not-italic">
                Your story didn&apos;t.
              </em>
            </h1>

            <p className="mx-auto mt-7 max-w-[58ch] text-base leading-[1.75] text-[#F5F5F0]/80 sm:text-[18px]">
              Documented comebacks—not highlight reels. Real dates, primary filings, and what year
              three actually felt like. Hosted by Sir K.
            </p>
          </div>

          {/* Live Timezone Pill */}
          <div className="ident-settle-late mt-8 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border border-[rgba(197,160,89,0.60)] bg-[#000000] px-4 py-2">
              <span className="label-track text-[#C5A059]">Sundays · 15:00 WAT</span>
              {localTime && (
                <>
                  <span className="text-[#444444]" aria-hidden="true">
                    |
                  </span>
                  <span className="label-track text-[#8E8E8A]">Your time · {localTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Date-Aware Action Switch */}
          {isLive ? (
            <div className="ident-settle-late mt-10">
              <div className="aspect-video w-full border border-[rgba(197,160,89,0.60)] bg-[#000000]">
                {liveVideoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?rel=0`}
                    title="DYEGU Episode 01: Steve Jobs"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center">
                    <PhoenixMark size={48} />
                    <div>
                      <p className="label-track text-[#C5A059]">Now Streaming · Episode 01</p>
                      <p className="mt-2 font-display text-3xl text-[#F5F5F0]">
                        Steve Jobs — Eleven Years in Exile
                      </p>
                    </div>
                    <a
                      href={YOUTUBE_SUBSCRIBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
                    >
                      Watch on YouTube ({YOUTUBE_HANDLE}) →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ident-settle-late mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => downloadSundayPremiereIcs()}
                className="label-track w-full sm:w-auto border border-[#C5A059] bg-[#C5A059] px-7 py-4 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Set Reminder · Dec 6
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentKey((k) => k + 1);
                  setIdentOpen(true);
                }}
                className="label-track w-full sm:w-auto border border-[#444444] bg-[#000000] px-7 py-4 text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                ▶ Watch 4s Ident
              </button>
            </div>
          )}

          {/* Subtle scroll guide */}
          <div className="ident-settle-late mt-14 flex items-center justify-center gap-6 label-track text-[#8E8E8A]">
            <a href="#proof" className="hover:text-[#C5A059] transition-colors">
              Inspect the Proof ↓
            </a>
            <span className="text-[#444444]" aria-hidden="true">
              ·
            </span>
            <a
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5A059] transition-colors"
            >
              {YOUTUBE_HANDLE}
            </a>
          </div>
        </div>
      </div>

      {/* Sleek #000000 4s Ident Modal */}
      {identOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="DYEGU Official 4-Second Ident"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/95 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIdentOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="label-track text-[#C5A059]">
                Official 4.0s Broadcast Ident · 4K Screening Room
              </p>
              <button
                type="button"
                onClick={() => setIdentOpen(false)}
                aria-label="Close ident modal"
                className="border border-[#444444] px-2.5 py-1 text-sm text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                ×
              </button>
            </div>

            <div className="aspect-video w-full border border-[#444444] bg-[#000000]">
              <video
                key={identKey}
                controls
                autoPlay
                playsInline
                poster="/assets/og.jpg"
                className="h-full w-full bg-[#000000] object-contain"
              >
                <source src="/assets/sting.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#444444] pt-4">
              <span className="label-track text-[#8E8E8A]">
                0–0.8s Hairline · 0.8–3.2s Phoenix Rise · 4.0s Void Black Hold
              </span>
              <button
                type="button"
                onClick={() => setIdentKey((k) => k + 1)}
                className="label-track text-[#C5A059] hover:underline"
              >
                Replay Ident ↺
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
