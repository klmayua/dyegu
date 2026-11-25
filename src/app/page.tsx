import React from "react";
import { JourneyExperience } from "@/components/JourneyExperience";
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
      <JourneyExperience />
    </>
  );
}
