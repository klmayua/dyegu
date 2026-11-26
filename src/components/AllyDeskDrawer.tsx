"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { PhoenixMark } from "./BrandMarks";
import { AllyDeskContent, type AllyTab } from "./AllyDeskContent";
import { SOFT, lockPageScroll } from "./MotionPrimitives";

interface AllyDeskDrawerProps {
  open: boolean;
  initialTab: AllyTab;
  onClose: () => void;
}

export function AllyDeskDrawer({ open, initialTab, onClose }: AllyDeskDrawerProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="DYEGU Ally Desk — Custodians of the Rebuild"
          data-lenis-prevent
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: SOFT }}
          className="fixed inset-0 z-[100] flex justify-end bg-[#000000]/85 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            data-lenis-prevent
            initial={still ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={still ? undefined : { x: "100%" }}
            transition={{ duration: 0.42, ease: SOFT }}
            className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-[#C5A059] bg-[#000000] p-6 sm:p-10"
          >
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
                  className="border border-[#444444] p-1.5 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  <X className="h-4 w-4" strokeWidth={1.25} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex-1">
              <AllyDeskContent initialTab={initialTab} compact />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
