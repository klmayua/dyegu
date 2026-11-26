"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { PhoenixMark } from "./BrandMarks";
import { EPISODES, STORIES } from "@/lib/dyegu-data";
import { SOFT, lockPageScroll } from "./MotionPrimitives";

interface StandardsModalProps {
  open: boolean;
  onClose: () => void;
}

export function StandardsModal({ open, onClose }: StandardsModalProps) {
  const still = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockPageScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const audited = STORIES.filter((s) => s.livePage);
  const totalClaims = audited.reduce(
    (acc, s) => acc + (EPISODES[s.slug]?.verified_claims ?? 0),
    0
  );
  const totalSources = audited.reduce(
    (acc, s) => acc + (EPISODES[s.slug]?.source_count ?? 0),
    0
  );
  const totalHeld = audited.reduce((acc, s) => acc + (EPISODES[s.slug]?.held_back ?? 0), 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="DYEGU Verification and Research Standards"
          data-lenis-prevent
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: SOFT }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/90 backdrop-blur-sm p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-lenis-prevent
            initial={still ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={still ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: SOFT }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[rgba(197,160,89,0.60)] bg-[#000000] p-7 sm:p-10"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#444444] pb-4">
              <div className="flex items-center gap-3">
                <PhoenixMark size={18} />
                <span className="label-track text-[#C5A059]">
                  Verification &amp; Research Standards
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close standards modal"
                className="border border-[#444444] p-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </div>

            <h2 className="mt-6 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
              Every claim checked against primary records.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
              Every DYEGU episode undergoes a structured primary-source audit (minimum 12–18
              verified claims per episode; currently{" "}
              <span className="text-[#F5F5F0]">{totalClaims} verified claims</span> across{" "}
              <span className="text-[#F5F5F0]">{totalSources} published sources</span> in Episodes
              01–03, with{" "}
              <span className="text-[#F5F5F0]">{totalHeld} unconfirmed claim held back</span>).
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 border-y border-[#444444] py-6 sm:grid-cols-3">
              <div>
                <span className="label-track text-[#C5A059]">[V] Primary Record</span>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E8A]">
                  SEC / S-1 filings, corporate releases, court records, and contemporary
                  date-stamped wire archives.
                </p>
              </div>
              <div>
                <span className="label-track text-[#C5A059]">[E] Reporting</span>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E8A]">
                  Corroborated journalism, museum archives, and cross-checked historical accounts.
                </p>
              </div>
              <div>
                <span className="label-track text-[#C5A059]">[T] Testimony</span>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E8A]">
                  Commencement addresses, long-form interviews, and memoirs—always attributed
                  cleanly.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 border border-[#444444] p-4">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]"
                strokeWidth={1.25}
              />
              <div className="text-xs leading-relaxed text-[#8E8E8A]">
                <p className="label-track text-[#F5F5F0] mb-1">
                  Transparent AI-Assisted Archival Indexing
                </p>
                DYEGU uses AI assistance during early archival discovery and chronology indexing.
                Zero unverified assertions ever enter a script—every narrated claim is manually
                checked against a live primary source URL published openly on each episode dossier.
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#444444] pt-5">
              <Link
                href="/standards"
                onClick={onClose}
                className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Read Full Editorial Charter (/standards) →
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="label-track text-[#8E8E8A] hover:text-[#F5F5F0]"
              >
                Return to Screening Room
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
