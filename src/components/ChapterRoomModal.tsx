"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Anchor,
  BookOpen,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  Footprints,
  Heart,
  Lock,
  PenLine,
  PhoneCall,
  Share2,
  Shield,
  Sunrise,
  X,
} from "lucide-react";
import type { MasterChapter, ProtocolIconName } from "@/lib/chapters-data";
import { SOFT, StaggerItem, StaggerList, lockPageScroll } from "./MotionPrimitives";
import { SubscribeForm } from "./SubscribeForm";

function ProtocolIcon({ name }: { name: ProtocolIconName }) {
  const props = { className: "h-4 w-4 text-[#C5A059] shrink-0", strokeWidth: 1.25 };
  switch (name) {
    case "Sunrise":
      return <Sunrise {...props} />;
    case "Shield":
      return <Shield {...props} />;
    case "Footprints":
      return <Footprints {...props} />;
    case "FileSpreadsheet":
      return <FileSpreadsheet {...props} />;
    case "PhoneCall":
      return <PhoneCall {...props} />;
    case "Compass":
      return <Compass {...props} />;
    case "BookOpen":
      return <BookOpen {...props} />;
    case "Anchor":
      return <Anchor {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "Clock":
      return <Clock {...props} />;
    case "PenLine":
      return <PenLine {...props} />;
  }
}

interface ChapterRoomModalProps {
  chapter: MasterChapter | null;
  onClose: () => void;
  onInspectDossier: (dossierSlug: string) => void;
}

/**
 * Opens IMMEDIATELY when a visitor clicks any of the 8 life-chapter lines.
 * Pure #000000 self-contained room (modeled on UcheChineke's DocReader modal):
 * 1) Calm 2nd-person recognition & historical parallel
 * 2) Tomorrow Morning Protocol (3 steps before noon, staggered in one by one)
 * 3) Private 7:00 AM browser-only note (localStorage)
 * 4) Instant 1-Page Field Note email download + Quiet Share (?chapter=slug & WhatsApp)
 */
export function ChapterRoomModal({
  chapter,
  onClose,
  onInspectDossier,
}: ChapterRoomModalProps) {
  const still = useReducedMotion();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!chapter) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    try {
      const existing = localStorage.getItem(`dyegu_bench_${chapter.slug}`) || "";
      setNote(existing);
      setSaved(Boolean(existing.trim()));
    } catch {
      setNote("");
    }
    setCopied(false);

    return () => {
      lockPageScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [chapter, onClose]);

  function handleNoteChange(val: string) {
    if (!chapter) return;
    setNote(val);
    try {
      if (val.trim()) {
        localStorage.setItem(`dyegu_bench_${chapter.slug}`, val);
        setSaved(true);
      } else {
        localStorage.removeItem(`dyegu_bench_${chapter.slug}`);
        setSaved(false);
      }
    } catch {
      // ignore
    }
  }

  function getDeepLink(): string {
    if (!chapter || typeof window === "undefined") return "https://dyegu.co";
    return `${window.location.origin}/?chapter=${chapter.slug}`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getDeepLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  }

  function shareWhatsApp() {
    const msg = `Thinking of you today. Came across this quiet protocol for people walking through a hard week—zero hype: ${getDeepLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatePresence>
      {chapter && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Chapter Room: ${chapter.shortLabel}`}
          data-lenis-prevent
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: SOFT }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/85 backdrop-blur-sm p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={still ? false : { opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={still ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.45, ease: SOFT }}
            className="relative flex max-h-[92vh] w-full max-w-[960px] flex-col border border-[rgba(197,160,89,0.60)] bg-[#000000]"
          >
            {/* Sticky Modal Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-[#444444] px-6 py-4 sm:px-8">
              <div className="min-w-0">
                <p className="label-track text-[#C5A059] truncate">
                  {chapter.shortLabel} · Historical Parallel: {chapter.mirrorSubject} (
                  {chapter.wildernessDuration})
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={copyLink}
                  className="hidden sm:inline-flex label-track items-center gap-1.5 border border-[#444444] px-3 py-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  <Share2 className="h-3.5 w-3.5" strokeWidth={1.25} />
                  <span>{copied ? "Link Copied" : "Share"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close chapter room"
                  className="border border-[#444444] p-2 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  <X className="h-4 w-4" strokeWidth={1.25} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-6 py-7 sm:px-9 sm:py-9 space-y-9"
            >
              {/* 1. Immediate Recognition */}
              <div>
                <h2 className="font-display text-3xl font-medium leading-[1.08] text-[#F5F5F0] sm:text-5xl">
                  {chapter.line}
                </h2>
                <p className="mt-5 font-display text-[21px] leading-[1.56] text-[#F5F5F0]/88 max-w-3xl">
                  {chapter.mirrorNarrative}
                </p>
              </div>

              {/* 2. Tomorrow Morning Protocol (Staggers in 1-2-3 immediately on open) */}
              <div>
                <p className="label-track text-[#C5A059]">
                  TOMORROW MORNING PROTOCOL · THREE QUIET MOVES BEFORE NOON
                </p>
                <StaggerList
                  immediate
                  gap={0.09}
                  className="mt-4 grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0"
                >
                  {chapter.protocolSteps.map((step) => (
                    <StaggerItem
                      key={step.step}
                      className="py-6 md:px-6 md:first:pl-0 md:last:pr-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <ProtocolIcon name={step.icon} />
                        <span className="label-track text-[#C5A059]">{step.step}</span>
                      </div>
                      <p className="mt-3.5 text-sm leading-relaxed text-[#F5F5F0]/85">
                        {step.text}
                      </p>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>

              {/* 3. Private 7:00 AM Note (LocalStorage Only) */}
              <div className="border border-[#444444] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 label-track text-[#F5F5F0]">
                    <Lock className="h-3.5 w-3.5 text-[#C5A059]" strokeWidth={1.25} />
                    <span>Private 7:00 AM Note (Stays in your browser · Never uploaded)</span>
                  </span>
                  {saved && <span className="label-track text-[#C5A059]">Saved locally</span>}
                </div>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder={`${chapter.privateNotePrompt} (Auto-populates your printable Field Note.)`}
                  className="w-full border border-[#444444] bg-[#000000] p-3.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* 4. Custom 1-Page Field Note Download + Quiet Share */}
              <div className="border border-[rgba(197,160,89,0.60)] p-6">
                <p className="label-track text-[#C5A059]">
                  Take This Protocol Offline Tonight
                </p>
                <p className="mt-2 mb-4 text-sm text-[#8E8E8A]">
                  Open your printable 1-Page Wilderness Field Note tailored to{" "}
                  <span className="text-[#F5F5F0]">{chapter.shortLabel}</span> + receive one quiet
                  Sunday dispatch in The Comeback File.
                </p>
                <SubscribeForm
                  stage={chapter.stageKey}
                  chapterSlug={chapter.slug}
                  buttonLabel="Send My 1-Page Field Note →"
                  finePrint="Zero spam. Instant printable sheet + Sunday Comeback File."
                />
              </div>
            </div>

            {/* Pinned Modal Footer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#444444] px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  const slug = chapter.dossierSlug;
                  onClose();
                  onInspectDossier(slug);
                }}
                className="label-track inline-flex items-center gap-2 text-[#C5A059] hover:underline"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.25} />
                <span>Inspect {chapter.mirrorSubject} Primary Receipts →</span>
              </button>

              <div className="flex flex-wrap items-center gap-4 label-track">
                <Link
                  href={`/field-note?chapter=${chapter.slug}`}
                  onClick={onClose}
                  className="text-[#F5F5F0] hover:text-[#C5A059]"
                >
                  Open Printable Sheet
                </Link>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="text-[#8E8E8A] hover:text-[#C5A059]"
                >
                  Send via WhatsApp →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
