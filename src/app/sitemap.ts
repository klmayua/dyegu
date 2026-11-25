import type { MetadataRoute } from "next";
import { SITE_URL, STAGES, STORIES } from "@/lib/dyegu-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/stories",
    "/standards",
    "/allies",
    "/community",
    "/community/circles",
    "/community/sessions",
    "/community/guidelines",
    "/playbook",
    "/shop",
    "/field-note",
    "/reset",
    "/share",
    "/volunteer",
    "/speaking",
    "/about",
    "/studio",
    "/privacy",
  ];

  const storyPaths = STORIES.filter((s) => s.livePage).map((s) => `/stories/${s.slug}`);
  const stagePaths = STAGES.map((s) => `/start/${s.key}`);

  return [...staticPaths, ...storyPaths, ...stagePaths].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
  }));
}
