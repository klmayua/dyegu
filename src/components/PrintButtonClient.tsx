"use client";

import React from "react";

export function PrintButtonClient({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
    >
      {label}
    </button>
  );
}
