// POST /api/submit — Hardened DYEGU form proxy.
// Validates payloads, enforces lightweight rate limiting + optional Cloudflare Turnstile,
// inserts into Supabase, sends branded confirmation emails via Resend, and fires priority team alerts.
//
// Env vars (configure in Vercel Project Settings):
//   SUPABASE_URL                (defaults to DYEGU360 eu-west-2 project)
//   SUPABASE_SERVICE_ROLE_KEY   (recommended; falls back to SUPABASE_ANON_KEY for insert-only RLS)
//   RESEND_API_KEY              (optional; enables branded transactional confirmation emails)
//   RESEND_FROM                 (default: "Sir K · DYEGU <hello@dyegu.co>")
//   TEAM_ALERT_WEBHOOK_URL      (optional; n8n / Slack / Discord webhook for enquiries, volunteers & care alerts)
//   TURNSTILE_SECRET_KEY        (optional; enables Cloudflare Turnstile bot verification)

const DEFAULT_SUPABASE_URL = "https://hhnvirsisuxumwchntjf.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_m0LM4mqYT7DFhAocUafywQ_Pr00cwIJ";

const VALID_TABLES = new Set(["subscribers", "enquiries", "volunteers", "community_requests", "rebuilds"]);
const VALID_LISTS = new Set(["comeback_file", "playbook_waitlist", "merch_waitlist"]);
const VALID_STAGES = new Set(["job", "money", "breakup", "health", "rejected", "later", "stuck", "grief"]);
const VALID_ENQUIRY_KINDS = new Set(["talk", "workshop", "sponsor", "press", "other"]);
const VALID_COMMUNITY_KINDS = new Set(["circle", "session"]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CARE_SIGNAL_RE = /\b(suicid\w*|kill myself|end my life|self[- ]?harm|don'?t want to live|want to die|hopeless|overdose)\b/i;

// Lightweight per-instance sliding window rate limit (12 requests / 10 min per IP)
const rateBuckets = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const arr = (rateBuckets.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= 12) return true;
  arr.push(now);
  rateBuckets.set(ip, arr);
  if (rateBuckets.size > 500) {
    for (const [k, v] of rateBuckets) if (!v.some(t => now - t < windowMs)) rateBuckets.delete(k);
  }
  return false;
}

const cleanStr = (v, max = 500) => {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
};
const cleanArr = (v, maxItems = 12, maxLen = 60) => {
  if (!Array.isArray(v)) return [];
  return v.map(x => cleanStr(String(x), maxLen)).filter(Boolean).slice(0, maxItems);
};

async function verifyTurnstile(token, ip) {
  const secret = (process.env.TURNSTILE_SECRET_KEY || "").trim();
  if (!secret) return true;
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const d = await r.json();
    return Boolean(d && d.success);
  } catch (_) {
    return true; // fail open on upstream network outage so real users aren't blocked
  }
}

function validateAndShape(table, raw) {
  const email = cleanStr(raw.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };

  const site = "dyegu";
  let careFlag = false;

  if (table === "subscribers") {
    const list = VALID_LISTS.has(raw.list) ? raw.list : "comeback_file";
    const stage = VALID_STAGES.has(raw.stage) ? raw.stage : null;
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
    const kind = VALID_ENQUIRY_KINDS.has(raw.kind) ? raw.kind : "other";
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
    if (profile_url && !/^https?:\/\//i.test(profile_url)) return { error: "Please give the full link, starting with https://" };
    if (!raw.agreed_code) return { error: "Please read and agree to the volunteer code." };
    const stages = cleanArr(raw.stages, 10, 30).filter(s => VALID_STAGES.has(s));
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
    const kind = VALID_COMMUNITY_KINDS.has(raw.kind) ? raw.kind : "circle";
    const stage = VALID_STAGES.has(raw.stage) ? raw.stage : null;
    const note = cleanStr(raw.note, 1500);
    if (!raw.agreed_terms) return { error: "Please tick the box to confirm you've read the guidelines." };
    if (kind === "circle" && !stage) return { error: "Please choose the stage closest to yours so we can match your circle." };
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
    if (story.length < 20) return { error: "Please tell us a little more (at least a couple of sentences)." };
    const stage = VALID_STAGES.has(raw.stage) ? raw.stage : null;
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

function buildConfirmationEmail(table, row, careFlag) {
  const esc = s => String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const name = row.first_name || row.name || row.full_name || "friend";
  let subject = "You're in — DYEGU";
  let headline = "Welcome to DYEGU.";
  let bodyHtml = "<p>Thank you for joining <strong>The Comeback File</strong>. Every Sunday, Sir K shares one documented comeback story, one clear lesson, and one move for your week.</p>";

  if (table === "subscribers" && row.list === "playbook_waitlist") {
    subject = "You're on The Rebuild Playbook early list · DYEGU";
    headline = "The Rebuild Playbook";
    bodyHtml = "<p>You're on the waitlist for <strong>The Rebuild Playbook</strong> (launching January 2027). Subscribers get first access at the early price.</p>";
  } else if (table === "subscribers" && row.list === "merch_waitlist") {
    subject = "Drop 01: Rise — you're on the early list · DYEGU";
    headline = "Drop 01 · Rise";
    const items = (row.interest || []).length ? `<p>Noted interests: <strong>${esc(row.interest.join(", "))}</strong>.</p>` : "";
    bodyHtml = `<p>You're on the drop list for <strong>Rise</strong>. We're matching our flat gold on real samples before anything ships—you'll hear first when the drop opens.</p>${items}`;
  } else if (table === "enquiries") {
    subject = "We received your enquiry · DYEGU";
    headline = "Enquiry received.";
    bodyHtml = `<p>Thank you, ${esc(name)}. Sir K's team has received your <strong>${esc(row.kind)}</strong> enquiry and will reply within a few working days.</p>`;
  } else if (table === "volunteers") {
    subject = "Thank you for applying to volunteer · DYEGU Community";
    headline = "Application received.";
    bodyHtml = `<p>Thank you, ${esc(name)}, for offering your expertise to people rebuilding. We review every application by hand and will reply within two weeks.</p>`;
  } else if (table === "community_requests") {
    const isCircle = row.kind === "circle";
    subject = isCircle ? "You're on the Rebuild Circles list · DYEGU" : "We noted your Rebuild Session topics · DYEGU";
    headline = isCircle ? "Rebuild Circles" : "Free Rebuild Sessions";
    bodyHtml = isCircle
      ? "<p>You're on the list. Rebuild Circles are matched by stage and time zone in groups of 6–8—we'll email you as soon as your circle is ready to open.</p>"
      : "<p>Thank you. The topics with the most requests are scheduled first, and we'll send your free invite as soon as your sessions are on the calendar.</p>";
  } else if (table === "rebuilds") {
    subject = "Thank you for trusting us with your story · DYEGU";
    headline = "We received your story.";
    bodyHtml = "<p>Thank you for sharing your rebuild with us. We read every story privately and never publish anything without asking you again first.</p>";
  }

  const careBlock = careFlag
    ? `<div style="margin:24px 0;padding:16px;border-left:2px solid #C5A059;background:#0d0d0d;color:#ECE7DC;"><strong>If things feel overwhelming right now:</strong> you don't have to carry this alone. Free, confidential support is available 24/7 at <a href="https://findahelpline.com" style="color:#C5A059;">findahelpline.com</a>.</div>`
    : "";

  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#000000;color:#ECE7DC;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #262626;padding:36px 32px;background:#050505;">
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C5A059;">DYEGU · DON'T YOU EVER GIVE UP</p>
    <h1 style="margin:0 0 18px;font-size:30px;font-weight:500;color:#ECE7DC;">${headline}</h1>
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#cfcabf;">${bodyHtml}${careBlock}</div>
    <hr style="border:0;border-top:1px solid #222;margin:28px 0;">
    <p style="margin:0;font-style:italic;font-size:18px;color:#C5A059;">“Until the next story… don't you ever give up.”</p>
    <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8a857b;">Sir K · <a href="https://dyegu.co" style="color:#C5A059;text-decoration:none;">dyegu.co</a></p>
  </div></body></html>`;

  return { subject, html };
}

async function sendConfirmationEmail(table, row, careFlag) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey || !row.email) return;
  const from = (process.env.RESEND_FROM || "Sir K · DYEGU <hello@dyegu.co>").trim();
  const { subject, html } = buildConfirmationEmail(table, row, careFlag);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [row.email], subject, html }),
    });
  } catch (_) {}
}

async function sendTeamAlert(table, row, careFlag) {
  const hook = (process.env.TEAM_ALERT_WEBHOOK_URL || "").trim();
  if (!hook) return;
  const shouldAlert = careFlag || table === "enquiries" || table === "volunteers" || table === "rebuilds";
  if (!shouldAlert) return;
  const label = careFlag ? `[CARE REVIEW · ${table}]` : `[DYEGU · ${table}]`;
  const summary =
    table === "enquiries"
      ? `${row.name} (${row.organisation || "—"}) · ${row.kind} · budget: ${row.budget || "TBC"} · date: ${row.event_date || "TBC"}`
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
        data: { ...row, story: row.story ? `${row.story.slice(0, 280)}…` : undefined },
      }),
    });
  } catch (_) {}
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ip = ((req.headers["x-forwarded-for"] || "").toString().split(",")[0] || req.socket?.remoteAddress || "unknown").trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a few minutes and try again." });
  }

  const body = typeof req.body === "string" ? (() => { try { return JSON.parse(req.body); } catch (_) { return null; } })() : req.body;
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Invalid request payload." });

  // Honeypot: silently succeed without writing
  if (cleanStr(body.honeypot || "", 100)) {
    return res.status(200).json({ status: "ok" });
  }

  const table = cleanStr(body.table, 40);
  if (!VALID_TABLES.has(table)) return res.status(400).json({ error: "Unknown submission target." });

  const turnstileOk = await verifyTurnstile(cleanStr(body.turnstileToken || "", 2048), ip);
  if (!turnstileOk) return res.status(400).json({ error: "Verification failed. Please refresh and try again." });

  const { row, careFlag, error } = validateAndShape(table, body.row || {});
  if (error) return res.status(400).json({ error });

  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, "");
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY).trim();

  // Only include priority_flag when using service role key (anon RLS may restrict column grants)
  const payload = { ...row };
  if (careFlag && process.env.SUPABASE_SERVICE_ROLE_KEY && (table === "rebuilds" || table === "community_requests")) {
    payload.priority_flag = "care_review";
  }

  try {
    const headers = {
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
      return res.status(200).json({ status: "exists" });
    }
    if (!r.ok) {
      return res.status(502).json({ error: "Could not save right now. Please try again in a moment." });
    }

    // Fire confirmation email & team alert concurrently (best effort)
    await Promise.allSettled([
      sendConfirmationEmail(table, row, careFlag),
      sendTeamAlert(table, row, careFlag),
    ]);

    return res.status(200).json({ status: "ok", care: careFlag });
  } catch (_) {
    return res.status(502).json({ error: "Network error. Please try again in a moment." });
  }
}
