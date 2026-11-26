"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SOFT } from "@/components/MotionPrimitives";

/**
 * Gentle opacity-only route arrival (zero transform so fixed curtains & sticky cards keep viewport context).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const still = useReducedMotion();
  if (still) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.48, ease: SOFT }}
    >
      {children}
    </motion.div>
  );
}
