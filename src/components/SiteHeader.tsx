"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLockup, PhoenixMark } from "./BrandMarks";
import { downloadSundayPremiereIcs, getGoogleCalendarUrl } from "@/lib/calendar";
import { YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";

const NAV_ITEMS = [
  { href: "/stories", label: "Stories" },
  { href: "/#comeback-file", label: "The Comeback File" },
  { href: "/community", label: "Community" },
  { href: "/standards", label: "Standards" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Zero-nav mode strictly for /reset social squeeze page
  if (pathname === "/reset") {
    return (
      <header className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-[#444444]">
        <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-center px-6">
          <Link href="/" aria-label="DYEGU Home">
            <BrandLockup size="md" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#000000]/95 backdrop-blur-md border-b border-[#444444]">
        <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between gap-6 px-6">
          <Link href="/" aria-label="DYEGU Home" className="py-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#C5A059]">
            <BrandLockup size="md" />
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href !== "/#comeback-file" &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`label-track transition-colors ${
                    active ? "text-[#C5A059]" : "text-[#F5F5F0]/80 hover:text-[#C5A059]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="label-track border border-[#C5A059] bg-[#000000] px-4 py-2.5 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000]"
            >
              Premiere · Dec 6
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden label-track border border-[#444444] px-3 py-2.5 text-[#F5F5F0]"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="md:hidden border-t border-[#444444] bg-[#000000] px-6 py-4"
          >
            <div className="flex flex-col divide-y divide-[#444444]/60">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="label-track py-3.5 text-[#F5F5F0] hover:text-[#C5A059]"
                >
                  {item.label}
                </Link>
              ))}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/90 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCalendarOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg border border-[rgba(197,160,89,0.60)] bg-[#000000] p-8">
            <button
              type="button"
              onClick={() => setCalendarOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 border border-[#444444] px-2.5 py-1 text-sm text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              ×
            </button>
            <div className="mb-5 flex items-center gap-3">
              <PhoenixMark size={20} />
              <span className="label-track text-[#C5A059]">Season 1 Premiere Ritual</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-[#F5F5F0]">
              Sunday, 6 December 2026
            </h2>
            <p className="mt-2 label-track text-[#8E8E8A]">
              15:00 WAT · 14:00 GMT · 09:00 ET · 14 Consecutive Sundays
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/80">
              Episode 01 (<span className="text-[#F5F5F0]">Steve Jobs</span>) premieres free on
              YouTube (<span className="text-[#C5A059]">{YOUTUBE_HANDLE}</span>). Add the recurring
              Sunday series to your calendar.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  downloadSundayPremiereIcs();
                }}
                className="label-track flex-1 border border-[#C5A059] bg-[#C5A059] px-5 py-3.5 text-center text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059]"
              >
                Download Recurring .ICS
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
                Subscribe on YouTube ({YOUTUBE_HANDLE}) →
              </a>
              <Link
                href="/#comeback-file"
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
