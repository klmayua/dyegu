"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { STAGES, STAGE_MAP, type StageChapter } from "@/lib/dyegu-data";
import { SubscribeForm } from "./SubscribeForm";

export function FloorTriage() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync from URL ?chapter=slug on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const chapter = params.get("chapter") || params.get("stage");
    if (chapter && STAGE_MAP[chapter]) {
      setActiveKey(chapter);
    }
  }, []);

  function selectChapter(key: string) {
    const next = activeKey === key ? null : key;
    setActiveKey(next);
    setCopied(false);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set("chapter", next);
      } else {
        url.searchParams.delete("chapter");
      }
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  function getDeepLink(key: string): string {
    if (typeof window === "undefined") return `https://dyegu.co/?chapter=${key}#triage`;
    return `${window.location.origin}/?chapter=${key}#triage`;
  }

  async function copyPrivateLink(chapter: StageChapter) {
    try {
      await navigator.clipboard.writeText(getDeepLink(chapter.key));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard denial
    }
  }

  function openWhatsAppShare(chapter: StageChapter) {
    const msg = `Thinking of you today. Came across a quiet, documented record for people walking through this chapter — zero hype: ${getDeepLink(chapter.key)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }

  const activeChapter: StageChapter | null = activeKey ? STAGE_MAP[activeKey] ?? null : null;

  return (
    <section
      id="triage"
      aria-label="Act IV: Where did the floor give way?"
      className="bg-[#000000] border-b border-[#444444] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <p className="label-track text-[#C5A059]">Act IV · Interactive Triage</p>
          <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[48px]">
            Where did the floor give way?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#8E8E8A]">
            Select the chapter closest to your week. We&apos;ll pair it with its Season 1
            historical parallel, one quiet move for tonight, and a direct link you can save or send
            privately.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* 2-column hairline index */}
          <div
            className={`${
              activeChapter ? "lg:col-span-6" : "lg:col-span-12"
            } grid grid-cols-1 gap-x-10 ${
              activeChapter ? "sm:grid-cols-1" : "md:grid-cols-2"
            } border-t border-[#444444]`}
          >
            {STAGES.map((stage, idx) => {
              const isSelected = activeKey === stage.key;
              return (
                <div key={stage.key} className="border-b border-[#444444]">
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    onClick={() => selectChapter(stage.key)}
                    className={`flex w-full items-start justify-between gap-4 py-5 text-left transition-colors ${
                      isSelected ? "pl-3 border-l-2 border-l-[#C5A059]" : "hover:pl-2"
                    }`}
                  >
                    <div>
                      <span className="label-track text-[#8E8E8A]">
                        {String(idx + 1).padStart(2, "0")} · {stage.tag}
                      </span>
                      <span
                        className={`mt-1 block font-display text-2xl font-medium leading-snug ${
                          isSelected ? "text-[#C5A059]" : "text-[#F5F5F0]"
                        }`}
                      >
                        {stage.mirror}
                      </span>
                      <span className="mt-1 block text-xs text-[#8E8E8A]">{stage.sub}</span>
                    </div>
                    <span
                      className={`mt-1 shrink-0 text-lg ${
                        isSelected ? "text-[#C5A059]" : "text-[#8E8E8A]"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? "−" : "→"}
                    </span>
                  </button>

                  {/* Mobile inline drawer directly below row */}
                  {isSelected && (
                    <div className="mb-6 lg:hidden">
                      <TriageReadingPane
                        chapter={stage}
                        copied={copied}
                        onCopy={() => copyPrivateLink(stage)}
                        onWhatsApp={() => openWhatsAppShare(stage)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop right-hand reading pane */}
          {activeChapter && (
            <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-[98px]">
              <TriageReadingPane
                chapter={activeChapter}
                copied={copied}
                onCopy={() => copyPrivateLink(activeChapter)}
                onWhatsApp={() => openWhatsAppShare(activeChapter)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TriageReadingPane({
  chapter,
  copied,
  onCopy,
  onWhatsApp,
}: {
  chapter: StageChapter;
  copied: boolean;
  onCopy: () => void;
  onWhatsApp: () => void;
}) {
  const [moveTitle, moveDesc, moveDay] = chapter.moves[0];

  return (
    <div className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#444444] pb-4">
        <span className="label-track text-[#C5A059]">
          Historical Parallel · {chapter.proofPerson}
        </span>
        <Link
          href={`/stories/${chapter.proofSlug}`}
          className="label-track text-[#8E8E8A] hover:text-[#C5A059]"
        >
          Read Dossier →
        </Link>
      </div>

      {/* 1. Matched Season 1 historical parallel */}
      <p className="mt-5 font-display text-[22px] leading-[1.45] text-[#F5F5F0]">
        {chapter.scene}
      </p>
      <p className="mt-4 border-l border-[#C5A059] pl-4 text-sm leading-relaxed text-[#8E8E8A]">
        {chapter.exhale}
      </p>

      {/* 2. One Quiet Move */}
      <div className="mt-6 border border-[#444444] p-5">
        <p className="label-track text-[#C5A059]">One Quiet Move · {moveDay}</p>
        <h3 className="mt-1.5 font-display text-2xl font-medium text-[#F5F5F0]">{moveTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">{moveDesc}</p>
        <div className="mt-4 flex flex-wrap gap-4 label-track">
          <Link href={`/start/${chapter.key}`} className="text-[#C5A059] hover:underline">
            All 3 Moves &amp; Printable Sheet →
          </Link>
          <Link
            href={`/community/circles?stage=${chapter.key}`}
            className="text-[#8E8E8A] hover:text-[#F5F5F0]"
          >
            Founding Circle Waitlist →
          </Link>
        </div>
      </div>

      {/* 3. Clean 1-line email input */}
      <div className="mt-6 border-t border-[#444444] pt-6">
        <p className="label-track text-[#F5F5F0] mb-3">
          Open the 1-Page Wilderness Field Note + Sunday Comeback File
        </p>
        <SubscribeForm
          stage={chapter.key}
          compact
          buttonLabel="Send Field Note"
          placeholder="Your email address"
          finePrint="Immediate access tonight + one documented comeback every Sunday."
        />
      </div>

      {/* 4. Quiet Share Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#444444] pt-5">
        <span className="label-track text-[#8E8E8A]">Quiet Share</span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onCopy}
            className="label-track border border-[#444444] px-3.5 py-2 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            {copied ? "Private Link Copied" : "Copy private link"}
          </button>
          <button
            type="button"
            onClick={onWhatsApp}
            className="label-track border border-[#444444] px-3.5 py-2 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            Send on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
