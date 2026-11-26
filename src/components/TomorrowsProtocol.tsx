"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Anchor,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  FileSpreadsheet,
  Footprints,
  Heart,
  Lock,
  PenLine,
  PhoneCall,
  Shield,
  Sunrise,
} from "lucide-react";
import type { MasterChapter, ProtocolIconName } from "@/lib/chapters-data";
import { SubscribeForm } from "./SubscribeForm";

const CINEMA_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ProtocolIcon({ name }: { name: ProtocolIconName }) {
  const props = { className: "h-5 w-5 text-[#C5A059]", strokeWidth: 1.25 };
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
    default:
      return <Shield {...props} />;
  }
}

export function TomorrowsProtocol({ chapter }: { chapter: MasterChapter }) {
  const prefersReduced = useReducedMotion();
  const storageKey = `dyegu_bench_${chapter.slug}`;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(storageKey) || "";
      setNote(existing);
      setSaved(Boolean(existing.trim()));
      if (existing.trim()) setDrawerOpen(true);
    } catch {
      setNote("");
    }
  }, [storageKey]);

  function handleNoteChange(val: string) {
    setNote(val);
    try {
      if (val.trim()) {
        localStorage.setItem(storageKey, val);
        setSaved(true);
      } else {
        localStorage.removeItem(storageKey);
        setSaved(false);
      }
    } catch {
      // ignore
    }
  }

  return (
    <section
      id="protocol"
      aria-label="Tomorrow Morning Protocol"
      className="bg-[#000000] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <p className="label-track text-[#C5A059]">
            CLARITY FOR TOMORROW MORNING · {chapter.shortLabel}
          </p>
          <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
            Three quiet moves before noon.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
            When everything feels heavy, do not try to solve the next five years tonight. Just win
            tomorrow morning.
          </p>
        </div>

        {/* 3-Column Hairline Grid — Cross-fades smoothly on chapter change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.slug}
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: CINEMA_EASE }}
            className="mt-12 grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0"
          >
            {chapter.protocolSteps.map((item) => (
              <div key={item.step} className="py-8 md:px-7 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-3">
                  <ProtocolIcon name={item.icon} />
                  <span className="label-track text-[#C5A059]">{item.step}</span>
                </div>
                <p className="mt-5 text-sm leading-[1.75] text-[#F5F5F0]/85">{item.text}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Collapsible Private 7:00 AM Note Drawer (localStorage only) */}
        <div className="mt-8 border border-[#444444] bg-[#000000]">
          <button
            type="button"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:border-[#C5A059]"
          >
            <span className="flex items-center gap-3">
              <Lock className="h-4 w-4 shrink-0 text-[#C5A059]" strokeWidth={1.25} />
              <span className="label-track text-[#F5F5F0]">
                Optional: Write a private 7:00 AM note to yourself
              </span>
              {saved && (
                <span className="label-track text-[#C5A059] hidden sm:inline">
                  · Saved locally
                </span>
              )}
            </span>
            {drawerOpen ? (
              <ChevronUp className="h-4 w-4 text-[#8E8E8A]" strokeWidth={1.25} />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#8E8E8A]" strokeWidth={1.25} />
            )}
          </button>

          {drawerOpen && (
            <div className="border-t border-[#444444] px-6 py-5">
              <label htmlFor="private-7am-note" className="sr-only">
                Private 7:00 AM note
              </label>
              <textarea
                id="private-7am-note"
                rows={3}
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="One sentence you want to remember tomorrow morning. (Stays strictly in your browser—never uploaded.)"
                className="w-full border border-[#444444] bg-[#000000] p-4 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8E8E8A]">
                <span>
                  Stays strictly in your browser—never uploaded. Automatically printed on your
                  1-Page Field Note.
                </span>
                {note.trim() && (
                  <button
                    type="button"
                    onClick={() => handleNoteChange("")}
                    className="label-track text-[#8E8E8A] hover:text-[#C5A059]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1-Page Field Note Conversion Bar */}
        <div
          id="field-note"
          className="mt-10 border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="label-track text-[#C5A059]">The Comeback File · Sundays</p>
              <h3 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
                Take this protocol offline tonight.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Download the printable 1-Page Wilderness Field Note tailored to your chapter—plus
                The Comeback File, one quiet documented story in your inbox every Sunday.
              </p>
            </div>
            <div className="lg:col-span-6">
              <SubscribeForm
                stage={chapter.stageKey}
                chapterSlug={chapter.slug}
                buttonLabel="Send My 1-Page Field Note →"
                placeholder="Your email address"
                finePrint="Zero spam. Zero hustle sermons. Unsubscribe in 1 click."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
