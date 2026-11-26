import React from "react";
import type { Metadata } from "next";
import { StoriesArchiveClient } from "@/components/StoriesArchiveClient";
import { WildernessTimeline } from "@/components/WildernessTimeline";

export const metadata: Metadata = {
  title: "Stories — Season 1 Archive (14 Documentaries)",
  description:
    "All 14 documented comeback stories in DYEGU Season 1 alongside the empirical Wilderness Duration Timeline.",
};

export default function StoriesPage() {
  return (
    <div className="bg-[#000000]">
      <StoriesArchiveClient />
      <WildernessTimeline />
    </div>
  );
}
