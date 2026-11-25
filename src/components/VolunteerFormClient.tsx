"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { STAGES, VOLUNTEER_FORMATS } from "@/lib/dyegu-data";
import { submitToDyegu } from "@/lib/submit-client";

export function VolunteerFormClient() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState("");
  const [profession, setProfession] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [credentials, setCredentials] = useState("");
  const [formats, setFormats] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [hours, setHours] = useState("1/month");
  const [why, setWhy] = useState("");
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

  const toggle = (list: string[], setList: (v: string[]) => void, key: string) =>
    setList(list.includes(key) ? list.filter((x) => x !== key) : [...list, key]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !profession.trim()) {
      setError("Please add your name and your profession.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (profileUrl.trim() && !/^https?:\/\//i.test(profileUrl.trim())) {
      setError("Please enter the full link starting with https://");
      return;
    }
    if (!agreed) {
      setError("Please confirm you agree to the volunteer code.");
      return;
    }
    setSubmitting(true);
    try {
      await submitToDyegu(
        "volunteers",
        {
          full_name: fullName.trim(),
          email: email.trim(),
          profession: profession.trim(),
          credentials: credentials.trim() || null,
          profile_url: profileUrl.trim() || null,
          country: country.trim() || null,
          timezone: timezone || null,
          languages: languages.trim() || null,
          stages,
          formats,
          hours_per_month: hours,
          why: why.trim() || null,
          agreed_code: true,
        },
        honeypot
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-[rgba(197,160,89,0.60)] p-6">
        <p className="label-track text-[#C5A059]">Application Received</p>
        <p className="mt-2 font-display text-2xl text-[#F5F5F0]">
          Thank you. We vet every application manually and will reply within two weeks.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-n">
            Full Name *
          </label>
          <input
            id="v-n"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-e">
            Email *
          </label>
          <input
            id="v-e"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-c">
            Country
          </label>
          <input
            id="v-c"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-l">
            Languages
          </label>
          <input
            id="v-l"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="English, French, Hausa…"
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-p">
            Profession / Expertise *
          </label>
          <input
            id="v-p"
            required
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
        <div>
          <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-u">
            LinkedIn or Website
          </label>
          <input
            id="v-u"
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="https://"
            className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] placeholder:text-[#8E8E8A] focus:border-[#C5A059] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-cr">
          Qualifications / Licences (for regulated professions)
        </label>
        <input
          id="v-cr"
          value={credentials}
          onChange={(e) => setCredentials(e.target.value)}
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
        />
      </div>

      <div>
        <p className="label-track text-[#8E8E8A] mb-2">Formats</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {VOLUNTEER_FORMATS.map(([k, lbl]) => (
            <label
              key={k}
              className="flex cursor-pointer items-start gap-3 border border-[#444444] p-3 text-sm text-[#F5F5F0]/90"
            >
              <input
                type="checkbox"
                checked={formats.includes(k)}
                onChange={() => toggle(formats, setFormats, k)}
                className="mt-1 accent-[#C5A059]"
              />
              <span>{lbl}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label-track text-[#8E8E8A] mb-2">Chapters you know best</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {STAGES.map((s) => (
            <label
              key={s.key}
              className="flex cursor-pointer items-start gap-3 border border-[#444444] p-3 text-sm text-[#F5F5F0]/90"
            >
              <input
                type="checkbox"
                checked={stages.includes(s.key)}
                onChange={() => toggle(stages, setStages, s.key)}
                className="mt-1 accent-[#C5A059]"
              />
              <span>{s.short}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-h">
          Time you can give
        </label>
        <select
          id="v-h"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
        >
          <option value="1/month">About an hour a month</option>
          <option value="2-4/month">2–4 hours a month</option>
          <option value="1/quarter">An hour a quarter</option>
          <option value="one-off">A one-off session</option>
        </select>
      </div>

      <div>
        <label className="label-track block text-[#8E8E8A] mb-2" htmlFor="v-w">
          Why do you want to volunteer? (optional)
        </label>
        <textarea
          id="v-w"
          rows={4}
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          className="w-full border border-[#444444] bg-[#000000] px-4 py-3 text-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
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
          I agree to the{" "}
          <Link href="/community/guidelines" className="text-[#C5A059] underline">
            volunteer code
          </Link>
          : zero pitching or soliciting, general guidance only, strict confidentiality.
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
        {submitting ? "Submitting…" : "Offer an Hour"}
      </button>
    </form>
  );
}
