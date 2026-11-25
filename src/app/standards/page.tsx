import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PhoenixMark } from "@/components/BrandMarks";
import { EPISODES, STORIES } from "@/lib/dyegu-data";

export const metadata: Metadata = {
  title: "Verification Standards & Editorial Methodology",
  description:
    "How every DYEGU comeback documentary is researched, verified against primary records, and audited before narration.",
};

export default function StandardsPage() {
  const audited = STORIES.filter((s) => s.livePage).map((s) => ({
    ...s,
    ep: EPISODES[s.slug],
  }));

  const totalClaims = audited.reduce((acc, x) => acc + (x.ep?.verified_claims ?? 0), 0);
  const totalSources = audited.reduce((acc, x) => acc + (x.ep?.source_count ?? 0), 0);
  const totalHeld = audited.reduce((acc, x) => acc + (x.ep?.held_back ?? 0), 0);

  return (
    <div className="bg-[#000000]">
      <section className="border-b border-[#444444] py-20 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="mb-5 flex items-center gap-3">
            <PhoenixMark size={18} />
            <p className="label-track text-[#C5A059]">Editorial Charter · Primary-Source Standards</p>
          </div>
          <h1 className="font-display text-5xl font-medium leading-[1.03] text-[#F5F5F0] sm:text-6xl">
            Every claim checked against the record.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#8E8E8A]">
            When someone is standing in the middle of a real collapse, invented quotes and glossy
            motivational myths are insulting. Every DYEGU documentary begins with a structured
            claims ledger before a single line of narration is recorded.
          </p>

          <div className="mt-10 grid grid-cols-3 divide-x divide-[#444444] border-y border-[#444444] py-5">
            <div className="pr-4">
              <p className="label-track text-[#8E8E8A]">Verified Claims</p>
              <p className="mt-1 font-display text-4xl text-[#C5A059]">{totalClaims}</p>
            </div>
            <div className="px-4">
              <p className="label-track text-[#8E8E8A]">Published Sources</p>
              <p className="mt-1 font-display text-4xl text-[#F5F5F0]">{totalSources}</p>
            </div>
            <div className="pl-4">
              <p className="label-track text-[#8E8E8A]">Held Back / Cut</p>
              <p className="mt-1 font-display text-4xl text-[#F5F5F0]">{totalHeld}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Evidence Classification System</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0] sm:text-4xl">
            Three source tags on every dossier
          </h2>

          <div className="mt-8 grid grid-cols-1 divide-y divide-[#444444] border-y border-[#444444] md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="py-6 md:pr-6">
              <span className="label-track border border-[rgba(197,160,89,0.60)] px-2.5 py-1 text-[#C5A059]">
                [V] Primary Record
              </span>
              <h3 className="mt-4 font-display text-2xl text-[#F5F5F0]">
                Filings, archives &amp; press releases
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">
                SEC / S-1 filings, official corporate releases, court or institutional records, and
                contemporary wire dispatches from the exact dates cited.
              </p>
            </div>

            <div className="py-6 md:px-6">
              <span className="label-track border border-[#444444] px-2.5 py-1 text-[#F5F5F0]">
                [E] Established Reporting
              </span>
              <h3 className="mt-4 font-display text-2xl text-[#F5F5F0]">
                Reputable journalism &amp; historians
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">
                Corroborated reporting from established newsrooms, museum archives, and documented
                oral histories cross-checked across multiple outlets.
              </p>
            </div>

            <div className="py-6 md:pl-6">
              <span className="label-track border border-[#444444] px-2.5 py-1 text-[#F5F5F0]">
                [T] Subject Testimony
              </span>
              <h3 className="mt-4 font-display text-2xl text-[#F5F5F0]">
                Direct attributed words
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8E8E8A]">
                Commencement addresses, long-form interviews, and published memoirs—always framed
                explicitly as the subject&apos;s own account, never silently blended into fact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#444444] py-16">
        <div className="mx-auto max-w-[900px] px-6 space-y-10">
          <div>
            <p className="label-track text-[#C5A059]">Research Disclosure</p>
            <h2 className="mt-3 font-display text-3xl font-medium text-[#F5F5F0]">
              AI-assisted research &amp; mandatory human verification
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#F5F5F0]/85">
              DYEGU dossiers are researched with AI assistance during initial archival discovery and
              chronology mapping. However, no AI-generated assertion is ever permitted to enter a
              final script unverified. Every individual claim must map to a live, human-inspected
              source URL published openly on the episode&apos;s dossier page.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-[#444444] pt-8 md:grid-cols-2">
            <div className="border border-[#444444] p-6">
              <p className="label-track text-[#C5A059]">Held-Back Claims Policy</p>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Any detail marked unconfirmed during verification is held back and excluded from the
                narration—even if it is widely repeated online. Each dossier discloses the exact
                count of held-back claims.
              </p>
            </div>
            <div className="border border-[#444444] p-6">
              <p className="label-track text-[#C5A059]">Visual &amp; Editorial Restraint</p>
              <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
                Quotes are displayed as archival text with source citations. No unauthorised film or
                broadcast footage is used, and sensitive personal chapters are narrated with calm
                dignity—the rebuild leads, never the wound.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="label-track text-[#C5A059]">Published Dossier Audits</p>
          <div className="mt-6 divide-y divide-[#444444] border-y border-[#444444]">
            {audited.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="label-track text-[#8E8E8A]">Episode {s.no}</p>
                  <p className="font-display text-2xl text-[#F5F5F0]">{s.subject}</p>
                </div>
                <div className="flex flex-wrap items-center gap-6 label-track">
                  <span className="text-[#C5A059]">{s.ep?.verified_claims ?? 0} verified</span>
                  <span className="text-[#8E8E8A]">{s.ep?.source_count ?? 0} sources</span>
                  <span className="text-[#8E8E8A]">{s.ep?.held_back ?? 0} held back</span>
                  <Link href={`/stories/${s.slug}#sources`} className="text-[#F5F5F0] hover:text-[#C5A059]">
                    Inspect Ledger →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-[#8E8E8A]">
            Spotted a primary record we should review or a citation that needs updating?{" "}
            <Link href="/speaking#enquire" className="text-[#C5A059] underline underline-offset-4">
              Send a correction note to our editorial desk
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
