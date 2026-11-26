"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Calendar, Menu, Play, X } from "lucide-react";
import { BrandLockup, PhoenixMark } from "./BrandMarks";
import { downloadSundayPremiereIcs, getGoogleCalendarUrl } from "@/lib/calendar";
import { PREMIERE_ISO, YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";
import { useDyeguModals } from "./ModalContext";
import { lockPageScroll } from "./MotionPrimitives";

export function SiteHeader() {
  const pathname = usePathname();
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { openStandardsModal, openAllyDrawer } = useDyeguModals();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(Date.now() >= new Date(PREMIERE_ISO).getTime());
  }, []);

  useEffect(() => {
    if (!calendarOpen) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCalendarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockPageScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [calendarOpen]);

  if (pathname === "/reset") {
    return (
      <header className="sticky top-0 z-50 h-[72px] bg-[#000000]/95 backdrop-blur-md border-b border-[#444444]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-center px-6">
          <Link href="/" aria-label="DYEGU Home">
            <BrandLockup size="md" />
          </Link>
        </div>
      </header>
    );
  }

  function handlePreLaunchHeaderCta() {
    downloadSundayPremiereIcs();
    setCalendarOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] bg-[#000000]/95 backdrop-blur-md border-b border-[#444444]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-6 px-6">
          <Link
            href="/"
            aria-label="DYEGU Home"
            className="py-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#C5A059]"
          >
            <BrandLockup size="md" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            <Link
              href="/#threshold"
              className="label-track text-[#F5F5F0]/80 transition-colors hover:text-[#C5A059]"
            >
              Tomorrow&apos;s Protocol
            </Link>
            <Link
              href="/#episodes"
              className={`label-track transition-colors ${
                pathname.startsWith("/stories")
                  ? "text-[#C5A059]"
                  : "text-[#F5F5F0]/80 hover:text-[#C5A059]"
              }`}
            >
              Episodes
            </Link>
            <Link
              href="/#field-note"
              className="label-track text-[#F5F5F0]/80 transition-colors hover:text-[#C5A059]"
            >
              The Comeback File
            </Link>
            <button
              type="button"
              onClick={openStandardsModal}
              className={`label-track transition-colors ${
                pathname === "/standards"
                  ? "text-[#C5A059]"
                  : "text-[#F5F5F0]/80 hover:text-[#C5A059]"
              }`}
            >
              Standards
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isLive ? (
              <Link
                href="/#episodes"
                className="label-track inline-flex items-center gap-2 border border-[#C5A059] bg-[#C5A059] px-4 py-2.5 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
              >
                <Play className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Watch Ep 01</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handlePreLaunchHeaderCta}
                className="label-track inline-flex items-center gap-2 border border-[#C5A059] bg-[#000000] px-4 py-2.5 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
              >
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.25} />
                <span>Premiere · Dec 6</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              className="lg:hidden border border-[#444444] p-2 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" strokeWidth={1.25} />
              ) : (
                <Menu className="h-4 w-4" strokeWidth={1.25} />
              )}
            </button>
          </div>
        </div>

        {/* 1px #C5A059 Scroll Progress Hairline (modeled on UcheChineke SiteNav) */}
        {!still && (
          <motion.span
            aria-hidden="true"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            className="pointer-events-none absolute inset-x-0 -bottom-px block h-px bg-[#C5A059]"
          />
        )}

        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="lg:hidden border-b border-[#444444] bg-[#000000] px-6 py-4"
          >
            <div className="flex flex-col divide-y divide-[#444444]/60">
              <Link
                href="/#threshold"
                onClick={() => setMobileOpen(false)}
                className="label-track py-3.5 text-[#F5F5F0] hover:text-[#C5A059]"
              >
                Tomorrow&apos;s Protocol
              </Link>
              <Link
                href="/#episodes"
                onClick={() => setMobileOpen(false)}
                className="label-track py-3.5 text-[#F5F5F0] hover:text-[#C5A059]"
              >
                Episodes
              </Link>
              <Link
                href="/#field-note"
                onClick={() => setMobileOpen(false)}
                className="label-track py-3.5 text-[#F5F5F0] hover:text-[#C5A059]"
              >
                The Comeback File
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openStandardsModal();
                }}
                className="label-track py-3.5 text-left text-[#F5F5F0] hover:text-[#C5A059]"
              >
                Standards
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openAllyDrawer("practitioners");
                }}
                className="label-track py-3.5 text-left text-[#8E8E8A] hover:text-[#C5A059]"
              >
                Open the Ally Desk →
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Premiere · Dec 6 Calendar & Ritual Modal */}
      {calendarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Season 1 Premiere Calendar"
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/90 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCalendarOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg border border-[rgba(197,160,89,0.60)] bg-[#000000] p-8">
            <button
              type="button"
              onClick={() => setCalendarOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 border border-[#444444] p-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              <X className="h-4 w-4" strokeWidth={1.25} />
            </button>
            <div className="mb-5 flex items-center gap-3">
              <PhoenixMark size={20} />
              <span className="label-track text-[#C5A059]">Season 1 Premiere Ritual</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-[#F5F5F0]">
              Sunday, 6 December 2026
            </h2>
            <p className="mt-2 label-track text-[#8E8E8A]">
              15:00 WAT · 14:00 GMT · 09:00 ET · Recurring 14 Sundays
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/80">
              Your recurring Sunday `.ics` calendar file has been downloaded. Episode 01 (
              <span className="text-[#F5F5F0]">Steve Jobs</span>) premieres free on YouTube (
              <span className="text-[#C5A059]">{YOUTUBE_HANDLE}</span>).
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => downloadSundayPremiereIcs()}
                className="label-track flex-1 border border-[#C5A059] bg-[#C5A059] px-5 py-3.5 text-center text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Download .ICS Again
              </button>
              <a
                href={getGoogleCalendarUrl("DYEGU Episode 01 Premiere: Steve Jobs")}
                target="_blank"
                rel="noopener noreferrer"
                className="label-track flex-1 border border-[#444444] px-5 py-3.5 text-center text-[#F5F5F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]"
              >
                Google Calendar
              </a>
            </div>
            <div className="mt-5 border-t border-[#444444] pt-4 flex items-center justify-between gap-4">
              <a
                href={YOUTUBE_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="label-track text-[#C5A059] hover:underline"
              >
                Subscribe ({YOUTUBE_HANDLE}) →
              </a>
              <Link
                href="/#field-note"
                onClick={() => setCalendarOpen(false)}
                className="label-track text-[#8E8E8A] hover:text-[#F5F5F0]"
              >
                Sunday Email →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
