"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Feather, Flame } from "lucide-react";
import { SEEDED_WITNESS_DISPATCHES } from "@/lib/chapters-data";

const CINEMA_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SESSION_KEY = "dyegu_witness_lines";

interface DispatchItem {
  id: string;
  text: string;
  isUser?: boolean;
}

export function QuietWitnessWall() {
  const prefersReduced = useReducedMotion();
  const [dispatches, setDispatches] = useState<DispatchItem[]>([
    ...SEEDED_WITNESS_DISPATCHES,
  ]);
  const [draft, setDraft] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        setDispatches([...SEEDED_WITNESS_DISPATCHES, ...stored]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  function handlePlaceLine(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = draft.trim().slice(0, 220);
    if (cleaned.length < 8) return;

    const newItem: DispatchItem = {
      id: `local-${Date.now()}`,
      text: cleaned,
      isUser: true,
    };

    setDispatches((prev) => {
      const next = [...prev, newItem];
      try {
        const userOnly = next.filter((x) => x.isUser);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(userOnly));
      } catch {
        // ignore
      }
      return next;
    });
    setDraft("");
    setPlaced(true);
    setTimeout(() => setPlaced(false), 5000);
  }

  return (
    <section
      id="witness-wall"
      aria-label="Quiet Witness Wall"
      className="bg-[#000000] border-t border-b border-[#444444] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl">
          <p className="label-track text-[#C5A059]">
            LIVE ROOM · YOU ARE NOT WALKING IN THE DARK ALONE
          </p>
          <h2 className="mt-3 font-display text-[36px] font-medium leading-[1.06] text-[#F5F5F0] sm:text-[46px]">
            Quiet dispatches from people in the middle.
          </h2>
        </div>

        {/* Dispatches Grid */}
        <div className="mt-10 grid grid-cols-1 border-t border-l border-[#444444] md:grid-cols-3">
          {dispatches.map((item) => (
            <motion.div
              key={item.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: CINEMA_EASE }}
              className={`flex items-start gap-3.5 border-r border-b border-[#444444] bg-[#000000] p-6 ${
                item.isUser ? "border-t-2 border-t-[#C5A059]" : ""
              }`}
            >
              <Flame className="mt-1 h-4 w-4 shrink-0 text-[#C5A059]" strokeWidth={1.25} />
              <div>
                <p className="font-display text-xl leading-snug text-[#F5F5F0]">{item.text}</p>
                {item.isUser && (
                  <p className="mt-2 label-track text-[#C5A059]">
                    Placed in the room · Tonight
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Zero-Login Anonymous Contribution Bar */}
        <form
          onSubmit={handlePlaceLine}
          className="mt-8 border border-[#444444] bg-[#000000] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3">
              <Feather className="h-4 w-4 shrink-0 text-[#C5A059]" strokeWidth={1.25} />
              <label htmlFor="witness-line-input" className="sr-only">
                Leave an anonymous line of strength
              </label>
              <input
                id="witness-line-input"
                type="text"
                maxLength={220}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Leave an anonymous line of strength for the person arriving after you (e.g., City · Where you stand tonight)..."
                className="w-full border-0 bg-[#000000] py-2 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={draft.trim().length < 8}
              className="label-track shrink-0 border border-[#C5A059] px-5 py-3 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#000000] disabled:opacity-40"
            >
              Place Line in the Room
            </button>
          </div>
          {placed && (
            <p role="status" className="mt-3 label-track text-[#C5A059]">
              Your line has been placed quietly in the room. Thank you for standing beside the next
              person who walks in.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
