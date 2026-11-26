"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Clock,
  CloudFog,
  Compass,
  DoorClosed,
  Flame,
  HeartCrack,
  HeartHandshake,
  PlayCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  PREMIERE_ISO,
  STORIES,
  STUDIO_MUG,
  YOUTUBE_HANDLE,
  YOUTUBE_SUBSCRIBE_URL,
  type StoryMeta,
} from "@/lib/dyegu-data";
import {
  MASTER_CHAPTERS,
  resolveMasterChapter,
  type ChapterIconName,
  type MasterChapter,
} from "@/lib/chapters-data";
import { downloadSundayPremiereIcs, formatLocalBroadcastTime } from "@/lib/calendar";
import { PhoenixMark } from "./BrandMarks";
import { DossierDrawer } from "./DossierDrawer";
import { WildernessTimeline } from "./WildernessTimeline";
import { QuietWitnessWall } from "./QuietWitnessWall";
import { ChapterRoomModal } from "./ChapterRoomModal";
import { EpisodeStack } from "./EpisodeStack";
import { SubscribeForm } from "./SubscribeForm";
import { useDyeguModals } from "./ModalContext";
import {
  MaskedHeadline,
  OpeningCurtain,
  Reveal,
  SOFT,
  ScrollStatement,
  StaggerItem,
  StaggerList,
  lockPageScroll,
} from "./MotionPrimitives";

function ChapterIcon({ name }: { name: ChapterIconName }) {
  const props = {
    className:
      "h-4 w-4 shrink-0 text-[#C5A059]/80 transition-transform duration-300 group-hover:text-[#C5A059] group-hover:-translate-y-0.5",
    strokeWidth: 1.25,
  };
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
  const still = useReducedMotion();
  const { openAllyDrawer } = useDyeguModals();

  const [openChapter, setOpenChapter] = useState<MasterChapter | null>(null);
  const [selectedDossier, setSelectedDossier] = useState<StoryMeta | null>(null);
  const [identOpen, setIdentOpen] = useState(false);
  const [identKey, setIdentKey] = useState(0);
  const [localTime, setLocalTime] = useState<string | null>(null);

  const openingThree = STORIES.filter((s) => s.livePage);

  // If visitor arrives via a deep-linked ?chapter=slug share link, open that chapter room directly
  useEffect(() => {
    setLocalTime(formatLocalBroadcastTime(PREMIERE_ISO));
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const raw = p.get("chapter") || p.get("stage");
      if (raw) {
        setOpenChapter(resolveMasterChapter(raw));
      }
    }
  }, []);

  useEffect(() => {
    if (!identOpen) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdentOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockPageScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [identOpen]);

  function handleOpenChapter(ch: MasterChapter) {
    setOpenChapter(ch);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("chapter", ch.slug);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function handleCloseChapter() {
    setOpenChapter(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("chapter");
      url.searchParams.delete("stage");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function handleInspectDossierBySlug(slug: string) {
    const matched = openingThree.find((s) => s.slug === slug) ?? openingThree[0];
    setSelectedDossier(matched);
  }

  return (
    <>
      {/* Once-per-visit cinema curtain (lifts smoothly upward on load) */}
      <OpeningCurtain />

      {/* =================================================================
          ACT 1: THE SCREENING ROOM HERO (PEACE — CLEAN & DIRECT)
          ================================================================= */}
      <section
        aria-label="Hero"
        className="bg-[#000000] border-b border-[#444444] py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mx-auto max-w-[820px] text-center">
            <motion.div
              initial={still ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: still ? 0 : 0.1, ease: SOFT }}
              className="mb-7 flex flex-col items-center gap-3.5"
            >
              <PhoenixMark size={38} />
              <p className="label-track text-[#C5A059]">
                DON&apos;T YOU EVER GIVE UP · {YOUTUBE_HANDLE}
              </p>
            </motion.div>

            <MaskedHeadline
              delayBase={0.2}
              className="font-display text-[50px] font-medium leading-[0.98] tracking-[-0.015em] text-[#F5F5F0] sm:text-[72px] lg:text-[90px]"
              lines={[
                { text: "Everything broke." },
                { text: "Your story didn't.", gold: true },
              ]}
            />

            <motion.p
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: still ? 0 : 0.45, ease: SOFT }}
              className="mx-auto mt-7 max-w-[56ch] text-base leading-[1.76] text-[#F5F5F0]/80 sm:text-[18px]"
            >
              Just came over from a video—or arrived here tonight in the middle of a hard season?
              Pick the line that sounds like your week below. Your tailored 3-step morning protocol
              and 1-page Field Note open immediately.
            </motion.p>

            <motion.div
              initial={still ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: still ? 0 : 0.6, ease: SOFT }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <a
                  href="#threshold"
                  className="label-track inline-flex w-full items-center justify-center gap-2 border border-[#C5A059] bg-[#C5A059] px-7 py-4 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059] sm:w-auto"
                >
                  <span>Where are you standing tonight? ↓</span>
                </a>
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
              <button
                type="button"
                onClick={() => downloadSundayPremiereIcs()}
                className="label-track inline-flex items-center gap-2 text-[#8E8E8A] hover:text-[#C5A059]"
              >
                <Bell className="h-3.5 w-3.5 text-[#C5A059]" strokeWidth={1.25} />
                <span>
                  Premiere · Sun 6 Dec · 15:00 WAT
                  {localTime ? ` (${localTime} your time)` : ""} · Add .ICS
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================================================================
          ACT 2: INTERACTIVE CHAPTER ROOMS (FLOWS IN 1-BY-1 · OPENS AT ONCE!)
          ================================================================= */}
      <section
        id="threshold"
        aria-label="Pick the line that sounds like your week"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="label-track text-[#C5A059]">
                STEP 01 · CLARITY FOR TOMORROW MORNING
              </p>
              <h2 className="mt-3 font-display text-[38px] font-medium leading-[1.05] text-[#F5F5F0] sm:text-[50px]">
                Pick the line that sounds like your week.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#8E8E8A]">
              Tap any line to open its tailored 3-step morning protocol, private 7:00 AM scratchpad,
              and printable 1-Page Field Note immediately.
            </p>
          </Reveal>

          {/* 8 Lines Flow In One at a Time — Clicking Opens ChapterRoomModal Right Away */}
          <StaggerList
            gap={0.065}
            className="mt-12 grid grid-cols-1 gap-x-10 border-t border-b border-[#444444] md:grid-cols-2"
          >
            {MASTER_CHAPTERS.map((ch, idx) => (
              <StaggerItem
                key={ch.slug}
                className="border-b border-[#444444] last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => handleOpenChapter(ch)}
                  className="group flex w-full items-start justify-between gap-4 py-6 text-left transition-all hover:pl-2"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="mt-1.5">
                      <ChapterIcon name={ch.icon} />
                    </span>
                    <div className="min-w-0">
                      <span className="label-track text-[#8E8E8A]">
                        {String(idx + 1).padStart(2, "0")} · {ch.shortLabel}
                      </span>
                      <span className="mt-1.5 block font-display text-[23px] font-medium leading-snug text-[#F5F5F0] transition-colors group-hover:text-[#C5A059]">
                        {ch.line}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#8E8E8A]">
                        {ch.subtext}
                      </span>
                    </div>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1 label-track text-[#C5A059] opacity-75 transition-opacity group-hover:opacity-100">
                    <span className="hidden sm:inline">Open</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.35} />
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerList>

          {/* Ally Threshold Row */}
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-between gap-4 border-b border-[#444444] py-5 sm:flex-row sm:items-center">
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
          </Reveal>
        </div>
      </section>

      {/* =================================================================
          ACT 3: SCROLL-PACED STATEMENT + WILDERNESS TIMELINE (PERSPECTIVE)
          ================================================================= */}
      <section
        aria-label="Perspective and Wilderness Timeline"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <ScrollStatement
            eyebrow="PERSPECTIVE · WHY YEAR TWO FEELS PERMANENT"
            text="Social media compresses ten-year rebuilds into sixty-second clips. Every real comeback on record took between twenty-eight months and twenty years. You are not behind—you are in the middle."
          />

          <div className="mt-16 border-t border-[#444444] pt-14">
            <WildernessTimeline embedded />
          </div>
        </div>
      </section>

      {/* =================================================================
          ACT 4: ONE SINGLE EPISODES SECTION (STICKY-STACKING CASE STUDY CARDS)
          Explicitly for visitors who haven't watched on YouTube yet!
          ================================================================= */}
      <section
        id="episodes"
        aria-label="Season 1 Documentaries"
        className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="label-track text-[#C5A059]">
                NEW HERE? · SEASON 1 DOCUMENTARIES
              </p>
              <h2 className="mt-3 font-display text-[38px] font-medium leading-[1.05] text-[#F5F5F0] sm:text-[52px]">
                Haven&apos;t watched the films yet?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
                If you arrived from elsewhere and haven&apos;t seen the documentaries on{" "}
                {YOUTUBE_HANDLE}, start with any opening dossier below. Click a card to inspect the
                primary filings or read the full verified chronology.
              </p>
            </div>
            <Link
              href="/stories"
              className="label-track shrink-0 text-[#C5A059] hover:underline underline-offset-4"
            >
              Browse All 14 Season 1 Episodes →
            </Link>
          </Reveal>

          <EpisodeStack onSelectStory={(s) => setSelectedDossier(s)} />
        </div>
      </section>

      {/* =================================================================
          ACT 5: QUIET WITNESS WALL (COMMUNITY — FLOWS IN ONE AT A TIME)
          ================================================================= */}
      <QuietWitnessWall />

      {/* =================================================================
          ACT 6: SIR K, 1-PAGE FIELD NOTE CAPTURE & THREE DOORS
          ================================================================= */}
      <section
        aria-label="Sir K, The Comeback File, and Three Doors"
        className="bg-[#000000] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Host Anchor */}
          <Reveal className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-12 lg:gap-0">
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

              {/* Studio Mug Preview (Holding apparel pending trademark clearance) */}
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
          </Reveal>

          {/* 1-Page Field Note & Comeback File Capture */}
          <Reveal className="mb-14 border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-10">
            <div id="field-note" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="label-track text-[#C5A059]">The Comeback File · Free Every Sunday</p>
                <h2 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
                  Take the 1-Page Field Note offline tonight.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                  Download the printable Wilderness Field Note immediately—plus one quiet,
                  primary-sourced comeback story in your inbox every Sunday.
                </p>
              </div>
              <div className="lg:col-span-6">
                <SubscribeForm
                  buttonLabel="Send My 1-Page Field Note →"
                  placeholder="Your email address"
                  finePrint="Zero spam. Zero hustle sermons. Unsubscribe in 1 click."
                />
              </div>
            </div>
          </Reveal>

          {/* Three Doors Flowing In One at a Time */}
          <StaggerList
            gap={0.09}
            className="grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0"
          >
            <StaggerItem className="flex flex-col justify-between py-9 md:pr-8">
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
            </StaggerItem>

            <StaggerItem className="flex flex-col justify-between py-9 md:px-8">
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
                  href="/community/circles"
                  className="label-track text-[#C5A059] hover:underline underline-offset-4"
                >
                  Join the Founding Cohort Waitlist →
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem className="flex flex-col justify-between py-9 md:pl-8">
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
            </StaggerItem>
          </StaggerList>
        </div>
      </section>

      {/* Instant-Open Chapter Protocol Room Modal (Opens right away on click!) */}
      <ChapterRoomModal
        chapter={openChapter}
        onClose={handleCloseChapter}
        onInspectDossier={handleInspectDossierBySlug}
      />

      {/* Slide-Over Investigative Dossier Drawer */}
      <DossierDrawer story={selectedDossier} onClose={() => setSelectedDossier(null)} />

      {/* 4s Title Ident Lightbox Modal */}
      {identOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="DYEGU Official 4-Second Title Ident"
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/95 p-5"
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
    </>
  );
}
