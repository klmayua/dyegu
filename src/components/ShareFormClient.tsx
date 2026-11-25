"use client";

import React, { useState } from "react";
import { SHARE_PROMPTS, STAGES, SUPPORT_URL } from "@/lib/dyegu-data";
import { submitToDyegu } from "@/lib/submit-client";

const CARE_RX = /\b(suicid\w*|kill myself|end my life|self[- ]?harm|don'?t want to live|want to die)\b/i;

export function ShareFormClient() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("");
  const [story, setStory] = useState("");
  const [consentContact, setConsentContact] = useState(false);
  const [consentFeature, setConsentFeature] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const showCare = CARE_RX.test(story);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (story.trim().length < 20) {
      setError("Please tell us a little more (at least a couple of sentences).");
      return;
    }
    setSubmitting(true);
    try {
      await submitToDyegu(
        "rebuilds",
        {
          first_name: firstName.trim() || null,
          email: email.trim(),
          stage: stage || null,
          story: story.trim(),
          consent_contact: consentContact,
          consent_feature: consentFeature,
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

  if (done) {
    return (
      <div role="status" className="border border-[rgba(197,160,89,0.60)] p-6">
        <p className="label-track text-[#C5A059]">Received Privately</p>
        <p className="mt-2 font-display text-2xl text-[#F5F5F0]">
          Thank you for trusting us with your story. Real people read every one privately.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="sh-fn">
            First Name (optional)
          </label>
          <input
            id="sh-fn"
            type="text"
            maxLength={60}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="sh-em">
            Email *
          </label>
          <input
            id="sh-em"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="sh-st">
          Which chapter is closest to your story?
        </label>
        <select
          id="sh-st"
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

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="sh-txt">
          Your Story *
        </label>
        <div className="mb-3 flex flex-wrap gap-2">
          {SHARE_PROMPTS.map(([lbl, starter]) => (
            <button
              key={lbl}
              type="button"
              onClick={() =>
                setStory((prev) => (prev.trim() ? `${prev.trimEnd()}\n\n${starter}` : starter))
              }
              className="label-track border border-[#444444] px-3 py-1.5 text-[10px] text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
            >
              &ldquo;{lbl}…&rdquo;
            </button>
          ))}
        </div>
        <textarea
          id="sh-txt"
          rows={8}
          maxLength={6000}
          required
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="What happened, where you are today, and what is helping you keep standing."
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-[#8E8E8A]">{story.length} / 6000</p>
      </div>

      {showCare && (
        <aside className="border-l border-[#C5A059] pl-4 text-sm text-[#F5F5F0]">
          <strong>You don&apos;t have to carry tonight alone.</strong> Free confidential support
          is available 24/7 at{" "}
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

      <div className="space-y-3 text-sm text-[#8E8E8A]">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consentContact}
            onChange={(e) => setConsentContact(e.target.checked)}
            className="mt-1 accent-[#C5A059]"
          />
          <span>You can email me privately about my story.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consentFeature}
            onChange={(e) => setConsentFeature(e.target.checked)}
            className="mt-1 accent-[#C5A059]"
          />
          <span>
            You can feature my story in The Comeback File using my first name only. I will always
            be asked again before anything is published.
          </span>
        </label>
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
        className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Share Privately"}
      </button>
    </form>
  );
}
