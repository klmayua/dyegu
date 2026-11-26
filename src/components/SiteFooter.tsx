"use client";

import React from "react";
import Link from "next/link";
import { BrandLockup } from "./BrandMarks";
import {
  SUPPORT_URL,
  YOUTUBE_HANDLE,
  YOUTUBE_URL,
  INSTAGRAM_URL,
  X_URL,
  FACEBOOK_URL,
} from "@/lib/dyegu-data";
import { useDyeguModals } from "./ModalContext";

export function SiteFooter() {
  const { openStandardsModal, openAllyDrawer } = useDyeguModals();

  return (
    <footer className="bg-[#000000] border-t border-[#444444] text-[#F5F5F0]">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLockup size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8E8E8A]">
              Don&apos;t You Ever Give Up. A 4K documentary screening room and rebuilder&apos;s
              sanctuary built on real dates, primary filings, and quiet endurance.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 label-track text-[#8E8E8A]">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A059]"
              >
                YouTube
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A059]"
              >
                Instagram
              </a>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A059]"
              >
                X
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5A059]"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div>
              <p className="label-track text-[#C5A059] mb-4">Stories</p>
              <ul className="space-y-2.5 text-sm text-[#8E8E8A]">
                <li>
                  <Link href="/stories" className="hover:text-[#F5F5F0]">
                    Season 1 Dossiers
                  </Link>
                </li>
                <li>
                  <Link href="/stories/steve-jobs" className="hover:text-[#F5F5F0]">
                    Ep 01 · Steve Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/stories/jk-rowling" className="hover:text-[#F5F5F0]">
                    Ep 02 · J.K. Rowling
                  </Link>
                </li>
                <li>
                  <Link href="/stories/tyler-perry" className="hover:text-[#F5F5F0]">
                    Ep 03 · Tyler Perry
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-track text-[#C5A059] mb-4">For Rebuilders</p>
              <ul className="space-y-2.5 text-sm text-[#8E8E8A]">
                <li>
                  <Link href="/#protocol" className="hover:text-[#F5F5F0]">
                    Tomorrow&apos;s Protocol
                  </Link>
                </li>
                <li>
                  <Link href="/field-note" className="hover:text-[#F5F5F0]">
                    1-Page Wilderness Field Note
                  </Link>
                </li>
                <li>
                  <Link href="/#field-note" className="hover:text-[#F5F5F0]">
                    The Comeback File
                  </Link>
                </li>
                <li>
                  <Link href="/playbook" className="hover:text-[#F5F5F0]">
                    The Rebuild Playbook (Jan 2027)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-track text-[#C5A059] mb-4">Custodians &amp; Allies</p>
              <ul className="space-y-2.5 text-sm text-[#8E8E8A]">
                <li>
                  <button
                    type="button"
                    onClick={() => openAllyDrawer("practitioners")}
                    className="text-left hover:text-[#F5F5F0]"
                  >
                    Vetted Practitioners
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAllyDrawer("organizations")}
                    className="text-left hover:text-[#F5F5F0]"
                  >
                    Organizations &amp; NGOs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openAllyDrawer("underwriters")}
                    className="text-left hover:text-[#F5F5F0]"
                  >
                    Season Underwriters
                  </button>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-[#F5F5F0]">
                    The Studio Mug (Coming Soon)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label-track text-[#C5A059] mb-4">Standards &amp; Legal</p>
              <ul className="space-y-2.5 text-sm text-[#8E8E8A]">
                <li>
                  <button
                    type="button"
                    onClick={openStandardsModal}
                    className="text-left hover:text-[#F5F5F0]"
                  >
                    Verification &amp; Research Standards
                  </button>
                </li>
                <li>
                  <Link href="/community/guidelines" className="hover:text-[#F5F5F0]">
                    Safety &amp; Circle Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#F5F5F0]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Crisis Helpline Notice */}
        <div className="mt-12 border border-[#444444] bg-[#000000] px-6 py-4 text-sm leading-relaxed text-[#F5F5F0]">
          <p>
            <strong className="font-medium text-[#C5A059]">Struggling right now?</strong> You
            don&apos;t have to carry tonight alone. If you&apos;re thinking about suicide or
            self-harm, please contact a local crisis line or emergency services immediately:{" "}
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] underline underline-offset-4 hover:text-[#F5F5F0]"
            >
              Find a free, confidential helpline in your country →
            </a>
          </p>
        </div>

        {/* Bottom Credits — Zero AI methodology text in raw footer */}
        <div className="mt-8 flex flex-col gap-3 border-t border-[#444444] pt-6 text-xs text-[#8E8E8A] sm:flex-row sm:items-center sm:justify-between">
          <p className="label-track text-[#8E8E8A]">
            © 2026 DYEGU — Don&apos;t You Ever Give Up ·{" "}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] hover:underline"
            >
              {YOUTUBE_HANDLE}
            </a>
          </p>
          <button
            type="button"
            onClick={openStandardsModal}
            className="label-track text-left text-[#8E8E8A] hover:text-[#C5A059] sm:text-right"
          >
            Verification &amp; Research Standards →
          </button>
        </div>
      </div>
    </footer>
  );
}
