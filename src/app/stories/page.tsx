import React from "react";
import type { Metadata } from "next";
import { StoriesArchiveClient } from "@/components/StoriesArchiveClient";

export const metadata: Metadata = {
  title: "Stories — Season 1 Archive (14 Documentaries)",
  description:
    "All 14 documented comeback stories in DYEGU Season 1: Steve Jobs, J.K. Rowling, Tyler Perry, Nwankwo Kanu, Brendan Fraser, Tina Turner, and more.",
};

export default function StoriesPage() {
  return (
    <div className="bg-[#000000]">
      <StoriesArchiveClient />
    </div>
  );
}
