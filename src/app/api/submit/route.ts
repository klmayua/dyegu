import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SUPABASE_URL = "https://hhnvirsisuxumwchntjf.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_m0LM4mqYT7DFhAocUafywQ_Pr00cwIJ";

const VALID_TABLES = new Set([
  "subscribers",
  "enquiries",
  "volunteers",
  "community_requests",
  "rebuilds",
]);
const VALID_LISTS = new Set(["comeback_file", "playbook_waitlist", "merch_waitlist"]);
const VALID_STAGES = new Set([
  "job",
  "money",
  "breakup",
  "health",
  "rejected",
  "later",
  "stuck",
  "grief",
]);
const VALID_ENQUIRY_KINDS = new Set(["talk", "workshop", "sponsor", "press", "other"]);
const VALID_COMMUNITY_KINDS = new Set(["circle", "session"]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CARE_SIGNAL_RE =
  /\b(suicid\w*|kill myself|end my life|self[- ]?harm|don'?t want to live|want to die|hopeless|overdose)\b/i;

const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const arr = (rateBuckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (arr.length >= 12) return true;
  arr.push(now);
  rateBuckets.set(ip, arr);
  if (rateBuckets.size > 500) {
    for (const [k, v] of rateBuckets) {
      if (!v.some((t) => now - t < windowMs)) rateBuckets.delete(k);
    }
  }
  return false;
}

const cleanStr = (v: unknown, max = 500): string => {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
};

const cleanArr = (v: unknown, maxItems = 12, maxLen = 60): string[] => {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => cleanStr(String(x), maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
};

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  if (!secret) return true;
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const d = (await r.json()) as { success?: boolean };
    return Boolean(d && d.success);
  } catch {
    return true;
  }
}

function validateAndShape(table: string, raw: Record<string, unknown>) {
  const email = cleanStr(raw.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };

  const site = "dyegu";
  let careFlag = false;

  if (table === "subscribers") {
    const list = VALID_LISTS.has(String(raw.list)) ? String(raw.list) : "comeback_file";
    const stage = VALID_STAGES.has(String(raw.stage)) ? String(raw.stage) : null;
    const interest = cleanArr(raw.interest, 10, 40);
    return {
      row: {
        email,
        list,
        site,
        consent: true,
        stage,
        interest: interest.length ? interest : null,
        source: list,
        page: cleanStr(raw.page || "/", 120),
        utm: cleanStr(raw.utm || "", 300) || null,
      },
      careFlag: false,
    };
  }

  if (table === "enquiries") {
    const name = cleanStr(raw.name, 120);
    const message = cleanStr(raw.message, 4000);
    if (!name || !message) return { error: "Please add your name and a short message." };
    const kind = VALID_ENQUIRY_KINDS.has(String(raw.kind)) ? String(raw.kind) : "other";
    return {
      row: {
        name,
        email,
        organisation: cleanStr(raw.organisation, 160) || null,
        kind,
        message,
        event_date: cleanStr(raw.event_date, 60) || null,
        budget: cleanStr(raw.budget, 60) || null,
        audience: cleanStr(raw.audience, 160) || null,
        site,
      },
      careFlag: false,
    };
  }

  if (table === "volunteers") {
    const full_name = cleanStr(raw.full_name, 120);
    const profession = cleanStr(raw.profession, 160);
    const profile_url = cleanStr(raw.profile_url, 300);
    if (!full_name || !profession) return { error: "Please add your name and your profession." };
    if (profile_url && !/^https?:\/\//i.test(profile_url)) {
      return { error: "Please give the full link, starting with https://" };
    }
    if (!raw.agreed_code) return { error: "Please read and agree to the volunteer code." };
    const stages = cleanArr(raw.stages, 10, 30).filter((s) => VALID_STAGES.has(s));
    const formats = cleanArr(raw.formats, 6, 30);
    return {
      row: {
        full_name,
        email,
        profession,
        credentials: cleanStr(raw.credentials, 300) || null,
        profile_url: profile_url || null,
        country: cleanStr(raw.country, 80) || null,
        timezone: cleanStr(raw.timezone, 80) || null,
        languages: cleanStr(raw.languages, 160) || null,
        stages,
        formats,
        hours_per_month: cleanStr(raw.hours_per_month, 40) || null,
        why: cleanStr(raw.why, 2000) || null,
        agreed_code: true,
        site,
      },
      careFlag: false,
    };
  }

  if (table === "community_requests") {
    const kind = VALID_COMMUNITY_KINDS.has(String(raw.kind)) ? String(raw.kind) : "circle";
    const stage = VALID_STAGES.has(String(raw.stage)) ? String(raw.stage) : null;
    const note = cleanStr(raw.note, 1500);
    if (!raw.agreed_terms) {
      return { error: "Please tick the box to confirm you've read the guidelines." };
    }
    if (kind === "circle" && !stage) {
      return { error: "Please choose the chapter closest to yours so we can match your cohort." };
    }
    careFlag = CARE_SIGNAL_RE.test(note);
    const topics = cleanArr(raw.topics, 12, 40);
    return {
      row: {
        kind,
        first_name: cleanStr(raw.first_name, 60) || null,
        email,
        stage,
        timezone: cleanStr(raw.timezone, 80) || null,
        topics: topics.length ? topics : null,
        note: note || null,
        agreed_terms: true,
        site,
      },
      careFlag,
    };
  }

  if (table === "rebuilds") {
    const story = cleanStr(raw.story, 6000);
    if (story.length < 20) {
      return { error: "Please tell us a little more (at least a couple of sentences)." };
    }
    const stage = VALID_STAGES.has(String(raw.stage)) ? String(raw.stage) : null;
    careFlag = CARE_SIGNAL_RE.test(story);
    return {
      row: {
        first_name: cleanStr(raw.first_name, 60) || null,
        email,
        stage,
        story,
        consent_contact: Boolean(raw.consent_contact),
        consent_feature: Boolean(raw.consent_feature),
        site,
      },
      careFlag,
    };
  }

  return { error: "Unsupported form." };
}

function buildConfirmationEmail(
  table: string,
  row: Record<string, unknown>,
  careFlag: boolean
) {
  const esc = (s: unknown) =>
    String(s || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)
    );
  const name = String(row.first_name || row.name || row.full_name || "friend");
  let subject = "Your 1-Page Wilderness Field Note · DYEGU";
  let headline = "Everything broke. Your story didn't.";
  let bodyHtml =
    '<p>Thank you for joining <strong>The Comeback File</strong>. Your printable <strong>1-Page Wilderness Field Note</strong> is ready right now: <a href="https://dyegu.co/field-note" style="color:#C5A059;">dyegu.co/field-note</a>.</p><p>Every Sunday at 15:00 WAT, we release one primary-sourced documentary on YouTube (<a href="https://youtube.com/@DYEGUOfficial?sub_confirmation=1" style="color:#C5A059;">@DYEGUOfficial</a>) alongside its companion dossier here.</p>';

  if (table === "subscribers" && row.list === "playbook_waitlist") {
    subject = "You're on The Rebuild Playbook early list · DYEGU";
    headline = "The Rebuild Playbook · January 2027";
    bodyHtml =
      "<p>You're on the founding waitlist for <strong>The Rebuild Playbook</strong> (opening January 2027). Subscribers receive first access at the early price.</p>";
  } else if (table === "subscribers" && row.list === "merch_waitlist") {
    subject = "The Studio Mug — you're on the preview list · DYEGU";
    headline = "The Studio Mug";
    bodyHtml =
      "<p>You're on the preview list for <strong>The Studio Mug</strong> (12 oz matte-black ceramic with the flat-gold phoenix). Nothing ships until physical samples clear our studio inspection.</p>";
  } else if (table === "enquiries") {
    subject = "We received your enquiry · DYEGU";
    headline = "Enquiry received.";
    bodyHtml = `<p>Thank you, ${esc(name)}. Our team has received your <strong>${esc(row.kind)}</strong> enquiry and will reply within a few working days.</p>`;
  } else if (table === "volunteers") {
    subject = "Thank you for applying to volunteer · DYEGU";
    headline = "Application received.";
    bodyHtml = `<p>Thank you, ${esc(name)}, for offering your expertise to people rebuilding. We review every application by hand and will reply within two weeks.</p>`;
  } else if (table === "community_requests") {
    const isCircle = row.kind === "circle";
    subject = isCircle
      ? "Founding Cohort Waitlist · Rebuild Circles · DYEGU"
      : "We noted your Rebuild Session topics · DYEGU";
    headline = isCircle ? "Founding Cohort Waitlist · Opens January 2027" : "Free Rebuild Sessions";
    bodyHtml = isCircle
      ? "<p>You're on the Founding Cohort Waitlist for Rebuild Circles (opening January 2027). Cohorts of 6–8 peers are matched by chapter and time zone — we'll write quietly when your room opens.</p>"
      : "<p>Thank you. The topics with the highest demand go onto the Q1 2027 calendar first, and we'll send your free invite as soon as your session is scheduled.</p>";
  } else if (table === "rebuilds") {
    subject = "Thank you for trusting us with your story · DYEGU";
    headline = "We received your story.";
    bodyHtml =
      "<p>Thank you for sharing your rebuild privately. Real people read every story and nothing is ever published without asking you again first.</p>";
  }

  const careBlock = careFlag
    ? `<div style="margin:24px 0;padding:16px;border-left:1px solid #C5A059;background:#000000;color:#F5F5F0;"><strong>If things feel overwhelming right now:</strong> you don't have to carry this alone. Free, confidential support is available 24/7 at <a href="https://findahelpline.com" style="color:#C5A059;">findahelpline.com</a>.</div>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#000000;color:#F5F5F0;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #444444;padding:36px 32px;background:#000000;">
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C5A059;">D Y E G U · DON'T YOU EVER GIVE UP</p>
    <h1 style="margin:0 0 18px;font-size:30px;font-weight:500;color:#F5F5F0;">${headline}</h1>
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#F5F5F0;">${bodyHtml}${careBlock}</div>
    <hr style="border:0;border-top:1px solid #444444;margin:28px 0;">
    <p style="margin:0;font-style:italic;font-size:18px;color:#C5A059;">“Until the next story… don't you ever give up.”</p>
    <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8E8E8A;">DYEGU (@DYEGUOfficial) · <a href="https://dyegu.co" style="color:#C5A059;text-decoration:none;">dyegu.co</a></p>
  </div></body></html>`;

  return { subject, html };
}

async function sendConfirmationEmail(
  table: string,
  row: Record<string, unknown>,
  careFlag: boolean
) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const email = typeof row.email === "string" ? row.email : "";
  if (!apiKey || !email) return;
  const from = (process.env.RESEND_FROM || "DYEGU <hello@dyegu.co>").trim();
  const { subject, html } = buildConfirmationEmail(table, row, careFlag);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [email], subject, html }),
    });
  } catch {
    // non-fatal
  }
}

async function sendTeamAlert(
  table: string,
  row: Record<string, unknown>,
  careFlag: boolean
) {
  const hook = (process.env.TEAM_ALERT_WEBHOOK_URL || "").trim();
  if (!hook) return;
  const shouldAlert =
    careFlag || table === "enquiries" || table === "volunteers" || table === "rebuilds";
  if (!shouldAlert) return;
  const label = careFlag ? `[CARE REVIEW · ${table}]` : `[DYEGU · ${table}]`;
  const summary =
    table === "enquiries"
      ? `${row.name} (${row.organisation || "—"}) · ${row.kind} · budget: ${row.budget || "TBC"}`
      : table === "volunteers"
        ? `${row.full_name} · ${row.profession} · ${row.country || "—"}`
        : `${row.first_name || "Anonymous"} · stage: ${row.stage || "—"}`;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "dyegu_submission",
        table,
        care_review: careFlag,
        text: `${label} ${summary}`,
        data: {
          ...row,
          story: typeof row.story === "string" ? `${row.story.slice(0, 280)}…` : undefined,
        },
      }),
    });
  } catch {
    // non-fatal
  }
}

export async function POST(req: NextRequest) {
  const ip = (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  ).trim();

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (cleanStr(body.honeypot || "", 100)) {
    return NextResponse.json({ status: "ok" });
  }

  const table = cleanStr(body.table, 40);
  if (!VALID_TABLES.has(table)) {
    return NextResponse.json({ error: "Unknown submission target." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(cleanStr(body.turnstileToken || "", 2048), ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Verification failed. Please refresh and try again." },
      { status: 400 }
    );
  }

  const shaped = validateAndShape(table, (body.row as Record<string, unknown>) || {});
  if ("error" in shaped && shaped.error) {
    return NextResponse.json({ error: shaped.error }, { status: 400 });
  }

  const { row, careFlag } = shaped as { row: Record<string, unknown>; careFlag: boolean };
  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL)
    .trim()
    .replace(/\/$/, "");
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_KEY
  ).trim();

  const payload: Record<string, unknown> = { ...row };
  if (
    careFlag &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    (table === "rebuilds" || table === "community_requests")
  ) {
    payload.priority_flag = "care_review";
  }

  try {
    const headers: Record<string, string> = {
      apikey: supabaseKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      headers.Authorization = `Bearer ${supabaseKey}`;
    }

    const r = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (r.status === 409) {
      return NextResponse.json({ status: "exists" });
    }
    if (!r.ok) {
      return NextResponse.json(
        { error: "Could not save right now. Please try again in a moment." },
        { status: 502 }
      );
    }

    await Promise.allSettled([
      sendConfirmationEmail(table, row, careFlag),
      sendTeamAlert(table, row, careFlag),
    ]);

    return NextResponse.json({ status: "ok", care: careFlag });
  } catch {
    return NextResponse.json(
      { error: "Network error. Please try again in a moment." },
      { status: 502 }
    );
  }
}
