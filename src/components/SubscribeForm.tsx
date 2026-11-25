"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getCapturedUtm, submitToDyegu } from "@/lib/submit-client";
import { YOUTUBE_HANDLE, YOUTUBE_SUBSCRIBE_URL } from "@/lib/dyegu-data";

interface SubscribeFormProps {
  list?: "comeback_file" | "playbook_waitlist" | "merch_waitlist";
  stage?: string | null;
  chapterSlug?: string | null;
  interest?: string[];
  buttonLabel?: string;
  placeholder?: string;
  finePrint?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export function SubscribeForm({
  list = "comeback_file",
  stage = null,
  chapterSlug = null,
  interest,
  buttonLabel = "Download My 1-Page Field Note",
  placeholder = "Enter your email address",
  finePrint = "Private. Instant 1-Page Field Note + one quiet Sunday email. Unsubscribe in 1 click.",
  compact = false,
  onSuccess,
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneStatus, setDoneStatus] = useState<"ok" | "exists" | null>(null);

  const fieldNoteHref = chapterSlug ? `/field-note?chapter=${chapterSlug}` : "/field-note";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitToDyegu(
        "subscribers",
        {
          email: trimmed,
          list,
          stage: stage || null,
          interest: interest && interest.length ? interest : null,
          page: typeof window !== "undefined" ? window.location.pathname : "/",
          utm: getCapturedUtm(),
        },
        honeypot
      );
      setDoneStatus(res.status === "exists" ? "exists" : "ok");
      setEmail("");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (doneStatus) {
    return (
      <div
        role="status"
        className="border border-[rgba(197,160,89,0.60)] bg-[#000000] p-5 text-left"
      >
        <p className="label-track text-[#C5A059]">
          {doneStatus === "exists" ? "Already on the list" : "Unlocked right now"}
        </p>
        <p className="mt-1.5 font-display text-2xl text-[#F5F5F0]">
          {list === "comeback_file"
            ? "Your Custom 1-Page Wilderness Field Note is ready."
            : list === "playbook_waitlist"
              ? "You're on The Rebuild Playbook founding list."
              : "You're on The Studio Mug preview list."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {list === "comeback_file" && (
            <Link
              href={fieldNoteHref}
              className="label-track border border-[#C5A059] bg-[#C5A059] px-4 py-2.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059]"
            >
              Open Custom 1-Page Field Note →
            </Link>
          )}
          <a
            href={YOUTUBE_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-track border border-[#444444] px-4 py-2.5 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            Subscribe on YouTube ({YOUTUBE_HANDLE})
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className={`flex flex-col gap-2.5 ${compact ? "sm:flex-row" : "sm:flex-row"}`}>
        <label className="sr-only" htmlFor={`email-${list}-${stage || "main"}`}>
          Email address
        </label>
        <input
          id={`email-${list}-${stage || "main"}`}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border border-[#444444] bg-[#000000] px-4 py-3.5 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="label-track shrink-0 border border-[#C5A059] bg-[#C5A059] px-5 py-3.5 text-[#000000] transition-colors hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
        >
          {submitting ? "Saving…" : buttonLabel}
        </button>
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
      />
      {error && (
        <p role="alert" className="mt-2 text-xs text-[#C5A059]">
          {error}
        </p>
      )}
      {finePrint && (
        <p className="mt-2.5 text-xs text-[#8E8E8A]">
          {finePrint}{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-[#F5F5F0]">
            Privacy
          </Link>
        </p>
      )}
    </form>
  );
}
