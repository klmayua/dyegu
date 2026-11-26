"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Lenis from "lenis";
import { BrandLockup, PhoenixMark } from "./BrandMarks";

export const EASE: [number, number, number, number] = [0.22, 0.61, 0.24, 1];
export const SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function lockPageScroll(locked: boolean) {
  if (typeof window === "undefined") return;
  if (locked) {
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    window.__lenis?.start();
  }
}

/**
 * Weighted Lenis smooth scrolling (modeled on UcheChineke/components/Smooth.js).
 * Automatically bypassed on prefers-reduced-motion; pauses cleanly when overlays open.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      lerp: 0.11,
    });
    lenisRef.current = instance;
    window.__lenis = instance;
    return () => {
      instance.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [path]);

  return null;
}

/**
 * Opening cinema curtain — plays once per session on pure #000000:
 * 1px gold hairline draws across, Phoenix & D Y E G U rise, then the curtain lifts cleanly upward.
 */
let curtainPlayed = false;

export function OpeningCurtain() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced || curtainPlayed) return;
    curtainPlayed = true;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1450);
    return () => window.clearTimeout(t);
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          initial={{ y: "0%" }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.9, ease: SOFT }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#000000] px-6"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ transformOrigin: "left center" }}
            className="mb-7 block h-px w-[220px] bg-[#C5A059]"
          />
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: SOFT }}
            className="flex flex-col items-center gap-4"
          >
            <PhoenixMark size={44} />
            <BrandLockup size="lg" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
            className="mt-5 label-track text-[#8E8E8A]"
          >
            DON&apos;T YOU EVER GIVE UP
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Single section/element reveal as the reader reaches it — short rise & fade, once.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -6% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container & item — flows children in smoothly one at a time on viewport entry.
 */
export function StaggerList({
  children,
  className = "",
  gap = 0.075,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  immediate?: boolean;
}) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="out"
      animate={immediate ? "in" : undefined}
      whileInView={immediate ? undefined : "in"}
      viewport={immediate ? undefined : { once: true, margin: "-8% 0px" }}
      variants={{
        out: {},
        in: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        out: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line-by-line headline lift (lifts out cleanly from behind its baseline).
 */
export function MaskedHeadline({
  lines,
  className = "",
  delayBase = 0.15,
}: {
  lines: { text: string; gold?: boolean }[];
  className?: string;
  delayBase?: number;
}) {
  const still = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={line.text} className="block overflow-hidden pb-[0.06em]">
          {still ? (
            <span className={line.gold ? "text-[#C5A059]" : undefined}>{line.text}</span>
          ) : (
            <motion.span
              className={`block ${line.gold ? "text-[#C5A059]" : ""}`}
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, ease: SOFT, delay: delayBase + 0.1 * i }}
            >
              {line.text}
            </motion.span>
          )}
        </span>
      ))}
    </h1>
  );
}

/**
 * Scroll-paced word-by-word illumination (modeled on UcheChineke/components/Statement.js).
 */
function StatementWord({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}
    </motion.span>
  );
}

export function ScrollStatement({
  text,
  eyebrow,
  after,
}: {
  text: string;
  eyebrow?: string;
  after?: string[];
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.86", "end 0.48"],
  });
  const words = text.split(" ");

  return (
    <div>
      {eyebrow && <p className="label-track text-[#C5A059] mb-5">{eyebrow}</p>}
      <p
        ref={ref}
        className="font-display text-[32px] font-medium leading-[1.16] tracking-[-0.015em] text-[#F5F5F0] sm:text-[46px] lg:text-[56px] max-w-[24ch]"
      >
        {still
          ? text
          : words.map((w, i) => (
              <StatementWord
                key={`${w}-${i}`}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              >
                {i < words.length - 1 ? `${w} ` : w}
              </StatementWord>
            ))}
      </p>
      {after && after.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#444444] pt-6 md:grid-cols-2">
          {after.map((line) => (
            <p key={line} className="text-sm leading-relaxed text-[#8E8E8A] max-w-[48ch]">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
