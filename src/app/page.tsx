import React from "react";
import { HeroIdent } from "@/components/HeroIdent";
import { ArchivalPlate } from "@/components/ArchivalPlate";
import { WildernessTimeline } from "@/components/WildernessTimeline";
import { FloorTriage } from "@/components/FloorTriage";
import { HostRule } from "@/components/HostRule";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  SITE_URL,
  X_URL,
  YOUTUBE_URL,
} from "@/lib/dyegu-data";

export default function HomePage() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DYEGU — Don't You Ever Give Up",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/icon-512.png`,
    sameAs: [YOUTUBE_URL, INSTAGRAM_URL, X_URL, FACEBOOK_URL],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <HeroIdent />
      <ArchivalPlate />
      <WildernessTimeline />
      <FloorTriage />
      <HostRule />
    </>
  );
}
