"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PREMIERE_ISO,
  YOUTUBE_HANDLE,
  YOUTUBE_SUBSCRIBE_URL,
  type JourneyChapter,
} from "@/lib/dyegu-data";
import { downloadSundayPremiereIcs, formatLocalBroadcastTime } from "@/lib/calendar";
import { SubscribeForm } from "./SubscribeForm";

interface BuildersBenchProps {
  chapter: JourneyChapter;
}

export function BuildersBench({ chapter }: BuildersBenchProps) {
  const storageKey = `dyegu_bench_${chapter.slug}`;
  const [note, setNote] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    setLocalTime(formatLocalBroadcastTime(PREMIERE_ISO));
  }, []);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(storageKey) || "";
      setNote(existing);
      setSavedNotice(Boolean(existing.trim()));
    } catch {
      setNote("");
    }
  }, [storageKey]);

  function handleChange(val: string) {
    setNote(val);
    try {
      if (val.trim()) {
        localStorage.setItem(storageKey, val);
        setSavedNotice(true);
      } else {
        localStorage.removeItem(storageKey);
        setSavedNotice(false);
      }
    } catch {
      // ignore storage errors
    }
  }

  return (
    <section
      id="bench"
      aria-label="Stage 3: The Builder's Bench"
      className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <p className="label-track text-[#C5A059]">
            Stage 3 · The Builder&apos;s Bench · {chapter.shortLabel}
          </p>
          <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
            Their proof ends here.{" "}
            <span className="text-[#C5A059]">Your next brick starts tonight.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
            Agency beats hype. Take two quiet minutes on your own page—nothing here requires an
            account, and nothing you write leaves your device.
          </p>
        </div>

        {/* Private On-Page Reflection Box + Tonight's One Quiet Move */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Zero-Login LocalStorage Reflection Box */}
          <div className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#444444] pb-4">
              <span className="label-track text-[#C5A059]">Private Reflection · Zero Login</span>
              <span className="label-track text-[#8E8E8A]">
                {savedNotice ? "Saved in this browser" : "Not uploaded anywhere"}
              </span>
            </div>

            <label
              htmlFor="builders-bench-note"
              className="mt-5 block font-display text-2xl font-medium leading-snug text-[#F5F5F0]"
            >
              {chapter.benchPrompt}
            </label>

            <textarea
              id="builders-bench-note"
              rows={5}
              value={note}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={chapter.benchPlaceholder}
              className="mt-5 w-full border border-[#444444] bg-[#000000] p-4 text-sm leading-relaxed text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#8E8E8A]">
                Stays strictly in your browser. Never uploaded. Auto-populates your printable Field
                Note.
              </p>
              {note.trim() && (
                <button
                  type="button"
                  onClick={() => handleChange("")}
                  className="label-track text-[#8E8E8A] hover:text-[#C5A059]"
                >
                  Clear Note
                </button>
              )}
            </div>
          </div>

          {/* Right: Tonight's One Quiet Move */}
          <div className="flex flex-col justify-between border border-[#444444] bg-[#000000] p-6 sm:p-8 lg:col-span-5">
            <div>
              <p className="label-track text-[#C5A059]">
                Tonight&apos;s One Quiet Move · {chapter.quietMoveDay}
              </p>
              <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-[#F5F5F0]">
                {chapter.quietMoveTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/85">
                {chapter.quietMoveDesc}
              </p>
            </div>

            <div className="mt-8 space-y-3 border-t border-[#444444] pt-5">
              <Link
                href={`/start/${chapter.stageKey}`}
                className="label-track block text-[#C5A059] hover:underline underline-offset-4"
              >
                Open All 3 Moves &amp; Private 7-Day Checklist →
              </Link>
              <Link
                href={`/field-note?chapter=${chapter.slug}`}
                className="label-track block text-[#8E8E8A] hover:text-[#F5F5F0]"
              >
                Preview Custom 1-Page Field Note →
              </Link>
            </div>
          </div>
        </div>

        {/* High-Intent Outcome Capture */}
        <div
          id="comeback-file"
          className="mt-10 border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="label-track text-[#C5A059]">
                Custom Field Note + The Comeback File (Sundays)
              </p>
              <h3 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
                Download your custom 1-page Wilderness Field Note.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Tailored to <span className="text-[#F5F5F0]">{chapter.shortLabel}</span> (with your
                private Bench note ready to print) plus one primary-sourced comeback every Sunday.
              </p>
            </div>
            <div className="lg:col-span-6">
              <SubscribeForm
                stage={chapter.stageKey}
                chapterSlug={chapter.slug}
                buttonLabel="Download Field Note"
                placeholder="Enter your email address"
                finePrint="Instant printable sheet tonight + one quiet email every Sunday. Unsubscribe in 1 click."
              />
            </div>
          </div>
        </div>

        {/* The Sunday Ritual Anchor */}
        <div className="mt-8 flex flex-col justify-between gap-6 border-y border-[#444444] py-6 lg:flex-row lg:items-center">
          <div>
            <p className="label-track text-[#C5A059]">The Sunday Ritual Anchor</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#F5F5F0]">
              <span className="font-medium">Sundays · 15:00 WAT</span>
              {localTime && (
                <>
                  <span className="text-[#444444]" aria-hidden="true">
                    |
                  </span>
                  <span className="text-[#8E8E8A]">Your local time: {localTime}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadSundayPremiereIcs()}
              className="label-track border border-[#444444] px-4 py-3 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              Download Sunday .ICS
            </button>
            <a
              href={YOUTUBE_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
            >
              Subscribe on YouTube ({YOUTUBE_HANDLE})
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
