"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { submitToDyegu } from "@/lib/submit-client";

export type AllyTab = "practitioners" | "organizations" | "underwriters";

interface AllyDeskContentProps {
  initialTab?: AllyTab;
  compact?: boolean;
}

export function AllyDeskContent({
  initialTab = "practitioners",
  compact = false,
}: AllyDeskContentProps) {
  const [tab, setTab] = useState<AllyTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      {/* 3-Tab Selector on Pure #000000 */}
      <div
        role="tablist"
        aria-label="Ally Desk Pathways"
        className="grid grid-cols-1 border-y border-[#444444] sm:grid-cols-3 sm:divide-x sm:divide-[#444444]"
      >
        {(
          [
            { id: "practitioners", label: "01 · Practitioners & Mentors" },
            { id: "organizations", label: "02 · Organizations & NGOs" },
            { id: "underwriters", label: "03 · Season Underwriters" },
          ] as { id: AllyTab; label: string }[]
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`label-track border-b border-[#444444] px-4 py-3.5 text-left transition-colors sm:border-b-0 ${
                active
                  ? "bg-[#C5A059] text-[#000000]"
                  : "bg-[#000000] text-[#8E8E8A] hover:text-[#F5F5F0]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        {tab === "practitioners" && <PractitionerPane compact={compact} />}
        {tab === "organizations" && <InstitutionalPane mode="organizations" compact={compact} />}
        {tab === "underwriters" && <InstitutionalPane mode="underwriters" compact={compact} />}
      </div>
    </div>
  );
}

function PractitionerPane({ compact }: { compact: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [background, setBackground] = useState("");
  const [timezone, setTimezone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    } catch {
      // ignore
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !discipline.trim()) {
      setError("Please add your name and discipline.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agreed) {
      setError("Please confirm the Zero Pitching / Trauma-Informed Code of Conduct.");
      return;
    }

    setSubmitting(true);
    try {
      await submitToDyegu(
        "volunteers",
        {
          full_name: name.trim(),
          email: email.trim(),
          profession: discipline.trim(),
          why: background.trim() || null,
          timezone: timezone.trim() || null,
          formats: ["session", "circle"],
          hours_per_month: "1/month",
          agreed_code: true,
        },
        honeypot
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-track text-[#C5A059]">For Practitioners · Zero Pitching</p>
        <h3 className={`mt-2 font-display font-medium text-[#F5F5F0] ${compact ? "text-2xl" : "text-3xl"}`}>
          Vetted Roster · January 2027 Founding Cohort
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
          Therapists, career leads, legal and financial advisors, and elders who have walked
          through a rebuild. Contribute one pitch-free hour a month to our January 2027 Founding
          Cohort.
        </p>
      </div>

      {/* Zero Pitching / Trauma-Informed Charter */}
      <div className="grid grid-cols-1 gap-3 border border-[rgba(197,160,89,0.60)] p-5 sm:grid-cols-2">
        <div>
          <p className="label-track text-[#C5A059]">Zero Pitching Enforced</p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E8A]">
            No client acquisition, funnels, or paid offers inside DYEGU rooms. Approved
            practitioners are credited strictly by name and profession.
          </p>
        </div>
        <div>
          <p className="label-track text-[#C5A059]">Trauma-Informed Restraint</p>
          <p className="mt-1.5 text-xs leading-relaxed text-[#8E8E8A]">
            General guidance only, strict confidentiality, calm escalation protocol for anyone in
            acute crisis, and manual credential vetting.
          </p>
        </div>
      </div>

      {done ? (
        <div role="status" className="border border-[rgba(197,160,89,0.60)] p-5">
          <p className="label-track text-[#C5A059]">Application Logged</p>
          <p className="mt-2 font-display text-2xl text-[#F5F5F0]">
            Thank you. Every practitioner is vetted manually ahead of January 2027; we will reply
            within two weeks.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor="al-p-name">
                Name *
              </label>
              <input
                id="al-p-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor="al-p-email">
                Email *
              </label>
              <input
                id="al-p-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor="al-p-disc">
                Discipline *
              </label>
              <input
                id="al-p-disc"
                required
                placeholder="e.g. Therapist, Career Lead, Employment Lawyer"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor="al-p-tz">
                Timezone
              </label>
              <input
                id="al-p-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. Africa/Lagos, Europe/London"
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor="al-p-bg">
              Lived / Clinical Background
            </label>
            <textarea
              id="al-p-bg"
              rows={3}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="Credentials, licences, or lived rebuild context you bring to the room."
              className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-xs text-[#8E8E8A]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#C5A059]"
            />
            <span>
              I agree to the{" "}
              <Link href="/community/guidelines" className="text-[#C5A059] underline">
                Zero Pitching &amp; Trauma-Informed Code of Conduct
              </Link>
              .
            </span>
          </label>

          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />

          {error && <p className="text-xs text-[#C5A059]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Apply to the Vetted Roster →"}
          </button>
        </form>
      )}
    </div>
  );
}

function InstitutionalPane({
  mode,
  compact,
}: {
  mode: "organizations" | "underwriters";
  compact: boolean;
}) {
  const isUnderwriter = mode === "underwriters";
  const [orgType, setOrgType] = useState(isUnderwriter ? "Sponsor" : "Corporate");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOrgType(isUnderwriter ? "Sponsor" : "Corporate");
  }, [isUnderwriter]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid contact email.");
      return;
    }
    if (!inquiry.trim()) {
      setError("Please add a brief note on the nature of your inquiry.");
      return;
    }
    setSubmitting(true);
    try {
      await submitToDyegu(
        "enquiries",
        {
          name: orgName.trim() || `${orgType} Inquiry`,
          organisation: `${orgType}${orgName.trim() ? ` · ${orgName.trim()}` : ""}`,
          email: email.trim(),
          kind: isUnderwriter || orgType === "Sponsor" ? "sponsor" : "workshop",
          message: `[${orgType}] ${inquiry.trim()}`,
        },
        honeypot
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-track text-[#C5A059]">
          {isUnderwriter
            ? "Season Underwriters · Documentary Model"
            : "For Organizations & NGOs"}
        </p>
        <h3 className={`mt-2 font-display font-medium text-[#F5F5F0] ${compact ? "text-2xl" : "text-3xl"}`}>
          {isUnderwriter
            ? "Public-television underwriting — zero mid-roll hype."
            : "Private screenings, transition workshops & beneficiary access."}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#8E8E8A]">
          {isUnderwriter
            ? "Modeled on documentary underwriting: clean opening/closing acknowledgement on Season 1 and optional underwriting of free Rebuild Playbook editions for individuals in transition. Zero mid-roll interruptions, zero commercial intrusion inside peer cohorts."
            : "Bring private Season 1 documentary screenings and Sir K's evidence-grounded talks to teams navigating restructuring, outplacement, or transition—or grant free Rebuild Playbook access to your community or beneficiaries."}
        </p>
      </div>

      {done ? (
        <div role="status" className="border border-[rgba(197,160,89,0.60)] p-5">
          <p className="label-track text-[#C5A059]">Brief Requested</p>
          <p className="mt-2 font-display text-2xl text-[#F5F5F0]">
            Thank you. Our institutional desk will send the brief and reply within two working days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor={`al-ot-${mode}`}>
                Organization Type
              </label>
              <select
                id={`al-ot-${mode}`}
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              >
                <option value="Corporate">Corporate</option>
                <option value="NGO">NGO</option>
                <option value="Foundation">Foundation</option>
                <option value="Sponsor">Sponsor / Underwriter</option>
              </select>
            </div>
            <div>
              <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor={`al-on-${mode}`}>
                Organization Name
              </label>
              <input
                id={`al-on-${mode}`}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Optional"
                className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor={`al-em-${mode}`}>
              Contact Email *
            </label>
            <input
              id={`al-em-${mode}`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <div>
            <label className="label-track block text-[#8E8E8A] mb-1.5" htmlFor={`al-in-${mode}`}>
              Nature of Inquiry *
            </label>
            <textarea
              id={`al-in-${mode}`}
              rows={3}
              required
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder={
                isUnderwriter
                  ? "Season 1 documentary underwriting, Playbook seat grants, or founding partner conversation."
                  : "Private team screening, restructuring workshop, or sponsored Rebuild Playbook access."
              }
              className="w-full border border-[#444444] bg-[#000000] px-3.5 py-2.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
            />
          </div>

          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />

          {error && <p className="text-xs text-[#C5A059]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="label-track border border-[#C5A059] bg-[#C5A059] px-5 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
          >
            {submitting
              ? "Sending…"
              : isUnderwriter
                ? "Request Underwriting Brief →"
                : "Request the Institutional Brief →"}
          </button>
        </form>
      )}
    </div>
  );
}
