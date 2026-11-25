"use client";

import React, { useState } from "react";
import { submitToDyegu } from "@/lib/submit-client";

export function EnquiryFormClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [kind, setKind] = useState("talk");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [audience, setAudience] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a short message.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await submitToDyegu(
        "enquiries",
        {
          name: name.trim(),
          email: email.trim(),
          organisation: org.trim() || null,
          kind,
          event_date: eventDate.trim() || null,
          budget: budget || null,
          audience: audience.trim() || null,
          message: message.trim(),
        },
        honeypot
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send enquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-[rgba(197,160,89,0.60)] p-6">
        <p className="label-track text-[#C5A059]">Enquiry Received</p>
        <p className="mt-2 font-display text-2xl text-[#F5F5F0]">
          Thank you. Our team will reply within a few working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-n">
            Name *
          </label>
          <input
            id="eq-n"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-e">
            Email *
          </label>
          <input
            id="eq-e"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-o">
            Organisation
          </label>
          <input
            id="eq-o"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-k">
            Enquiry Type
          </label>
          <select
            id="eq-k"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          >
            <option value="talk">Talk or keynote</option>
            <option value="workshop">Workshop</option>
            <option value="sponsor">Sponsorship</option>
            <option value="press">Press</option>
            <option value="other">Editorial correction / Other</option>
          </select>
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-d">
            Date or Timing
          </label>
          <input
            id="eq-d"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            placeholder="e.g. March 2027"
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-b">
            Budget
          </label>
          <select
            id="eq-b"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          >
            <option value="">Prefer to discuss</option>
            <option>Under $1,000</option>
            <option>$1,000–$3,000</option>
            <option>$3,000–$7,500</option>
            <option>$7,500+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-a">
          Audience
        </label>
        <input
          id="eq-a"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Who, how many, in person or online"
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
        />
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="eq-m">
          Message *
        </label>
        <textarea
          id="eq-m"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
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
        className="label-track border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-[#000000] hover:bg-[#000000] hover:text-[#C5A059] disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Check Availability"}
      </button>
    </form>
  );
}
