"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SESSION_TOPICS, STAGES } from "@/lib/dyegu-data";
import { submitToDyegu } from "@/lib/submit-client";

export function CommunityFormClient({
  kind,
  buttonLabel,
  successText,
}: {
  kind: "circle" | "session";
  buttonLabel: string;
  successText: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [timezone, setTimezone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      const p = new URLSearchParams(window.location.search);
      const st = p.get("stage") || p.get("chapter");
      if (st && STAGES.some((x) => x.key === st)) setStage(st);
    } catch {
      // ignore
    }
  }, []);

  function toggleTopic(key: string) {
    setTopics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (kind === "circle" && !stage) {
      setError("Please choose the chapter closest to yours so we can match your founding cohort.");
      return;
    }
    if (!agreed) {
      setError("Please confirm you've read the community guidelines.");
      return;
    }
    setSubmitting(true);
    try {
      await submitToDyegu(
        "community_requests",
        {
          kind,
          first_name: firstName.trim() || null,
          email: email.trim(),
          stage: stage || null,
          timezone: timezone || null,
          topics: kind === "session" && topics.length ? topics : null,
          note: note.trim() || null,
          agreed_terms: true,
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

  if (done) {
    return (
      <div role="status" className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-6">
        <p className="label-track text-[#C5A059]">Registered</p>
        <p className="mt-2 font-display text-2xl text-[#F5F5F0]">{successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor={`fn-${kind}`}>
            First Name (optional)
          </label>
          <input
            id={`fn-${kind}`}
            type="text"
            maxLength={60}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor={`em-${kind}`}>
            Email Address *
          </label>
          <input
            id={`em-${kind}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor={`st-${kind}`}>
          Which chapter is closest to where you are? {kind === "circle" ? "*" : "(optional)"}
        </label>
        <select
          id={`st-${kind}`}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
        >
          <option value="">Choose one</option>
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.short}
            </option>
          ))}
        </select>
      </div>

      {kind === "session" && (
        <div>
          <p className="label-track text-[#8E8E8A] mb-3">Topics you want help with</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SESSION_TOPICS.map(([k, label]) => (
              <label
                key={k}
                className="flex cursor-pointer items-start gap-3 border border-[#444444] p-3 text-sm text-[#F5F5F0]/90 hover:border-[#C5A059]"
              >
                <input
                  type="checkbox"
                  checked={topics.includes(k)}
                  onChange={() => toggleTopic(k)}
                  className="mt-1 accent-[#C5A059]"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor={`nt-${kind}`}>
          Anything we should know? (optional)
        </label>
        <textarea
          id={`nt-${kind}`}
          rows={3}
          maxLength={1500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Please leave out sensitive medical or legal details here."
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[#8E8E8A]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-[#C5A059]"
        />
        <span>
          I&apos;ve read the{" "}
          <Link href="/community/guidelines" className="text-[#C5A059] underline underline-offset-4">
            community guidelines
          </Link>{" "}
          and understand this is peer support and general guidance, not professional advice or
          emergency help.
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
        className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
      >
        {submitting ? "Submitting…" : buttonLabel}
      </button>
    </form>
  );
}
