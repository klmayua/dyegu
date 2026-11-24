/* DYEGU site — one config block, no build step. */
(() => {
  const CONFIG = {
    // Supabase project "DYEGU360" (eu-west-2). Publishable key: safe in the browser;
    // the tables only allow anonymous INSERT (row-level security), never reads.
    supabaseUrl: "https://hhnvirsisuxumwchntjf.supabase.co",
    supabaseKey: "sb_publishable_m0LM4mqYT7DFhAocUafywQ_Pr00cwIJ",
    site: "dyegu.co",
    premiere: "2026-12-06T14:00:00Z", // Ep 01, Sun 6 Dec 2026, 15:00 WAT
    // Follow row: add each account once its handle is claimed (Social Stack: T1/T2 for DYEGU).
    follow: [
      ["YouTube", "https://www.youtube.com/@DYEGUOfficial"],
      ["Instagram", "https://www.instagram.com/dyegulive"],
      ["X", "https://x.com/dyegulive"],
      ["Facebook", "https://www.facebook.com/dyegulive"],
      // ["TikTok", "https://www.tiktok.com/@dyegulive"],
      // ["LinkedIn", "https://www.linkedin.com/in/<sir-k>"],
      // ["WhatsApp", "https://whatsapp.com/channel/<id>"],
    ],
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* Follow row */
  const follow = $("#follow");
  if (follow) {
    $$("a", follow).forEach(a => a.remove());
    CONFIG.follow.forEach(([name, href]) => {
      const a = document.createElement("a");
      a.href = href; a.textContent = name; a.target = "_blank"; a.rel = "noopener";
      follow.appendChild(a);
    });
  }

  /* Local-time labels */
  const fmtDay = d => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = d => d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const now = () => Date.now();
  $$(".ep[data-date]").forEach(ep => {
    const d = new Date(ep.dataset.date);
    const when = $(".ep-when", ep);
    if (when) when.textContent = (d.getTime() > now() ? "Premieres " : "Out now · ") + fmtDay(d) + " · " + fmtTime(d);
  });
  const prem = new Date(CONFIG.premiere);
  const pt = $("#premiere-time");
  if (pt) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      pt.textContent = `${fmtTime(prem)} your time (${tz.replace(/_/g, " ")}) · 15:00 WAT · 14:00 GMT · 09:00 ET`;
    } catch (_) {}
  }

  /* Countdown */
  const cd = $("#countdown");
  const tick = () => {
    if (!cd) return;
    let s = Math.max(0, Math.floor((prem - now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60);
    $('[data-u="d"]', cd).textContent = d;
    $('[data-u="h"]', cd).textContent = String(h).padStart(2, "0");
    $('[data-u="m"]', cd).textContent = String(m).padStart(2, "0");
  };
  tick(); setInterval(tick, 30000);

  /* Supabase insert (insert-only, no reads) */
  async function insert(table, row, attempt = 0) {
    const r = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: { "apikey": CONFIG.supabaseKey, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(row),
    });
    if (r.status === 409) return "exists";
    if ((r.status >= 500 || r.status === 401) && attempt < 1) { await new Promise(ok => setTimeout(ok, 1200)); return insert(table, row, attempt + 1); }
    if (!r.ok) throw new Error(String(r.status));
    return "ok";
  }
  const loadedAt = now();
  const looksLikeBot = form => (form.company && form.company.value) || now() - loadedAt < 2500;
  const validEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  const say = (form, text, cls) => { const m = $(".form-msg", form); m.textContent = text; m.className = "form-msg " + cls; };

  $$("form.signup").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!validEmail(email)) return say(form, "Please enter a valid email address.", "err");
      if (looksLikeBot(form)) return say(form, "You're on the list. Thank you.", "ok");
      const btn = $("button", form); btn.disabled = true;
      try {
        const res = await insert("subscribers", { email, list: form.dataset.list, source: form.dataset.source, site: CONFIG.site, consent: true });
        form.email.value = "";
        say(form, res === "exists" ? "You're already on the list. See you Sunday." :
          form.dataset.list === "playbook_waitlist" ? "You're on the waitlist. We'll email you at launch." :
          "You're in. The first Comeback File lands with Episode 01.", "ok");
      } catch (_) {
        say(form, "Something went wrong. Please try again in a moment.", "err");
      } finally { btn.disabled = false; }
    });
  });

  const enquiry = $("form.enquiry");
  if (enquiry) enquiry.addEventListener("submit", async e => {
    e.preventDefault();
    const f = enquiry, row = {
      name: f.name.value.trim(), email: f.email.value.trim(), organisation: f.organisation.value.trim() || null,
      kind: f.kind.value, message: f.message.value.trim(), site: CONFIG.site,
    };
    if (!row.name || !row.message) return say(f, "Please add your name and a short message.", "err");
    if (!validEmail(row.email)) return say(f, "Please enter a valid email address.", "err");
    if (looksLikeBot(f)) return say(f, "Thank you. We'll be in touch.", "ok");
    const btn = $("button", f); btn.disabled = true;
    try { await insert("enquiries", row); f.reset(); say(f, "Thank you. Sir K's team will reply within a few working days.", "ok"); }
    catch (_) { say(f, "Something went wrong. Please try again in a moment.", "err"); }
    finally { btn.disabled = false; }
  });

  /* Episode library + latest episode, pulled from YouTube via /api/episodes once the channel is set */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  fetch("/api/episodes").then(r => r.ok ? r.json() : null).then(data => {
    const items = data && Array.isArray(data.items) ? data.items.filter(v => /^[\w-]{11}$/.test(v.id)) : [];
    if (!items.length) return;
    const list = $("#episode-list");
    list.innerHTML = items.slice(0, 9).map(v => `
      <a class="ep" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <img class="ep-thumb" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="270">
        <h3 class="ep-subject">${esc(v.title)}</h3>
        <p class="ep-when">${esc(fmtDay(new Date(v.published)))}</p>
      </a>`).join("");
    if (prem.getTime() <= now()) {
      const v = items[0], box = $("#latest");
      box.innerHTML = `<p class="eyebrow">Latest episode</p>
        <button class="player" type="button" aria-label="Play: ${esc(v.title)}"></button>
        <p class="latest-title">${esc(v.title)}</p>`;
      $(".player", box).style.backgroundImage = `url(https://i.ytimg.com/vi/${v.id}/hqdefault.jpg)`;
      $(".player", box).addEventListener("click", function () {
        this.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      }, { once: true });
    }
  }).catch(() => {});
})();
