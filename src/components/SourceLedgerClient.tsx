"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TAG_LABELS, type FeaturedClaim, type SourceItem } from "@/lib/dyegu-data";

export function SourceLedgerClient({
  verifiedClaims,
  heldBack,
  tagCounts,
  sources,
  featuredClaims,
}: {
  verifiedClaims: number;
  heldBack: number;
  tagCounts: Record<string, number>;
  sources: SourceItem[];
  featuredClaims: FeaturedClaim[];
}) {
  const [tag, setTag] = useState<string>("all");

  const filtered = sources.filter((s) => tag === "all" || s.tag === tag);

  return (
    <div>
      <p className="label-track text-[#C5A059]">Primary Source Ledger</p>
      <h2 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
        {verifiedClaims} claims checked against {sources.length} published sources
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
        Every narrated fact maps to a primary record <strong className="text-[#F5F5F0]">[V]</strong>
        , established reporting <strong className="text-[#F5F5F0]">[E]</strong>, or attributed
        testimony <strong className="text-[#F5F5F0]">[T]</strong>.{" "}
        <Link href="/standards" className="text-[#C5A059] underline underline-offset-4">
          Read Verification Standards →
        </Link>
      </p>

      <div className="mt-5 inline-block border border-[rgba(197,160,89,0.60)] px-4 py-2.5 text-sm text-[#F5F5F0]">
        {heldBack > 0 ? (
          <>
            <strong className="text-[#C5A059]">Editorial audit:</strong> {heldBack} unconfirmed
            claim{heldBack === 1 ? " was" : "s were"} held back and left out of the script.
          </>
        ) : (
          <>
            <strong className="text-[#C5A059]">Audit result:</strong> Every narrated fact maps
            cleanly to a published record below.
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter sources by tag">
        {[
          { k: "all", label: `All (${sources.length})` },
          { k: "V", label: `[V] Primary records (${tagCounts.V ?? 0})` },
          { k: "E", label: `[E] Reporting (${tagCounts.E ?? 0})` },
          { k: "T", label: `[T] Testimony (${tagCounts.T ?? 0})` },
        ].map((btn) => (
          <button
            key={btn.k}
            type="button"
            onClick={() => setTag(btn.k)}
            aria-pressed={tag === btn.k}
            className={`label-track border px-3.5 py-2 transition-colors ${
              tag === btn.k
                ? "border-[#C5A059] bg-[#C5A059] text-[#000000]"
                : "border-[#444444] text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#F5F5F0]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-[#444444] border-y border-[#444444]">
        {filtered.map((item, idx) => (
          <li
            key={`${item.url}-${idx}`}
            className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-start sm:gap-6"
          >
            <div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-sm font-medium text-[#F5F5F0] hover:text-[#C5A059] transition-colors"
              >
                {item.title || item.label}
              </a>
              <span className="mt-1 block text-xs text-[#8E8E8A]">{item.label}</span>
            </div>
            <span className="label-track shrink-0 border border-[rgba(197,160,89,0.60)] px-2.5 py-1 text-[10px] text-[#C5A059]">
              [{item.tag}] {TAG_LABELS[item.tag] || "Source"}
            </span>
          </li>
        ))}
      </ul>

      {featuredClaims.length > 0 && (
        <details className="mt-6 border border-[#444444] p-5">
          <summary className="cursor-pointer label-track text-[#C5A059]">
            Inspect Sample Verified Claims ({Math.min(8, featuredClaims.length)} of {verifiedClaims})
          </summary>
          <ul className="mt-4 divide-y divide-[#444444] border-t border-[#444444]">
            {featuredClaims.slice(0, 8).map((c) => (
              <li key={c.id} className="py-3 text-sm leading-relaxed text-[#F5F5F0]/85">
                <span className="mr-2 label-track text-[#C5A059]">{c.id}</span>
                {c.text}
                {c.url && (
                  <>
                    {" — "}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-[#C5A059] hover:underline"
                    >
                      {c.on_screen || "Source"}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
