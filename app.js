/* DYEGU site — behavioral consolation & conversion runtime v3. */
(() => {
  document.documentElement.classList.add("js-ready");

  const CONFIG = {
    submitApi: "/api/submit",
    supabaseUrl: "https://hhnvirsisuxumwchntjf.supabase.co",
    supabaseKey: "sb_publishable_m0LM4mqYT7DFhAocUafywQ_Pr00cwIJ",
    site: "dyegu",
    premiere: "2026-12-06T14:00:00Z",
    follow: [
      ["YouTube", "https://www.youtube.com/@DYEGUOfficial"],
      ["Instagram", "https://www.instagram.com/dyegulive"],
      ["X", "https://x.com/dyegulive"],
      ["Facebook", "https://www.facebook.com/dyegulive"],
    ],
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const now = () => Date.now();
  const esc = s => String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) {} },
  };
  const local = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  };
  const track = (name, data = {}) => {
    try { window.va && window.va("event", { name, data }); } catch (_) {}
  };

  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  /* Optional Day / Quiet-Night Reading Comfort Toggle (E-14) */
  const comfortBtn = $("[data-comfort-toggle]");
  const savedComfort = local.get("dyegu_comfort");
  if (savedComfort === "night") document.documentElement.dataset.comfort = "night";
  const syncComfortBtn = () => {
    if (!comfortBtn) return;
    const isNight = document.documentElement.dataset.comfort === "night";
    comfortBtn.textContent = isNight ? "Daylight" : "Night";
    comfortBtn.setAttribute("aria-pressed", String(isNight));
  };
  syncComfortBtn();
  comfortBtn?.addEventListener("click", () => {
    const next = document.documentElement.dataset.comfort === "night" ? "" : "night";
    if (next) document.documentElement.dataset.comfort = next;
    else delete document.documentElement.dataset.comfort;
    local.set("dyegu_comfort", next);
    syncComfortBtn();
    track("reading_comfort", { mode: next || "daylight" });
  });

  /* Reading progress hairline */
  const progressBar = $(".read-progress");
  if (progressBar) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progressBar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* Subtle editorial scroll reveals */
  const reveals = $$("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  /* Mobile menu */
  const menuBtn = $(".menu-btn"), mnav = $("#mobile-nav");
  if (menuBtn && mnav) menuBtn.addEventListener("click", () => {
    const open = mnav.hidden;
    mnav.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  /* Follow links */
  $$("[data-follow]").forEach(box => {
    CONFIG.follow.forEach(([name, href]) => {
      const a = document.createElement("a");
      a.href = href; a.textContent = name; a.target = "_blank"; a.rel = "noopener";
      box.appendChild(a);
    });
  });

  /* Social-Media Arrival Context Personalization + Campaign Attribution + Stage Memory (E-09, W-06) */
  (() => {
    const p = new URLSearchParams(location.search);
    const parts = [];
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(k => p.get(k) && parts.push(`${k.slice(4)}=${p.get(k)}`));
    if (parts.length && !session.get("utm")) session.set("utm", parts.join("&").slice(0, 300));
    if (!session.get("landing")) session.set("landing", location.pathname.slice(0, 120));

    const pathStage = location.pathname.match(/^\/start\/([a-z]+)\/?$/);
    const qStage = p.get("stage");
    if (pathStage) session.set("stage", pathStage[1]);
    else if (qStage) session.set("stage", qStage);

    const savedStage = session.get("stage");
    if (savedStage) {
      $$('select[name="stage"]').forEach(sel => {
        if (!sel.value && [...sel.options].some(o => o.value === savedStage)) sel.value = savedStage;
      });
    }

    const ribbon = $("[data-arrival-banner]");
    if (ribbon) {
      const from = (p.get("from") || p.get("utm_source") || "").toLowerCase();
      const story = (p.get("story") || "").toLowerCase();
      let msg = "";
      let linkHref = "/#start", linkText = "Tell us what you're carrying ↓";
      if (from === "friend" || from === "whatsapp") {
        msg = "<strong>Sent by someone in your corner.</strong> Take your time here — zero pressure, no hype.";
      } else if (story === "steve-jobs") {
        msg = "<strong>Arriving from Steve Jobs's story?</strong> Read all 49 verified sources or pick where you are today.";
        linkHref = "/stories/steve-jobs"; linkText = "Open Steve Jobs dossier →";
      } else if (story === "jk-rowling") {
        msg = "<strong>Arriving from J.K. Rowling's story?</strong> Explore the verified timeline or start with your own chapter.";
        linkHref = "/stories/jk-rowling"; linkText = "Open J.K. Rowling dossier →";
      } else if (story === "tyler-perry") {
        msg = "<strong>Arriving from Tyler Perry's story?</strong> Explore the full dossier or pick one small move for tonight.";
        linkHref = "/stories/tyler-perry"; linkText = "Open Tyler Perry dossier →";
      } else if (from === "youtube" || from === "yt" || from === "instagram" || from === "ig" || from === "tiktok" || from === "x") {
        msg = "<strong>Glad you found your way here.</strong> Start with what you're carrying today — everything below is free.";
      }
      if (msg) {
        ribbon.hidden = false;
        const textEl = $("[data-arrival-text]", ribbon);
        const ctaEl = $("[data-arrival-cta]", ribbon);
        if (textEl) textEl.innerHTML = msg;
        if (ctaEl) { ctaEl.href = linkHref; ctaEl.textContent = linkText; }
      }
    }
  })();

  /* Dates in visitor's own local time */
  const fmtDay = d => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const fmtLong = d => d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const fmtTime = d => d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  $$(".ep[data-date]").forEach(ep => {
    const d = new Date(ep.dataset.date), w = $(".ep-when", ep);
    if (w) w.textContent = (d.getTime() > now() ? "Premieres " : "Out now · ") + fmtDay(d) + " · " + fmtTime(d);
  });
  $$("[data-when]").forEach(el => {
    const d = new Date(el.dataset.when);
    el.textContent = (d > now() ? "Premieres " : "Out now · ") + fmtDay(d);
  });
  $$("[data-when-long]").forEach(el => (el.textContent = fmtLong(new Date(el.dataset.whenLong))));
  $$("[data-premiere-time]").forEach(pt => {
    const host = pt.closest("[data-date]");
    const target = new Date(host ? host.dataset.date : CONFIG.premiere);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
      pt.textContent = `${fmtTime(target)} your time (${tz}) · 15:00 WAT · 14:00 GMT · 09:00 ET`;
    } catch (_) {}
  });

  /* Time zone auto-fill */
  const fillTz = () => {
    try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; $$("[data-tz]").forEach(i => (i.value = tz)); } catch (_) {}
  };
  fillTz();

  /* Official Ident Cinema Modal (sting.mp4 — calm, click-to-play) */
  const stingModal = $("#sting-modal");
  if (stingModal) {
    const vid = $("video", stingModal);
    const close = () => {
      stingModal.hidden = true;
      if (vid) { vid.pause(); vid.currentTime = 0; }
    };
    $$("[data-open-sting]").forEach(btn => btn.addEventListener("click", () => {
      stingModal.hidden = false;
      if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
      track("sting_played");
    }));
    $("[data-close-sting]", stingModal)?.addEventListener("click", close);
    stingModal.addEventListener("click", e => { if (e.target === stingModal) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !stingModal.hidden) close(); });
  }

  /* 3-State Emotional Readiness Switch (E-03) */
  const readinessWrap = $("[data-readiness]");
  if (readinessWrap) {
    const tabs = $$("[data-readiness-tab]", readinessWrap);
    const panes = $$("[data-readiness-pane]", readinessWrap);
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.readinessTab;
        tabs.forEach(t => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", String(on));
        });
        panes.forEach(p => { p.hidden = p.dataset.readinessPane !== mode; });
        track("readiness_mode", { mode });
      });
    });
  }

  /* 60-Second Physiological Sigh Grounding Ritual (4s in · 6s out) (E-04) */
  const breathBtn = $("[data-breath-start]");
  const breathRing = $("[data-breath-ring]");
  const breathCue = $("[data-breath-cue]");
  if (breathBtn && breathRing && breathCue) {
    let timer = null, running = false, cycle = 0;
    const stop = () => {
      running = false;
      clearTimeout(timer);
      breathRing.className = "breath-ring";
      breathRing.textContent = "Ready";
      breathCue.textContent = "Six slow cycles · 4 seconds in, 6 seconds out.";
      breathBtn.textContent = "Start 60-second exhale";
    };
    const step = () => {
      if (!running) return;
      if (cycle >= 6) {
        running = false;
        breathRing.className = "breath-ring";
        breathRing.textContent = "Steady";
        breathCue.textContent = "Well done. Take your time — nothing here is rushing you.";
        breathBtn.textContent = "Run again";
        return;
      }
      cycle++;
      breathRing.className = "breath-ring inhale";
      breathRing.textContent = "Breathe in";
      breathCue.textContent = `Cycle ${cycle} of 6 · Slow breath in through your nose (4 seconds)…`;
      timer = setTimeout(() => {
        if (!running) return;
        breathRing.className = "breath-ring exhale";
        breathRing.textContent = "Let go";
        breathCue.textContent = `Cycle ${cycle} of 6 · Long, unhurried breath out (6 seconds)…`;
        timer = setTimeout(step, 6000);
      }, 4000);
    };
    breathBtn.addEventListener("click", () => {
      if (running) return stop();
      running = true; cycle = 0;
      breathBtn.textContent = "Pause";
      track("exhale_started");
      step();
    });
  }

  /* Inline Pure-White Consolation & Proof Engine on Home (E-05) */
  const stageDataEl = $("#stage-data");
  const consolationPanel = $("#consolation-panel");
  if (stageDataEl && consolationPanel) {
    let STAGE_DATA = {};
    try { STAGE_DATA = JSON.parse(stageDataEl.textContent || "{}"); } catch (_) {}
    const stageButtons = $$("[data-inline-stage]");
    const activateStage = (key, scroll = true) => {
      const s = STAGE_DATA[key];
      if (!s) return;
      session.set("stage", key);
      stageButtons.forEach(b => b.classList.toggle("is-active", b.dataset.inlineStage === key));
      consolationPanel.hidden = false;
      $("[data-cp-tag]", consolationPanel).textContent = `${s.tag} · ${s.short}`;
      $("[data-cp-exhale]", consolationPanel).textContent = `“${s.exhale}”`;
      $("[data-cp-proof]", consolationPanel).innerHTML = `<strong>Real proof (${esc(s.proof_person)}):</strong> ${esc(s.proof_line)}`;
      $("[data-cp-move-day]", consolationPanel).textContent = `${s.move1_day} · First 15-minute move`;
      $("[data-cp-move-title]", consolationPanel).textContent = s.move1_title;
      $("[data-cp-move-desc]", consolationPanel).textContent = s.move1_desc;
      const fullLink = $("[data-cp-full-link]", consolationPanel);
      if (fullLink) fullLink.href = `/start/${key}`;
      const circleLink = $("[data-cp-circle-link]", consolationPanel);
      if (circleLink) circleLink.href = `/community/circles?stage=${key}`;
      const storyLink = $("[data-cp-story-link]", consolationPanel);
      if (storyLink && s.proof_slug) storyLink.href = `/stories/${s.proof_slug}`;
      const form = $("form.js-form", consolationPanel);
      if (form) {
        form.dataset.stage = key;
        form.hidden = false;
        const postCard = $(".post-submit-card", consolationPanel);
        if (postCard) postCard.remove();
        const msg = $(".form-msg", form);
        if (msg) msg.textContent = "";
      }
      if (scroll) consolationPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      track("stage_selected", { stage: key });
    };
    stageButtons.forEach(btn => {
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        activateStage(btn.dataset.inlineStage, true);
      });
    });
    const urlStage = new URLSearchParams(location.search).get("stage");
    if (urlStage && STAGE_DATA[urlStage]) activateStage(urlStage, false);
  }

  /* Dignified Friend-Share & Save-to-Myself Native Sharing (E-03, E-14) */
  $$("[data-share-whatsapp]").forEach(btn => {
    btn.addEventListener("click", () => {
      const msg = btn.dataset.shareMsg || "Thinking of you today.";
      const url = `${location.origin}/?from=friend`;
      window.open(`https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`, "_blank", "noopener");
      track("friend_share_clicked", { channel: "whatsapp" });
    });
  });
  $$("[data-share-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const msg = btn.dataset.shareMsg || "";
      const url = btn.dataset.shareSelf ? location.href : `${location.origin}/?from=friend`;
      const text = msg ? `${msg} ${url}` : url;
      if (btn.dataset.shareSelf && navigator.share) {
        try {
          await navigator.share({ title: document.title, text: "Saved from DYEGU for later", url });
          track("save_to_self", { method: "native" });
          return;
        } catch (_) {}
      }
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = prev), 1800);
        track(btn.dataset.shareSelf ? "save_to_self" : "friend_share_clicked", { channel: "copy" });
      } catch (_) {}
    });
  });

  /* 2-Step Micro-Yes Conversion Flow (E-07) */
  const microWrap = $("[data-micro-yes]");
  if (microWrap) {
    const pills = $$("[data-micro-choice]", microWrap);
    const heading = $("[data-micro-heading]", microWrap);
    const form = $("form.js-form", microWrap);
    const COPY = {
      clarity: "Your Clarity Reset + Sunday Comeback File is ready — where should we send it?",
      proof: "Real documented comebacks (with every source) + your 7-Day Reset — where should we send them?",
      grounding: "One calm, hype-free Sunday email + a 7-Day Reset for tonight — where should we send it?",
      people: "Get Sunday's Comeback File + early invitations to free Rebuild Circles at your stage:",
    };
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        const key = pill.dataset.microChoice;
        pills.forEach(p => p.classList.toggle("active", p === pill));
        if (heading && COPY[key]) heading.textContent = COPY[key];
        if (form) form.dataset.microIntent = key;
        const emailInput = form && $('input[name="email"]', form);
        emailInput?.focus();
        track("micro_yes_step1", { choice: key });
      });
    });
  }

  /* Stories Archive Live Filtering */
  const storyFilterBar = $("[data-story-filters]");
  if (storyFilterBar) {
    const cards = $$("[data-episodes] .ep");
    const countEl = $("[data-filter-count]");
    let activeStage = "all";
    const applyFilter = () => {
      let shown = 0;
      cards.forEach(c => {
        const stages = (c.dataset.stages || "").split(",");
        const match = activeStage === "all" || stages.includes(activeStage);
        c.hidden = !match;
        if (match) shown++;
      });
      if (countEl) countEl.textContent = `Showing ${shown} of ${cards.length} Season 1 episodes`;
    };
    $$("[data-filter-stage]", storyFilterBar).forEach(btn => {
      btn.addEventListener("click", () => {
        activeStage = btn.dataset.filterStage;
        $$("[data-filter-stage]", storyFilterBar).forEach(b => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        applyFilter();
      });
    });
    applyFilter();
  }

  /* Verification Ledger [V]/[E]/[T] Filtering */
  const ledgerWrap = $("[data-ledger]");
  if (ledgerWrap) {
    const items = $$(".ledger-item", ledgerWrap);
    $$("[data-ledger-tag]", ledgerWrap).forEach(btn => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.ledgerTag;
        $$("[data-ledger-tag]", ledgerWrap).forEach(b => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        items.forEach(li => { li.hidden = !(tag === "all" || li.dataset.tag === tag); });
      });
    });
  }

  /* Interactive 7-Day Stage Checklist + Print One-Pager */
  const checklist = $("[data-checklist]");
  if (checklist) {
    const key = `dyegu_moves_${checklist.dataset.checklist}`;
    const boxes = $$('input[type="checkbox"]', checklist);
    const statusEl = $("[data-checklist-status]");
    const saved = (() => { try { return JSON.parse(local.get(key) || "[]"); } catch (_) { return []; } })();
    const syncUi = () => {
      const done = boxes.filter(b => b.checked).length;
      boxes.forEach(b => b.closest("li")?.classList.toggle("is-done", b.checked));
      if (statusEl) statusEl.innerHTML = `<strong>${done} of ${boxes.length}</strong> moves completed this week (stored privately on your device only)`;
    };
    boxes.forEach((b, idx) => {
      if (saved.includes(idx)) b.checked = true;
      b.addEventListener("change", () => {
        const checkedIdx = boxes.map((x, i) => (x.checked ? i : -1)).filter(i => i >= 0);
        local.set(key, JSON.stringify(checkedIdx));
        syncUi();
        track("checklist_checked", { stage: checklist.dataset.checklist, done: checkedIdx.length });
      });
    });
    syncUi();
    $$("[data-print-plan]").forEach(btn => btn.addEventListener("click", () => {
      track("plan_printed", { stage: checklist.dataset.checklist });
      window.print();
    }));
  }

  /* Shop Selection Tray */
  const dropForm = $("#drop-form");
  const shopTray = $("#shop-tray");
  if (dropForm && shopTray) {
    const boxes = $$('input[name="interest"][form="drop-form"]');
    const trayText = $("[data-tray-text]", shopTray);
    const updateTray = () => {
      const picked = boxes.filter(b => b.checked);
      boxes.forEach(b => b.closest(".product")?.classList.toggle("is-selected", b.checked));
      shopTray.hidden = picked.length === 0;
      if (trayText) {
        const names = picked.map(b => b.dataset.label || b.value).join(", ");
        trayText.innerHTML = `<strong>${picked.length} item${picked.length === 1 ? "" : "s"} selected:</strong> ${esc(names)}`;
      }
    };
    boxes.forEach(b => b.addEventListener("change", updateTray));
    updateTray();
  }

  /* Speaking: Copy Bio + Keynote Quick-Select */
  $$("[data-copy-target]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const el = document.getElementById(btn.dataset.copyTarget);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = prev), 1800);
      } catch (_) {}
    });
  });
  $$("[data-prefill-topic]").forEach(btn => {
    btn.addEventListener("click", () => {
      const form = $("#enquire form");
      if (!form) return;
      const msg = $('textarea[name="message"]', form);
      const kind = $('select[name="kind"]', form);
      if (kind && btn.dataset.prefillKind) kind.value = btn.dataset.prefillKind;
      if (msg && !msg.value.trim()) {
        msg.value = `We're interested in "${btn.dataset.prefillTopic}" for our upcoming gathering.\n\nDetails: `;
      }
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      msg?.focus();
    });
  });

  /* Shareable DYEGU Rule Canvas Quote Card Generator */
  $$("[data-quote-card]").forEach(btn => {
    btn.addEventListener("click", () => {
      const quote = btn.dataset.quote || "";
      const subject = btn.dataset.subject || "DYEGU";
      const ep = btn.dataset.ep || "";
      const canvas = document.createElement("canvas");
      canvas.width = 1080; canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.strokeStyle = "#262626"; ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 984, 1254);
      ctx.strokeStyle = "#C5A059"; ctx.lineWidth = 3;
      [[48, 48, 36, 36], [1032, 48, -36, 36], [48, 1302, 36, -36], [1032, 1302, -36, -36]].forEach(([x, y, dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y); ctx.moveTo(x, y); ctx.lineTo(x, y + dy); ctx.stroke();
      });

      ctx.fillStyle = "#C5A059";
      ctx.font = '600 22px "Montserrat", Arial, sans-serif';
      ctx.fillText(`THE DYEGU RULE  ·  ${ep ? `EPISODE ${ep} · ` : ""}${subject.toUpperCase()}`, 108, 165);
      ctx.fillRect(108, 198, 96, 2);

      ctx.fillStyle = "#ECE7DC";
      ctx.font = 'italic 500 54px "Cormorant Garamond", Georgia, serif';
      const words = `“${quote}”`.split(/\s+/);
      let line = "", y = 330;
      for (const w of words) {
        const test = (line + " " + w).trim();
        if (ctx.measureText(test).width > 860 && line) { ctx.fillText(line, 108, y); line = w; y += 74; }
        else line = test;
      }
      if (line) ctx.fillText(line, 108, y);

      ctx.fillStyle = "#444444"; ctx.fillRect(108, 1110, 864, 2);
      ctx.fillStyle = "#C5A059";
      ctx.font = '600 26px "Montserrat", Arial, sans-serif';
      ctx.fillText("D Y E G U  ·  DON'T YOU EVER GIVE UP", 108, 1178);
      ctx.fillStyle = "#A39E93";
      ctx.font = '400 22px "Montserrat", Arial, sans-serif';
      ctx.fillText("dyegu.co", 108, 1222);

      const a = document.createElement("a");
      a.download = `dyegu-rule-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      track("rule_card_saved", { subject });
    });
  });

  /* Share Page: Blank-Page Starter Prompts + Character Counter + Crisis Awareness (E-12, W-10) */
  const storyArea = $('textarea[name="story"]');
  if (storyArea) {
    const countEl = $("[data-story-count]");
    const careBanner = $("[data-care-live]");
    const CARE_RX = /\b(suicid\w*|kill myself|end my life|self[- ]?harm|don'?t want to live|want to die)\b/i;
    const syncStory = () => {
      if (countEl) countEl.textContent = `${storyArea.value.length} / 6000`;
      if (careBanner) careBanner.hidden = !CARE_RX.test(storyArea.value);
    };
    storyArea.addEventListener("input", syncStory);
    $$("[data-starter-text]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!storyArea.value.trim()) storyArea.value = btn.dataset.starterText;
        else storyArea.value = `${storyArea.value.trimEnd()}\n\n${btn.dataset.starterText}`;
        storyArea.focus();
        syncStory();
      });
    });
  }

  /* Quiet Dismissible Mobile Bottom Bar (E-14) */
  const mobileDock = $("#mobile-dock");
  if (mobileDock) {
    let dismissed = session.get("dock_dismissed") === "1";
    const checkScroll = () => {
      if (dismissed) return;
      mobileDock.classList.toggle("is-shown", window.scrollY > 520);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    $("[data-dock-close]", mobileDock)?.addEventListener("click", () => {
      dismissed = true;
      session.set("dock_dismissed", "1");
      mobileDock.classList.remove("is-shown");
    });
  }

  /* Forms → Hardened /api/submit + Rich Post-Signup Consolation & Momentum Card (E-08, W-02) */
  async function submitDirect(table, row, attempt = 0) {
    const r = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: CONFIG.supabaseKey, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
    });
    if (r.status === 409) return { status: "exists" };
    if ((r.status >= 500 || r.status === 401) && attempt < 1) {
      await new Promise(ok => setTimeout(ok, 1200));
      return submitDirect(table, row, attempt + 1);
    }
    if (!r.ok) throw new Error(String(r.status));
    return { status: "ok" };
  }

  async function submitRow(table, row, honeypot) {
    try {
      const r = await fetch(CONFIG.submitApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, row, honeypot }),
      });
      if (r.status === 404 || r.status === 405) {
        if (honeypot) return { status: "ok" };
        return submitDirect(table, row);
      }
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || String(r.status));
      return d;
    } catch (err) {
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:") {
        if (honeypot) return { status: "ok" };
        return submitDirect(table, row);
      }
      throw err;
    }
  }

  const validEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  const say = (form, text, cls) => { const m = $(".form-msg", form); if (m) { m.textContent = text; m.className = "form-msg " + cls; } };

  function showPostSubmitCard(form, row, status, okText) {
    if (form.dataset.table !== "subscribers") {
      say(form, status === "exists" ? "You're already on this list. Thank you." : okText, "ok");
      return;
    }
    const stageKey = row.stage || session.get("stage");
    const resetHref = stageKey ? `/start/${stageKey}` : "/#start";
    const circleHref = stageKey ? `/community/circles?stage=${stageKey}` : "/community/circles";
    const card = document.createElement("div");
    card.className = "post-submit-card";
    card.setAttribute("role", "status");
    card.innerHTML = `
      <p class="eyebrow" style="margin-bottom:6px">${status === "exists" ? "Already in your corner" : "You're in — no need to wait until Sunday"}</p>
      <h3>${status === "exists" ? "You're already subscribed." : "Welcome. Take your first step tonight."}</h3>
      <p>${esc(okText)} While you wait for Sunday's Comeback File, your interactive 7-day move checklist and free community doors are open right now:</p>
      <div class="post-submit-actions">
        <a class="btn btn-gold btn-sm" href="${resetHref}">Open your 7-Day Reset →</a>
        <a class="btn btn-ghost btn-sm" href="${circleHref}">Explore free Rebuild Circles</a>
        <a class="btn btn-subtle btn-sm" href="/assets/calendar/ep01-steve-jobs.ics" download>Add Ep 01 to calendar (.ics)</a>
      </div>`;
    form.hidden = true;
    form.insertAdjacentElement("afterend", card);
  }

  function rowFor(form) {
    const fd = new FormData(form), v = k => (fd.get(k) || "").toString().trim();
    const t = form.dataset.table;
    if (t === "subscribers") {
      const interest = fd.getAll("interest").map(String);
      const intent = form.dataset.microIntent ? `intent=${form.dataset.microIntent}` : "";
      const baseUtm = session.get("utm") || "";
      const combinedUtm = [baseUtm, intent].filter(Boolean).join("&").slice(0, 300) || null;
      return {
        email: v("email"), list: form.dataset.list || "comeback_file", site: CONFIG.site, consent: true,
        stage: form.dataset.stage || v("stage") || session.get("stage") || null,
        interest: interest.length ? interest : null,
        source: form.dataset.list || "comeback_file", page: location.pathname.slice(0, 120),
        utm: combinedUtm,
      };
    }
    if (t === "enquiries") {
      return {
        name: v("name"), email: v("email"), organisation: v("organisation") || null, kind: v("kind") || "other",
        message: v("message"), event_date: v("event_date") || null, budget: v("budget") || null,
        audience: v("audience") || null, site: CONFIG.site,
      };
    }
    if (t === "volunteers") {
      return {
        full_name: v("full_name"), email: v("email"), profession: v("profession"), credentials: v("credentials") || null,
        profile_url: v("profile_url") || null, country: v("country") || null, timezone: v("timezone") || null,
        languages: v("languages") || null, stages: fd.getAll("stages").map(String), formats: fd.getAll("formats").map(String),
        hours_per_month: v("hours_per_month") || null, why: v("why") || null, agreed_code: fd.get("agreed_code") === "on", site: CONFIG.site,
      };
    }
    if (t === "community_requests") {
      const topics = fd.getAll("topics").map(String);
      return {
        kind: form.dataset.kind, first_name: v("first_name") || null, email: v("email"), stage: v("stage") || null,
        timezone: v("timezone") || null, topics: topics.length ? topics : null, note: v("note") || null,
        agreed_terms: fd.get("agreed_terms") === "on", site: CONFIG.site,
      };
    }
    if (t === "rebuilds") {
      return {
        first_name: v("first_name") || null, email: v("email"), stage: v("stage") || null, story: v("story"),
        consent_contact: fd.get("consent_contact") === "on", consent_feature: fd.get("consent_feature") === "on", site: CONFIG.site,
      };
    }
    return {};
  }

  $$("form.js-form").forEach(form => {
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const row = rowFor(form);
      if (!validEmail(row.email || "")) return say(form, "Please enter a valid email address.", "err");
      if (form.dataset.table === "enquiries" && (!row.name || !row.message)) return say(form, "Please add your name and a short message.", "err");
      if (form.dataset.table === "volunteers" && (!row.full_name || !row.profession)) return say(form, "Please add your name and your profession.", "err");
      if (form.dataset.table === "volunteers" && row.profile_url && !/^https?:\/\//i.test(row.profile_url)) return say(form, "Please give the full link, starting with https://", "err");
      if (form.dataset.table === "volunteers" && !row.agreed_code) return say(form, "Please read and agree to the volunteer code.", "err");
      if (form.dataset.table === "community_requests" && !row.agreed_terms) return say(form, "Please tick the box to confirm you've read the guidelines.", "err");
      if (form.dataset.table === "community_requests" && row.kind === "circle" && !row.stage) return say(form, "Please choose the chapter closest to yours so we can match your circle.", "err");
      if (form.dataset.table === "rebuilds" && (row.story || "").length < 20) return say(form, "Please tell us a little more (at least a couple of sentences).", "err");

      const ok = form.dataset.success || "Your first Sunday Comeback File arrives with Episode 01.";
      const honeypot = form.company ? form.company.value : "";
      const btn = $("button[type=submit]", form);
      if (btn) btn.disabled = true;
      try {
        const res = await submitRow(form.dataset.table, row, honeypot);
        form.reset();
        fillTz();
        showPostSubmitCard(form, row, res.status, ok);
        track("signup_completed", { table: form.dataset.table, list: row.list || "", stage: row.stage || "" });
      } catch (err) {
        say(form, (err && err.message && err.message.length > 5 && !/^\d+$/.test(err.message)) ? err.message : "Something went wrong. Please try again in a moment.", "err");
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  /* High-Res Lite YouTube Player */
  function lite(box, id, title) {
    box.innerHTML = `<button class="player" type="button" aria-label="Play: ${esc(title)}"></button><p class="latest-title">${esc(title)}</p>`;
    const p = $(".player", box);
    const maxUrl = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    const fbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    p.style.backgroundImage = `url(${maxUrl}), url(${fbUrl})`;
    const probe = new Image();
    probe.onload = () => { if (probe.naturalWidth <= 120) p.style.backgroundImage = `url(${fbUrl})`; };
    probe.onerror = () => { p.style.backgroundImage = `url(${fbUrl})`; };
    probe.src = maxUrl;
    p.addEventListener("click", () => {
      p.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    }, { once: true });
  }
  $$("[data-video]").forEach(box => {
    if (/^[\w-]{11}$/.test(box.dataset.video)) lite(box, box.dataset.video, box.dataset.title || document.title);
  });

  if (new Date(CONFIG.premiere) <= now()) {
    const storyMedia = $("[data-story-slug]");
    const epCards = $$(".ep[data-slug]");
    if (storyMedia || epCards.length) {
      fetch("/api/episodes").then(r => (r.ok ? r.json() : null)).then(d => {
        if (!d || !d.bySlug) return;
        if (storyMedia && d.bySlug[storyMedia.dataset.storySlug]) {
          const v = d.bySlug[storyMedia.dataset.storySlug];
          lite(storyMedia, v.id, v.title);
        }
        epCards.forEach(card => {
          const v = d.bySlug[card.dataset.slug];
          if (v && !$(".ep-thumb", card)) {
            const img = document.createElement("img");
            img.className = "ep-thumb";
            img.src = v.thumb || v.thumbFallback;
            img.alt = v.title;
            img.loading = "lazy";
            card.prepend(img);
          }
        });
      }).catch(() => {});
    }
  }
})();
