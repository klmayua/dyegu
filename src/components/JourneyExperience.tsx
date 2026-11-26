"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bell,
  Clock,
  CloudFog,
  Compass,
  DoorClosed,
  FileText,
  Flame,
  HeartCrack,
  HeartHandshake,
  PlayCircle,
  Share2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  EPISODES,
  PREMIERE_ISO,
  STORIES,
  STUDIO_MUG,
  YOUTUBE_HANDLE,
  YOUTUBE_SUBSCRIBE_URL,
  type StoryMeta,
} from "@/lib/dyegu-data";
import {
  MASTER_CHAPTERS,
  MASTER_CHAPTER_MAP,
  resolveMasterChapter,
  type ChapterIconName,
} from "@/lib/chapters-data";
import { downloadSundayPremiereIcs, formatLocalBroadcastTime } from "@/lib/calendar";
import { PhoenixMark } from "./BrandMarks";
import { DossierDrawer } from "./DossierDrawer";
import { WildernessTimeline } from "./WildernessTimeline";
import { TomorrowsProtocol } from "./TomorrowsProtocol";
import { QuietWitnessWall } from "./QuietWitnessWall";
import { useDyeguModals } from "./ModalContext";

const CINEMA_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ChapterIcon({ name, active }: { name: ChapterIconName; active: boolean }) {
  const cls = `h-4 w-4 shrink-0 transition-colors ${
    active ? "text-[#C5A059]" : "text-[#C5A059]/75 group-hover:text-[#C5A059]"
  }`;
  const props = { className: cls, strokeWidth: 1.25 };
  switch (name) {
    case "DoorClosed":
      return <DoorClosed {...props} />;
    case "Wallet":
      return <Wallet {...props} />;
    case "Compass":
      return <Compass {...props} />;
    case "HeartCrack":
      return <HeartCrack {...props} />;
    case "Activity":
      return <Activity {...props} />;
    case "Clock":
      return <Clock {...props} />;
    case "CloudFog":
      return <CloudFog {...props} />;
    case "Flame":
      return <Flame {...props} />;
  }
}

export function JourneyExperience() {
  const prefersReduced = useReducedMotion();
  const { openAllyDrawer } = useDyeguModals();

  const [chapterSlug, setChapterSlug] = useState<string>("door-closed");
  const [isLive, setIsLive] = useState(false);
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [identOpen, setIdentOpen] = useState(false);
  const [identKey, setIdentKey] = useState(0);
  const [selectedDossier, setSelectedDossier] = useState<StoryMeta | null>(null);
  const [copiedMirror, setCopiedMirror] = useState(false);
  const [showWhatsAppOption, setShowWhatsAppOption] = useState(false);

  const mirrorSectionRef = useRef<HTMLDivElement | null>(null);
  const mirrorInView = useInView(mirrorSectionRef, { once: true, amount: 0.25 });
  const [highlightSweep, setHighlightSweep] = useState(false);

  const activeChapter = MASTER_CHAPTER_MAP[chapterSlug] ?? MASTER_CHAPTERS[0];
  const openingThree = STORIES.filter((s) => s.livePage);

  // Sync URL ?chapter=slug on mount & evaluate date-aware broadcast state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("chapter") || p.get("stage");
      if (raw) {
        setChapterSlug(resolveMasterChapter(raw).slug);
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

  // Re-trigger archival highlighter sweep when entering viewport or switching chapter
  useEffect(() => {
    if (prefersReduced) {
      setHighlightSweep(true);
      return;
    }
    if (!mirrorInView) return;
    setHighlightSweep(false);
    const t = window.setTimeout(() => setHighlightSweep(true), 120);
    return () => window.clearTimeout(t);
  }, [mirrorInView, chapterSlug, prefersReduced]);

  useEffect(() => {
    if (!identOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [identOpen]);

  function selectChapter(slug: string) {
    setChapterSlug(slug);
    setCopiedMirror(false);
    setShowWhatsAppOption(false);
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

  async function handleQuietShare() {
    setShowWhatsAppOption(true);
    try {
      await navigator.clipboard.writeText(getDeepLink());
      setCopiedMirror(true);
      setTimeout(() => setCopiedMirror(false), 3000);
    } catch {
      // ignore
    }
  }

  function handleWhatsApp() {
    const text = `Thinking of you today. Came across this quiet, documented story for people walking through a hard chapter—zero hype, just real proof: ${getDeepLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      {/* =================================================================
          SECTION 01: THE SCREENING ROOM HERO (OUTCOME: PEACE)
          ================================================================= */}
      <section
        id="screening-player"
        aria-label="Screening Room Hero"
        className="bg-[#000000] border-b border-[#444444] py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto max-w-[820px] text-center">
            {/* 0–0.8s: 1px #C5A059 hairline draws left-to-right */}
            <div className="mx-auto mb-8 max-w-[300px]">
              <motion.span
                initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: CINEMA_EASE }}
                style={{ transformOrigin: "left center" }}
                className="block h-px w-full bg-[#C5A059]"
                aria-hidden="true"
              />
            </div>

            {/* 0.8–3.2s: Phoenix rises smoothly */}
            <motion.div
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, delay: prefersReduced ? 0 : 0.75, ease: CINEMA_EASE }}
              className="mb-7 flex flex-col items-center gap-3.5"
            >
              <PhoenixMark size={40} />
              <p className="label-track text-[#C5A059]">
                DOCUMENTED COMEBACKS · HOSTED BY SIR K
              </p>
            </motion.div>

            {/* Headline & Subheadline */}
            <motion.div
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: prefersReduced ? 0 : 1.5, ease: CINEMA_EASE }}
            >
              <h1 className="font-display text-[48px] font-medium leading-[0.98] tracking-[-0.015em] text-[#F5F5F0] sm:text-[68px] lg:text-[88px]">
                Everything broke.{" "}
                <em className="block sm:inline text-[#C5A059] not-italic">
                  Your story didn&apos;t.
                </em>
              </h1>
              <p className="mx-auto mt-7 max-w-[58ch] text-base leading-[1.76] text-[#F5F5F0]/80 sm:text-[18px]">
                Take a breath. You are not behind—you are in the middle. No hype. No ten-step
                hustle lectures. Just real dates, primary receipts, and a steady step for tomorrow
                morning.
              </p>
            </motion.div>

            {/* Primary & Secondary CTAs (Date-Aware) */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.75, delay: prefersReduced ? 0 : 2.1, ease: CINEMA_EASE }}
              className="mt-10"
            >
              {isLive ? (
                <div className="space-y-6">
                  <div className="aspect-video w-full border border-[rgba(197,160,89,0.60)] bg-[#000000]">
                    {liveVideoId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?rel=0`}
                        title="DYEGU Episode 01 · Steve Jobs"
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
                          className="label-track inline-flex items-center gap-2 border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000]"
                        >
                          <PlayCircle className="h-4 w-4" strokeWidth={1.25} />
                          <span>Watch Episode 01 · Steve Jobs</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => downloadSundayPremiereIcs()}
                      className="label-track inline-flex w-full items-center justify-center gap-2.5 border border-[#C5A059] bg-[#C5A059] px-7 py-4 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059] sm:w-auto"
                    >
                      <Bell className="h-4 w-4" strokeWidth={1.4} />
                      <span>Set Reminder · Sunday 6 Dec (15:00 WAT)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentKey((k) => k + 1);
                        setIdentOpen(true);
                      }}
                      className="label-track inline-flex w-full items-center justify-center gap-2.5 border border-[#444444] bg-[#000000] px-7 py-4 text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059] sm:w-auto"
                    >
                      <PlayCircle className="h-4 w-4 text-[#C5A059]" strokeWidth={1.25} />
                      <span>Watch 4s Title Ident</span>
                    </button>
                  </div>
                  <p className="label-track text-[#8E8E8A]">
                    Sundays · 15:00 WAT
                    {localTime ? ` · ${localTime} in your timezone` : ""} · {YOUTUBE_HANDLE}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 02: THE THRESHOLD CHAPTER SELECTOR (OUTCOME: RECOGNITION)
          ================================================================= */}
      <section
        id="threshold"
        aria-label="Where are you standing tonight?"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-2xl">
            <p className="label-track text-[#C5A059]">
              STEP 01 · WHERE ARE YOU STANDING TONIGHT?
            </p>
            <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
              Pick the line that sounds like your week.
            </h2>
          </div>

          {/* 2-Column Hairline Grid with Framer Motion layoutId='activeChapterIndicator' */}
          <div
            role="radiogroup"
            aria-label="Choose your current life chapter"
            className="mt-10 grid grid-cols-1 gap-x-10 border-t border-b border-[#444444] md:grid-cols-2"
          >
            {MASTER_CHAPTERS.map((ch, idx) => {
              const isSelected = ch.slug === activeChapter.slug;
              return (
                <button
                  key={ch.slug}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => selectChapter(ch.slug)}
                  className="group relative flex w-full items-start gap-4 border-b border-[#444444] py-6 pl-4 pr-2 text-left last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeChapterIndicator"
                      transition={{ duration: 0.45, ease: CINEMA_EASE }}
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059]"
                      aria-hidden="true"
                    />
                  )}

                  <span className="mt-1.5">
                    <ChapterIcon name={ch.icon} active={isSelected} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="label-track text-[#8E8E8A]">
                        {String(idx + 1).padStart(2, "0")} · {ch.mirrorSubject} (
                        {ch.wildernessDuration})
                      </span>
                      {isSelected && (
                        <span className="label-track text-[#C5A059]">Active Mirror</span>
                      )}
                    </div>
                    <span
                      className={`mt-1.5 block font-display text-[22px] font-medium leading-snug transition-colors ${
                        isSelected
                          ? "text-[#C5A059]"
                          : "text-[#F5F5F0] group-hover:text-[#C5A059]"
                      }`}
                    >
                      {ch.line}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[#8E8E8A]">
                      {ch.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ally Threshold Row */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#444444] py-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:items-center">
              <HeartHandshake
                className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059] sm:mt-0"
                strokeWidth={1.25}
              />
              <p className="text-sm text-[#8E8E8A]">
                Not here for yourself? Walking beside someone—or looking to contribute as a
                practitioner or organization?
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAllyDrawer("practitioners")}
              className="label-track shrink-0 text-left text-[#C5A059] hover:underline underline-offset-4 sm:text-right"
            >
              Open the Ally Desk →
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 03: LIVING MIRROR & RECEIPT (OUTCOME: HOPE)
          ================================================================= */}
      <section
        id="mirror"
        ref={mirrorSectionRef}
        aria-label="Your Historical Mirror and Primary Receipt"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.slug}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: CINEMA_EASE }}
              className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start"
            >
              {/* Left: Empathetic 2nd-Person Narrative Bridge */}
              <div className="lg:col-span-6 space-y-6">
                <p className="label-track text-[#C5A059]">{activeChapter.mirrorEyebrow}</p>
                <h2 className="font-display text-[38px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
                  {activeChapter.mirrorHeadline}
                </h2>
                <p className="font-display text-[22px] leading-[1.58] text-[#F5F5F0]/90">
                  {activeChapter.mirrorNarrative}
                </p>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const matched =
                        openingThree.find((s) => s.slug === activeChapter.dossierSlug) ??
                        openingThree[0];
                      setSelectedDossier(matched);
                    }}
                    className="label-track inline-flex items-center justify-center gap-2 border border-[#C5A059] bg-[#C5A059] px-5 py-3.5 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
                  >
                    <FileText className="h-4 w-4" strokeWidth={1.35} />
                    <span>{activeChapter.receiptCtaLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuietShare}
                    className="label-track inline-flex items-center justify-center gap-2 border border-[#444444] px-5 py-3.5 text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]"
                  >
                    <Share2 className="h-4 w-4 text-[#C5A059]" strokeWidth={1.25} />
                    <span>
                      {copiedMirror
                        ? "Private Link Copied (?chapter=" + activeChapter.slug + ")"
                        : "Send this mirror quietly to a friend"}
                    </span>
                  </button>
                </div>

                {showWhatsAppOption && (
                  <div className="flex flex-wrap items-center gap-4 border-l border-[#C5A059] pl-4 text-xs text-[#8E8E8A]">
                    <span>Direct deep link ready for this chapter.</span>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="label-track text-[#C5A059] hover:underline"
                    >
                      Send Calm WhatsApp Note →
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Archival Primary-Source Plate */}
              <div className="lg:col-span-6">
                <div className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#444444] pb-4">
                    <p className="label-track text-[#C5A059]">{activeChapter.plateCitation}</p>
                    <span className="label-track text-[#8E8E8A]">{activeChapter.plateBadge}</span>
                  </div>

                  {activeChapter.plateImage && (
                    <div className="mt-6 border border-[#444444] bg-[#000000] p-1.5">
                      <img
                        src={activeChapter.plateImage}
                        alt={activeChapter.plateCitation}
                        width={1280}
                        height={720}
                        className="aspect-video w-full object-cover saturate-[0.6] contrast-[1.08]"
                      />
                    </div>
                  )}

                  <blockquote className="mt-6 font-display text-[24px] leading-[1.52] text-[#F5F5F0]">
                    {activeChapter.plateQuotePrefix}
                    <span
                      className="quote-highlight-wrap text-[#F5F5F0]"
                      data-active={highlightSweep ? "true" : "false"}
                    >
                      {activeChapter.plateQuoteHighlighted}
                    </span>
                    {activeChapter.plateQuoteSuffix}
                  </blockquote>

                  <div className="mt-6 flex items-center justify-between border-t border-[#444444] pt-4">
                    <span className="label-track text-[#8E8E8A]">
                      Wilderness · {activeChapter.wildernessDuration}
                    </span>
                    <Link
                      href={`/stories/${activeChapter.dossierSlug}`}
                      className="label-track text-[#C5A059] hover:underline"
                    >
                      Open Full Dossier →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Compact 3-Column Season 1 Verified Dossier Strip */}
          <div className="mt-16">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="label-track text-[#8E8E8A]">
                Opening Season 1 Dossiers · Click any card to inspect primary receipts
              </p>
              <Link href="/stories" className="label-track text-[#C5A059] hover:underline">
                All 14 Season 1 Episodes →
              </Link>
            </div>
            <div className="grid grid-cols-1 border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-[#444444]">
              {openingThree.map((story) => {
                const ep = EPISODES[story.slug];
                return (
                  <button
                    key={story.slug}
                    type="button"
                    onClick={() => setSelectedDossier(story)}
                    className="group flex flex-col justify-between border-b border-[#444444] bg-[#000000] p-6 text-left last:border-b-0 md:border-b-0"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-3xl text-[#C5A059]">{story.no}</span>
                        <span className="label-track text-[#8E8E8A]">
                          {ep?.verified_claims ?? 0} verified receipts
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
                        {story.subject}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#8E8E8A]">{story.fall}</p>
                    </div>
                    <p className="mt-5 label-track text-[#C5A059]">Inspect Citations →</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 04: WILDERNESS REALITY CHECK (OUTCOME: PERSPECTIVE)
          ================================================================= */}
      <WildernessTimeline
        activeChapterSlug={activeChapter.slug}
        highlightedSubjects={activeChapter.highlightedSubjects}
      />

      {/* =================================================================
          SECTION 05: TOMORROW'S PROTOCOL (OUTCOME: CLARITY)
          ================================================================= */}
      <TomorrowsProtocol chapter={activeChapter} />

      {/* =================================================================
          SECTION 06: QUIET WITNESS WALL (OUTCOME: COMMUNITY)
          ================================================================= */}
      <QuietWitnessWall />

      {/* =================================================================
          SECTION 07: SIR K & THREE DOORS (HUMAN ANCHOR & NEXT STEPS)
          ================================================================= */}
      <section
        aria-label="Sir K and Three Doors"
        className="bg-[#000000] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Part A: Host Anchor */}
          <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-12 lg:gap-0">
            <div className="lg:col-span-4 lg:pr-12">
              <div className="mx-auto max-w-[300px] lg:mx-0">
                <div className="flex aspect-[4/5] w-full flex-col items-center justify-between border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6">
                  <div className="flex w-full justify-between label-track text-[#8E8E8A]">
                    <span>4:5</span>
                    <span>4K · 24FPS</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <PhoenixMark size={32} />
                    <p className="label-track text-[#C5A059]">SIR K · STUDIO 01</p>
                    <p className="text-xs leading-relaxed text-[#8E8E8A]">
                      Reserved 4:5 frame for low-key dark studio portrait
                    </p>
                  </div>
                  <div className="w-full border-t border-[#444444] pt-3 text-center label-track text-[#8E8E8A]">
                    DYEGU · {YOUTUBE_HANDLE}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-8 lg:border-l lg:border-[#444444] lg:pl-14">
              <p className="label-track text-[#C5A059]">THE DYEGU RULE · SIR K</p>
              <blockquote className="mt-5 font-display text-[32px] font-medium italic leading-[1.24] text-[#F5F5F0] sm:text-[44px]">
                &ldquo;Sometimes losing the version of your life you outgrew is how you build the
                one that lasts.&rdquo;
              </blockquote>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
                &ldquo;I don&apos;t make these documentaries to tell you everything happens for a
                reason. I make them because when you&apos;re in the wilderness, you deserve to see
                the actual receipts of people who refused to quit—and how they put one brick down
                at a time.&rdquo; <span className="text-[#F5F5F0]">— Sir K</span>
              </p>

              {/* Subtle Studio Mug Preview (Holding all apparel pending trademark clearance) */}
              <div className="mt-8 flex items-center gap-4 border-t border-[#444444] pt-6">
                <div className="h-16 w-16 shrink-0 border border-[rgba(197,160,89,0.60)] bg-[#000000] overflow-hidden">
                  <img
                    src={STUDIO_MUG.image}
                    alt={STUDIO_MUG.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover saturate-[0.75]"
                  />
                </div>
                <div>
                  <p className="label-track text-[#8E8E8A]">Studio Prop · Coming Soon</p>
                  <p className="font-display text-xl text-[#F5F5F0]">
                    {STUDIO_MUG.name}{" "}
                    <span className="text-sm text-[#8E8E8A]">(12oz Matte-Black Ceramic)</span>
                  </p>
                  <Link href="/shop" className="label-track text-[#C5A059] hover:underline">
                    Join Preview List →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Part B: Three Doors (3-column hairline grid, 1px solid #444444) */}
          <div className="grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0">
            {/* Door 01: Watch */}
            <div className="flex flex-col justify-between py-9 md:pr-8">
              <div>
                <PlayCircle className="h-5 w-5 text-[#C5A059]" strokeWidth={1.25} />
                <p className="mt-4 label-track text-[#C5A059]">DOOR 01 · WATCH</p>
                <h3 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0]">
                  The Sunday Screening Ritual
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                  New 25-minute investigative documentaries every Sunday at 15:00 WAT on{" "}
                  {YOUTUBE_HANDLE}.
                </p>
              </div>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={YOUTUBE_SUBSCRIBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-track text-[#C5A059] hover:underline underline-offset-4"
                >
                  Subscribe on YouTube ({YOUTUBE_HANDLE}) →
                </a>
                <button
                  type="button"
                  onClick={() => downloadSundayPremiereIcs()}
                  className="label-track text-left text-[#8E8E8A] hover:text-[#F5F5F0]"
                >
                  Add Sundays (.ics)
                </button>
              </div>
            </div>

            {/* Door 02: Walk Together */}
            <div className="flex flex-col justify-between py-9 md:px-8">
              <div>
                <Users className="h-5 w-5 text-[#C5A059]" strokeWidth={1.25} />
                <p className="mt-4 label-track text-[#C5A059]">DOOR 02 · WALK TOGETHER</p>
                <h3 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0]">
                  Founding Rebuild Circles
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                  Small, peer-led rooms of 6–8 people navigating your exact chapter in your
                  timezone. Zero pitching, strictly confidential. Opening January 2027.
                </p>
              </div>
              <div className="mt-7">
                <Link
                  href={`/community/circles?stage=${activeChapter.stageKey}`}
                  className="label-track text-[#C5A059] hover:underline underline-offset-4"
                >
                  Join the Founding Cohort Waitlist →
                </Link>
              </div>
            </div>

            {/* Door 03: Stand Behind the Work */}
            <div className="flex flex-col justify-between py-9 md:pl-8">
              <div>
                <HeartHandshake className="h-5 w-5 text-[#C5A059]" strokeWidth={1.25} />
                <p className="mt-4 label-track text-[#C5A059]">DOOR 03 · STAND BEHIND THE WORK</p>
                <h3 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0]">
                  Practitioners &amp; Institutional Allies
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                  For vetted therapists, mentors, coaches, NGOs, and organizations looking to
                  contribute pitch-free guidance or bring DYEGU screenings to teams in transition.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => openAllyDrawer("practitioners")}
                  className="label-track text-[#C5A059] hover:underline underline-offset-4"
                >
                  Enter the Ally Desk →
                </button>
                <Link href="/allies" className="label-track text-[#8E8E8A] hover:text-[#F5F5F0]">
                  /allies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4s Title Ident Lightbox Modal */}
      {identOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="DYEGU Official 4-Second Title Ident"
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
                className="border border-[#444444] p-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
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
                0–0.8s Hairline · 0.8–3.2s Rising Phoenix · 4.0s Void Hold
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
    </>
  );
}
