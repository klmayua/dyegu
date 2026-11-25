import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES, STAGE_MAP, STORIES, SUPPORT_URL } from "@/lib/dyegu-data";
import { StageChecklistClient } from "@/components/StageChecklistClient";
import { SubscribeForm } from "@/components/SubscribeForm";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage } = await params;
  const s = STAGE_MAP[stage];
  if (!s) return {};
  return {
    title: `${s.title} — 7-Day Moves & Documented Proof`,
    description: s.exhale,
  };
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  const s = STAGE_MAP[stage];
  if (!s) notFound();

  const matchingStories = STORIES.filter((st) => st.stages.includes(s.key));

  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">
            <Link href="/#mirror" className="hover:underline">
              Stage 1 · The Mirror
            </Link>{" "}
            · {s.tag}
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-[#F5F5F0] sm:text-6xl">
            {s.title}
          </h1>
          <p className="mt-5 font-display text-2xl leading-relaxed text-[#F5F5F0]/90">{s.scene}</p>
          <blockquote className="mt-6 border-l border-[#C5A059] pl-5 font-display text-2xl italic text-[#C5A059]">
            &ldquo;{s.rulePreview}&rdquo;
          </blockquote>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Three Concrete Moves This Week</p>
          <p className="mt-2 mb-6 text-sm text-[#8E8E8A]">{s.exhale}</p>
          <StageChecklistClient stageKey={s.key} moves={s.moves} />

          {s.sensitive && (
            <aside className="mt-8 border-l border-[#C5A059] pl-5 text-sm text-[#8E8E8A]">
              <strong className="text-[#F5F5F0]">If tonight feels heavier than a setback:</strong>{" "}
              please reach out to a doctor, counsellor, or a free confidential crisis line:{" "}
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A059] underline"
              >
                findahelpline.com
              </a>
              .
            </aside>
          )}

          <div className="mt-10 flex flex-col justify-between gap-4 border border-[rgba(197,160,89,0.60)] p-6 sm:flex-row sm:items-center">
            <div>
              <p className="label-track text-[#C5A059]">
                Founding Cohort Waitlist · Opens January 2027 · $0
              </p>
              <p className="mt-1 font-display text-2xl text-[#F5F5F0]">
                Rebuild Circle matched to this exact chapter
              </p>
            </div>
            <Link
              href={`/community/circles?stage=${s.key}`}
              className="label-track shrink-0 border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
            >
              Join Waitlist →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="label-track text-[#C5A059]">Season 1 Historical Parallels</p>
          <h2 className="mt-2 font-display text-3xl text-[#F5F5F0]">
            They stood in this exact storm.
          </h2>
          <div className="mt-8 grid grid-cols-1 border-t border-l border-[#444444] md:grid-cols-3">
            {matchingStories.map((st) => (
              <div
                key={st.slug}
                className="flex flex-col justify-between border-r border-b border-[#444444] p-6"
              >
                <div>
                  <span className="font-display text-3xl text-[#C5A059]">{st.no}</span>
                  <h3 className="mt-2 font-display text-2xl text-[#F5F5F0]">{st.subject}</h3>
                  <p className="mt-2 text-sm text-[#8E8E8A]">{st.fall}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#444444]/60">
                  {st.livePage ? (
                    <Link
                      href={`/stories/${st.slug}`}
                      className="label-track text-[#C5A059] hover:underline"
                    >
                      Read Verified Dossier →
                    </Link>
                  ) : (
                    <span className="label-track text-[#8E8E8A]">
                      Wilderness · {st.wilderness}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[680px] px-6 text-center">
          <p className="label-track text-[#C5A059]">{s.short}</p>
          <h2 className="mt-2 font-display text-3xl text-[#F5F5F0] sm:text-4xl">
            Open the 1-Page Field Note + Sunday Comeback File.
          </h2>
          <div className="mt-6">
            <SubscribeForm stage={s.key} />
          </div>
        </div>
      </section>
    </div>
  );
}
