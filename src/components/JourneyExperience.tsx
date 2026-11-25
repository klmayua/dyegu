"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CHAPTERS,
  CHAPTER_MAP,
  EPISODES,
  PREMIERE_ISO,
  STORIES,
  STUDIO_MUG,
  YOUTUBE_HANDLE,
  YOUTUBE_SUBSCRIBE_URL,
  resolveChapterSlug,
  type StoryMeta,
} from "@/lib/dyegu-data";
import { downloadSundayPremiereIcs, formatLocalBroadcastTime } from "@/lib/calendar";
import { PhoenixMark } from "./BrandMarks";
import { DossierDrawer } from "./DossierDrawer";
import { WildernessTimeline } from "./WildernessTimeline";
import { BuildersBench } from "./BuildersBench";
import { AllyDeskDrawer } from "./AllyDeskDrawer";
import type { AllyTab } from "./AllyDeskContent";

export function JourneyExperience() {
  const [chapterSlug, setChapterSlug] = useState<string>("door-closed");
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [identOpen, setIdentOpen] = useState(false);
  const [identKey, setIdentKey] = useState(0);
  const [selectedDossier, setSelectedDossier] = useState<StoryMeta | null>(null);
  const [allyDrawer, setAllyDrawer] = useState<{ open: boolean; tab: AllyTab }>({
    open: false,
    tab: "practitioners",
  });
  const [highlightActive, setHighlightActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const plateRef = useRef<HTMLDivElement | null>(null);
  const plateVisibleRef = useRef(false);

  const activeChapter = CHAPTER_MAP[chapterSlug] ?? CHAPTERS[0];
  const openingThree = STORIES.filter((s) => s.livePage);

  // Sync URL ?chapter=slug on initial load & evaluate date-aware broadcast state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("chapter") || p.get("stage");
      if (raw) {
        setChapterSlug(resolveChapterSlug(raw));
      }
    }

    const nowLive = Date.now() >= new Date(PREMIERE_ISO).getTime();
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

  // Scroll-triggered highlighter sweep on the Archival Plate (re-triggers cleanly on chapter change)
  useEffect(() => {
    const el = plateRef.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setHighlightActive(true);
      return;
    }

    if (plateVisibleRef.current) {
      setHighlightActive(false);
      const t = window.setTimeout(() => setHighlightActive(true), 60);
      return () => window.clearTimeout(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            plateVisibleRef.current = true;
            setHighlightActive(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [chapterSlug]);

  // Escape key closes Ident modal
  useEffect(() => {
    if (!identOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [identOpen]);

  function handleSelectChapter(slug: string) {
    setChapterSlug(slug);
    setCopiedLink(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("chapter", slug);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function getDeepLink(): string {
    if (typeof window === "undefined") {
      return `https://dyegu.co/?chapter=${activeChapter.slug}`;
    }
    return `${window.location.origin}/?chapter=${activeChapter.slug}`;
  }

  async function handleCopyPrivateLink() {
    try {
      await navigator.clipboard.writeText(getDeepLink());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore clipboard denial
    }
  }

  function handleWhatsAppShare() {
    const text = `Thinking of you today. Came across this quiet, documented record for people walking through a hard rebuild — zero hype, just proof: ${getDeepLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {/* =================================================================
          STAGE 1: THE MIRROR (HERO + IMMEDIATE 8-CHAPTER SELF-IDENTIFICATION)
          ================================================================= */}
      <section
        id="mirror"
        aria-label="Stage 1: The Mirror"
        className="bg-[#000000] border-b border-[#444444] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto max-w-[840px] text-center">
            {/* 0–0.8s: 1px #C5A059 hairline draws left-to-right */}
            <div className="mx-auto mb-7 flex max-w-[300px] items-center justify-center">
              <span
                className="ident-hairline block h-px w-full bg-[#C5A059]"
                aria-hidden="true"
              />
            </div>

            {/* 0.8–3.2s: Phoenix rises cleanly */}
            <div className="ident-phoenix mb-6 flex flex-col items-center justify-center gap-3">
              <PhoenixMark size={38} />
              <p className="label-track text-[#8E8E8A]">
                Stage 1 · The Mirror · 4K Documentary Screening Room
              </p>
            </div>

            {/* Settled Headline & Subhead */}
            <div className="ident-settle">
              <h1 className="font-display text-[46px] font-medium leading-[0.98] tracking-[-0.015em] text-[#F5F5F0] sm:text-[66px] lg:text-[84px]">
                Everything broke.{" "}
                <em className="block sm:inline text-[#C5A059] not-italic">
                  Your story didn&apos;t.
                </em>
              </h1>
              <p className="mx-auto mt-6 max-w-[60ch] text-base leading-[1.74] text-[#F5F5F0]/80 sm:text-[18px]">
                You are not behind. You are in the middle. Select the line that mirrors where you
                are standing—and see the documented proof that this room has an exit.
              </p>
            </div>

            {/* Broadcast Pill + Ident / Live Switch */}
            <div className="ident-settle-late mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border border-[rgba(197,160,89,0.60)] px-4 py-2.5">
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

              {!isLive && (
                <>
                  <button
                    type="button"
                    onClick={() => downloadSundayPremiereIcs()}
                    className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-2.5 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
                  >
                    Set Reminder · Dec 6
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentKey((k) => k + 1);
                      setIdentOpen(true);
                    }}
                    className="label-track border border-[#444444] px-5 py-2.5 text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]"
                  >
                    ▶ Watch 4s Ident
                  </button>
                </>
              )}
            </div>

            {/* Live Mode 16:9 YouTube Screening Frame on/after Dec 6 */}
            {isLive && (
              <div className="ident-settle-late mt-10 aspect-video w-full border border-[rgba(197,160,89,0.60)] bg-[#000000]">
                {liveVideoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?rel=0`}
                    title="DYEGU Episode 01: Steve Jobs"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                    <PhoenixMark size={44} />
                    <p className="label-track text-[#C5A059]">Now Streaming · Episode 01</p>
                    <a
                      href={YOUTUBE_SUBSCRIBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3 text-[#000000]"
                    >
                      Watch on YouTube ({YOUTUBE_HANDLE}) →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive 8-Chapter Selector (Synced to ?chapter=slug) */}
          <div className="mt-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="label-track text-[#C5A059]">
                Select Your Chapter · Live Across the Screening Room
              </p>
              <a
                href="#proof"
                className="label-track text-[#8E8E8A] hover:text-[#C5A059] transition-colors"
              >
                See Matched Proof Below ↓
              </a>
            </div>

            <div
              role="radiogroup"
              aria-label="Select the life chapter that mirrors where you are standing"
              className="grid grid-cols-1 gap-x-10 border-t border-[#444444] md:grid-cols-2"
            >
              {CHAPTERS.map((ch, idx) => {
                const isSelected = ch.slug === activeChapter.slug;
                return (
                  <button
                    key={ch.slug}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectChapter(ch.slug)}
                    className={`group flex w-full items-start justify-between gap-4 border-b border-[#444444] py-5 text-left transition-all ${
                      isSelected
                        ? "border-l-2 border-l-[#C5A059] pl-4"
                        : "hover:pl-2"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="label-track text-[#8E8E8A]">
                          {String(idx + 1).padStart(2, "0")} · Mirror: {ch.parallelSubject} (
                          {ch.parallelDuration})
                        </span>
                        {isSelected && (
                          <span className="label-track border border-[rgba(197,160,89,0.60)] px-2 py-0.5 text-[9px] text-[#C5A059]">
                            Active
                          </span>
                        )}
                      </div>
                      <span
                        className={`mt-1.5 block font-display text-[22px] font-medium leading-snug ${
                          isSelected
                            ? "text-[#C5A059]"
                            : "text-[#F5F5F0] group-hover:text-[#C5A059]"
                        }`}
                      >
                        {ch.mirrorLine}
                      </span>
                    </div>
                    <span
                      className={`mt-1 shrink-0 text-base ${
                        isSelected ? "text-[#C5A059]" : "text-[#8E8E8A]"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? "●" : "→"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ADDENDUM §1: Quiet Threshold Entry below the 8-chapter selector */}
            <div className="flex flex-col justify-between gap-3 border-b border-[#444444] py-4 sm:flex-row sm:items-center">
              <p className="text-sm text-[#8E8E8A]">
                Not here for yourself? Walking beside someone—or looking to contribute as a
                practitioner or organization?
              </p>
              <button
                type="button"
                onClick={() => setAllyDrawer({ open: true, tab: "practitioners" })}
                className="label-track shrink-0 text-left text-[#C5A059] hover:underline underline-offset-4 sm:text-right"
              >
                Open the Ally Desk →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          STAGE 2: YOUR HISTORICAL MIRROR & EMPIRICAL PROOF (DYNAMIC)
          ================================================================= */}
      <section
        id="proof"
        aria-label="Stage 2: Your Historical Mirror and Empirical Proof"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Personalized Mirror Banner */}
          <div className="mb-10 flex flex-col justify-between gap-4 border border-[rgba(197,160,89,0.60)] bg-[#000000] px-6 py-5 md:flex-row md:items-center">
            <div>
              <p className="label-track text-[#8E8E8A]">Stage 2 · Your Historical Mirror</p>
              <p className="mt-1.5 font-display text-2xl font-medium text-[#F5F5F0] sm:text-3xl">
                Your Chapter:{" "}
                <span className="text-[#C5A059]">{activeChapter.shortLabel}</span>{" "}
                <span className="text-[#444444]" aria-hidden="true">
                  →
                </span>{" "}
                Historical Parallel:{" "}
                <span className="text-[#F5F5F0]">{activeChapter.parallelSubject}</span>
              </p>
            </div>
            <a
              href="#bench"
              className="label-track shrink-0 text-[#C5A059] hover:underline underline-offset-4"
            >
              Go to Your Builder&apos;s Bench ↓
            </a>
          </div>

          {/* Dynamic Archival Primary-Source Plate */}
          <div
            ref={plateRef}
            className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-10 lg:p-12"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#444444] pb-4">
              <p className="label-track text-[#C5A059]">{activeChapter.plateHeader}</p>
              <span className="label-track text-[#8E8E8A]">{activeChapter.plateBadge}</span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                {activeChapter.plateImage ? (
                  <div className="border border-[#444444] bg-[#000000] p-2">
                    <img
                      src={activeChapter.plateImage}
                      alt={activeChapter.plateExhibitCaption}
                      width={1280}
                      height={720}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full flex-col justify-between border border-[#444444] bg-[#000000] p-6">
                    <div className="flex items-center justify-between label-track text-[#8E8E8A]">
                      <span>DYEGU ARCHIVE</span>
                      <span>{activeChapter.parallelDuration}</span>
                    </div>
                    <div>
                      <p className="label-track text-[#C5A059]">Documented Record</p>
                      <p className="mt-2 font-display text-3xl text-[#F5F5F0]">
                        {activeChapter.parallelSubject}
                      </p>
                    </div>
                    <p className="border-t border-[#444444] pt-3 label-track text-[#8E8E8A]">
                      {activeChapter.plateBadge}
                    </p>
                  </div>
                )}
                <p className="mt-3 label-track text-[#8E8E8A]">
                  {activeChapter.plateExhibitCaption}
                </p>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <h2 className="font-display text-3xl font-medium leading-[1.1] text-[#F5F5F0] sm:text-[38px]">
                  {activeChapter.plateHeadline}
                </h2>
                <p className="font-display text-[22px] leading-[1.56] text-[#F5F5F0]/90">
                  {activeChapter.plateBeforeQuote}
                  <span
                    className="quote-highlight-wrap text-[#F5F5F0]"
                    data-active={highlightActive ? "true" : "false"}
                  >
                    {activeChapter.plateDecisiveQuote}
                  </span>
                  {activeChapter.plateAfterQuote}
                </p>
                <p className="text-sm leading-relaxed text-[#8E8E8A]">
                  {activeChapter.plateContext}
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const matched =
                        openingThree.find((s) => s.slug === activeChapter.dossierSlug) ??
                        openingThree[0];
                      setSelectedDossier(matched);
                    }}
                    className="label-track border border-[#C5A059] px-5 py-3 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
                  >
                    Inspect Primary Citations
                  </button>
                  <Link
                    href={`/stories/${activeChapter.dossierSlug}`}
                    className="label-track text-[#F5F5F0] hover:text-[#C5A059]"
                  >
                    Open Full Dossier →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Season 1 Verified Dossier Strip */}
          <div className="mt-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="label-track text-[#8E8E8A]">
                Season 1 Verified Dossiers · Click any card for 3 primary citations
              </p>
              <Link href="/stories" className="label-track text-[#C5A059] hover:underline">
                All 14 Season 1 Episodes →
              </Link>
            </div>

            <div className="grid grid-cols-1 border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-[#444444]">
              {openingThree.map((story) => {
                const ep = EPISODES[story.slug];
                const isMirrorDossier = story.slug === activeChapter.dossierSlug;
                return (
                  <button
                    key={story.slug}
                    type="button"
                    onClick={() => setSelectedDossier(story)}
                    className={`group flex flex-col justify-between border-b border-[#444444] bg-[#000000] p-7 text-left last:border-b-0 md:border-b-0 ${
                      isMirrorDossier ? "border-t-2 border-t-[#C5A059]" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-4xl font-medium text-[#C5A059]">
                          {story.no}
                        </span>
                        <span className="label-track text-[#8E8E8A]">
                          {ep?.verified_claims ?? 0} verified facts
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
                        {story.subject}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">{story.fall}</p>
                    </div>
                    <div className="mt-7 flex items-center justify-between border-t border-[#444444]/60 pt-4">
                      <span className="label-track text-[#C5A059]">
                        Wilderness · {story.wilderness}
                      </span>
                      <span className="label-track text-[#F5F5F0] group-hover:text-[#C5A059]">
                        Inspect Drawer →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The Wilderness Duration Chart (Highlights Visitor's Selected Chapter) */}
          <div className="mt-16 border-t border-[#444444] pt-14">
            <WildernessTimeline
              embedded
              highlightedSubjects={activeChapter.highlightedSubjects}
            />
          </div>
        </div>
      </section>

      {/* =================================================================
          STAGE 3: THE BUILDER'S BENCH (PRIVATE REFLECTION + OUTCOME CAPTURE)
          ================================================================= */}
      <BuildersBench chapter={activeChapter} />

      {/* =================================================================
          STAGE 4: THE HUMAN ANCHOR, QUIET SHARE & CUSTODIANS OF THE REBUILD
          ================================================================= */}
      <section
        aria-label="Stage 4: The Human Anchor and Custodians of the Rebuild"
        className="bg-[#000000] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Sir K Host Editorial Split */}
          <div className="grid grid-cols-1 gap-10 border-b border-[#444444] pb-16 lg:grid-cols-12 lg:gap-0">
            <div className="lg:col-span-4 lg:pr-12">
              <div className="mx-auto max-w-[300px] lg:mx-0">
                <div className="flex aspect-[4/5] w-full flex-col items-center justify-between border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6">
                  <div className="flex w-full items-center justify-between label-track text-[#8E8E8A]">
                    <span>4:5</span>
                    <span>24FPS</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <PhoenixMark size={30} />
                    <p className="label-track text-[#C5A059]">SIR K · STUDIO 01</p>
                    <p className="text-xs text-[#8E8E8A]">Dark-Studio Portrait Reserved</p>
                  </div>
                  <div className="w-full border-t border-[#444444] pt-3 text-center label-track text-[#8E8E8A]">
                    DYEGU ARCHIVE · 2026
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-8 lg:border-l lg:border-[#444444] lg:pl-14">
              <p className="label-track text-[#C5A059]">Stage 4 · The Human Anchor · The DYEGU Rule</p>
              <blockquote className="mt-5 font-display text-[32px] font-medium italic leading-[1.24] text-[#F5F5F0] sm:text-[44px]">
                &ldquo;Sometimes losing the version of your life you outgrew is how you build the
                one that lasts.&rdquo;
              </blockquote>
              <p className="mt-5 label-track text-[#8E8E8A]">— Sir K, Host of DYEGU</p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#8E8E8A]">
                These stories are not documented to perform inspiration or sell a miracle formula.
                They are documented without hype so anyone standing in year three can inspect real
                dates, see how ordinary endurance works, and keep laying bricks.
              </p>

              {/* Founding Cohort, Playbook & Studio Mug Preview Strip */}
              <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#444444] pt-7 sm:grid-cols-2">
                <div>
                  <p className="label-track text-[#C5A059]">
                    Founding Cohort Waitlist · Opens January 2027
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#8E8E8A]">
                    Free 6-week peer Rebuild Circles ($0) &amp; The Rebuild Playbook ($19).
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 label-track">
                    <Link href="/community/circles" className="text-[#C5A059] hover:underline">
                      Join Cohort Waitlist →
                    </Link>
                    <Link href="/playbook" className="text-[#F5F5F0] hover:text-[#C5A059]">
                      Playbook →
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 border border-[rgba(197,160,89,0.60)] bg-[#000000] overflow-hidden">
                    <img
                      src={STUDIO_MUG.image}
                      alt={STUDIO_MUG.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="label-track text-[#8E8E8A]">Coming Soon · Edition 01</p>
                    <p className="font-display text-xl text-[#F5F5F0]">{STUDIO_MUG.name}</p>
                    <Link href="/shop" className="label-track text-[#C5A059] hover:underline">
                      12oz Ceramic Preview →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Share Artifact (For Silent Carriers) */}
          <div className="my-12 flex flex-col justify-between gap-5 border border-[rgba(197,160,89,0.60)] bg-[#000000] px-6 py-6 md:flex-row md:items-center">
            <div>
              <p className="label-track text-[#C5A059]">
                Quiet Share · For Someone Carrying a Heavy Week
              </p>
              <p className="mt-1.5 text-sm text-[#8E8E8A]">
                Send this exact chapter mirror (
                <span className="text-[#F5F5F0]">?chapter={activeChapter.slug}</span>) with a calm,
                zero-cringe note.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopyPrivateLink}
                className="label-track border border-[#444444] px-4 py-3 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                {copiedLink ? "Private Link Copied" : "Copy private link"}
              </button>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Send on WhatsApp
              </button>
            </div>
          </div>

          {/* ADDENDUM §2: Custodians of the Rebuild (2-column hairline grid below Sir K's Host Block) */}
          <div className="mt-14">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <p className="label-track text-[#8E8E8A]">
                Custodians of the Rebuild · Practitioners, Organizations &amp; Underwriters
              </p>
              <Link href="/allies" className="label-track text-[#C5A059] hover:underline">
                Visit Full Ally Desk (/allies) →
              </Link>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-2 md:divide-x md:divide-y-0">
              {/* Left Column — Vetted Practitioners & Mentors */}
              <div className="flex flex-col justify-between py-9 md:pr-10">
                <div>
                  <p className="label-track text-[#C5A059]">FOR PRACTITIONERS · ZERO PITCHING</p>
                  <h3 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0]">
                    Vetted Practitioners &amp; Mentors
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                    Therapists, career leads, legal/financial advisors, and elders who have walked
                    through a rebuild. Contribute one pitch-free hour a month to our January 2027
                    Founding Cohort.
                  </p>
                </div>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => setAllyDrawer({ open: true, tab: "practitioners" })}
                    className="label-track border border-[#C5A059] px-5 py-3 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
                  >
                    Apply to the Vetted Roster →
                  </button>
                </div>
              </div>

              {/* Right Column — Organizations, NGOs & Underwriters */}
              <div className="flex flex-col justify-between py-9 md:pl-10">
                <div>
                  <p className="label-track text-[#C5A059]">FOR INSTITUTIONS &amp; SPONSORS</p>
                  <h3 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0]">
                    Organizations, NGOs &amp; Underwriters
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                    Bring private Season 1 documentary screenings and Sir K&apos;s talks to teams
                    navigating restructuring or transition—or underwrite free access to the Rebuild
                    Playbook.
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => setAllyDrawer({ open: true, tab: "organizations" })}
                    className="label-track border border-[#C5A059] px-5 py-3 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
                  >
                    Request the Institutional Brief →
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllyDrawer({ open: true, tab: "underwriters" })}
                    className="label-track text-[#8E8E8A] hover:text-[#C5A059]"
                  >
                    Season Underwriting →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4s Official Ident Modal */}
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

      {/* Slide-Over Investigative Dossier Drawer */}
      <DossierDrawer story={selectedDossier} onClose={() => setSelectedDossier(null)} />

      {/* Slide-Over Ally Desk Drawer (Practitioners / Orgs / Underwriters) */}
      <AllyDeskDrawer
        open={allyDrawer.open}
        initialTab={allyDrawer.tab}
        onClose={() => setAllyDrawer((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
