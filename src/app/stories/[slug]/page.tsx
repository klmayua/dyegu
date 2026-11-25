import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EPISODES,
  SITE_URL,
  SOURCES,
  STAGE_MAP,
  STORIES,
  YOUTUBE_HANDLE,
  YOUTUBE_SUBSCRIBE_URL,
} from "@/lib/dyegu-data";
import { SourceLedgerClient } from "@/components/SourceLedgerClient";
import { PremiereActionsClient } from "@/components/PremiereActionsClient";
import { SubscribeForm } from "@/components/SubscribeForm";

export function generateStaticParams() {
  return STORIES.filter((s) => s.livePage).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = STORIES.find((s) => s.slug === slug && s.livePage);
  if (!story) return {};
  return {
    title: `${story.subject} — Documented Comeback (Episode ${story.no})`,
    description: story.synopsis?.slice(0, 155) ?? story.fall,
    openGraph: {
      images: [{ url: `/assets/og/story-${story.slug}.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function StoryDossierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = STORIES.findIndex((s) => s.slug === slug && s.livePage);
  if (idx === -1) notFound();

  const story = STORIES[idx];
  const ep = EPISODES[slug];
  const src = SOURCES[slug] ?? { verified_claims: 0, held_back: 0, tag_counts: {}, sources: [] };
  const nextStory = STORIES.slice(idx + 1).find((x) => x.livePage) ?? null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${story.subject} — Documented Comeback (DYEGU Episode ${story.no})`,
    description: story.synopsis ?? story.fall,
    publisher: { "@type": "Organization", name: "DYEGU" },
    datePublished: story.date,
    image: `${SITE_URL}/assets/og/story-${story.slug}.jpg`,
  };

  return (
    <div className="bg-[#000000]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Dossier Header */}
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="label-track text-[#C5A059]">
                <Link href="/stories" className="hover:underline">
                  Season 1
                </Link>{" "}
                · Episode {story.no} · {story.category}
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium leading-[1.02] text-[#F5F5F0] sm:text-6xl">
                {story.subject}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/85">
                {story.synopsis}
              </p>

              <div className="mt-8 grid grid-cols-3 divide-x divide-[#444444] border-y border-[#444444] py-4">
                <div className="pr-4">
                  <p className="label-track text-[#8E8E8A]">Wilderness</p>
                  <p className="mt-1 font-display text-2xl text-[#C5A059]">{story.wilderness}</p>
                </div>
                <div className="px-4">
                  <p className="label-track text-[#8E8E8A]">Runtime</p>
                  <p className="mt-1 font-display text-2xl text-[#F5F5F0]">
                    ~{ep?.runtime_minutes ? Math.round(ep.runtime_minutes) : 19} min
                  </p>
                </div>
                <div className="pl-4">
                  <p className="label-track text-[#8E8E8A]">Verified Facts</p>
                  <p className="mt-1 font-display text-2xl text-[#F5F5F0]">
                    {src.verified_claims}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-8 text-center">
                <p className="label-track text-[#C5A059]">Episode {story.no} Premiere</p>
                <p className="mt-3 font-display text-3xl text-[#F5F5F0]">
                  {new Date(story.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 label-track text-[#8E8E8A]">
                  15:00 WAT · 14:00 GMT · 09:00 ET
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={YOUTUBE_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
                  >
                    Subscribe on YouTube ({YOUTUBE_HANDLE})
                  </a>
                  <PremiereActionsClient
                    title={`DYEGU Episode ${story.no}: ${story.subject}`}
                    isoDate={story.date}
                    slug={story.slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Chapters */}
      {ep?.chapters && ep.chapters.length > 0 && (
        <section className="border-b border-[#444444] py-16">
          <div className="mx-auto max-w-[900px] px-6">
            <p className="label-track text-[#C5A059]">Episode Anatomy</p>
            <h2 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0]">
              Chapters &amp; Timeline
            </h2>
            <ol className="mt-8 border-l-[1.5px] border-[#444444] pl-7 space-y-6">
              {ep.chapters.map((ch) => (
                <li key={ch.timestamp} className="relative">
                  <span
                    className="absolute -left-[31.5px] top-1.5 h-[6px] w-[6px] rounded-full bg-[#C5A059]"
                    aria-hidden="true"
                  />
                  <span className="label-track text-[#C5A059]">{ch.timestamp}</span>
                  <h3 className="mt-0.5 font-display text-2xl text-[#F5F5F0]">{ch.label}</h3>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Three Turning Points */}
      {ep?.shorts && ep.shorts.length > 0 && (
        <section className="border-b border-[#444444] py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <p className="label-track text-[#C5A059]">Documented Turning Points</p>
            <h2 className="mt-2 font-display text-3xl font-medium text-[#F5F5F0]">
              Inside the wilderness
            </h2>
            <div className="mt-8 grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0">
              {ep.shorts.map((sh) => (
                <article key={sh.id} className="py-7 md:px-6 md:first:pl-0 md:last:pr-0">
                  <p className="label-track text-[#8E8E8A]">{sh.id}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium text-[#F5F5F0]">
                    &ldquo;{sh.hook}&rdquo;
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">{sh.proof}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The DYEGU Rule */}
      {ep?.dyegu_rule && (
        <section className="border-b border-[#444444] py-16">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="border border-[rgba(197,160,89,0.60)] p-8 sm:p-10">
              <p className="label-track text-[#C5A059]">The DYEGU Rule</p>
              <blockquote className="mt-4 font-display text-3xl italic leading-snug text-[#F5F5F0] sm:text-4xl">
                &ldquo;{ep.dyegu_rule}&rdquo;
              </blockquote>
              {ep.comment_prompt && (
                <p className="mt-6 border-l border-[#C5A059] pl-4 text-sm text-[#8E8E8A]">
                  <strong className="text-[#F5F5F0]">Question to sit with:</strong>{" "}
                  {ep.comment_prompt}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Primary Source Ledger */}
      <section id="sources" className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <SourceLedgerClient
            verifiedClaims={src.verified_claims}
            heldBack={src.held_back}
            tagCounts={src.tag_counts}
            sources={src.sources}
            featuredClaims={ep?.featured_claims ?? []}
          />
        </div>
      </section>

      {/* Related Chapters & Next Dossier */}
      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">If this mirrors your chapter</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {story.stages.map((k) => {
              const st = STAGE_MAP[k];
              if (!st) return null;
              return (
                <Link
                  key={k}
                  href={`/?chapter=${k}#triage`}
                  className="label-track border border-[#444444] px-4 py-2 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
                >
                  {st.short} →
                </Link>
              );
            })}
          </div>

          {nextStory && (
            <div className="mt-10 border-t border-[#444444] pt-8">
              <p className="label-track text-[#8E8E8A]">Next Dossier</p>
              <Link
                href={`/stories/${nextStory.slug}`}
                className="mt-2 inline-block font-display text-3xl text-[#C5A059] hover:underline"
              >
                Episode {nextStory.no}: {nextStory.subject} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Companion Newsletter */}
      <section className="py-16">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <p className="label-track text-[#C5A059]">The Comeback File · Sundays</p>
          <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] sm:text-4xl">
            Receive each verified dossier in your inbox.
          </h2>
          <div className="mt-6">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
