"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { PhoenixMark } from "./BrandMarks";
import { AllyDeskContent, type AllyTab } from "./AllyDeskContent";

interface AllyDeskDrawerProps {
  open: boolean;
  initialTab: AllyTab;
  onClose: () => void;
}

export function AllyDeskDrawer({ open, initialTab, onClose }: AllyDeskDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="DYEGU Ally Desk — Custodians of the Rebuild"
      className="fixed inset-0 z-50 flex justify-end bg-[#000000]/85"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-[#C5A059] bg-[#000000] p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4 border-b border-[#444444] pb-5">
          <div className="flex items-center gap-3">
            <PhoenixMark size={18} />
            <span className="label-track text-[#C5A059]">
              Ally Desk · Custodians of the Rebuild
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/allies"
              onClick={onClose}
              className="label-track text-[#8E8E8A] hover:text-[#C5A059]"
            >
              Full Page ↗
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Ally Desk"
              className="border border-[#444444] px-3 py-1 text-sm text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mt-6 flex-1">
          <AllyDeskContent initialTab={initialTab} compact />
        </div>
      </div>
    </div>
  );
}
