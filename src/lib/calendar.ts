import { PREMIERE_ISO, SITE_URL, YOUTUBE_HANDLE, YOUTUBE_URL } from "./dyegu-data";

/**
 * Generates and triggers a real client-side .ics download for recurring
 * Sunday 15:00 WAT (Africa/Lagos) DYEGU premieres starting 2026-12-06.
 */
export function downloadSundayPremiereIcs(options?: {
  title?: string;
  isoDate?: string;
  description?: string;
  filename?: string;
  recurring?: boolean;
}) {
  const title = options?.title ?? "DYEGU Premiere · Season 1 (Sundays 15:00 WAT)";
  const description =
    options?.description ??
    `Documented comebacks—not highlight reels. Watch on YouTube (${YOUTUBE_HANDLE}) or inspect primary sources at ${SITE_URL}/stories.`;
  const filename = options?.filename ?? "dyegu-sundays-1500-wat.ics";
  const recurring = options?.recurring ?? true;

  const nowStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  // Use explicit Africa/Lagos (WAT, UTC+1, no DST) VTIMEZONE for recurring Sundays 15:00 WAT
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DYEGU//Season 1 Screening Room//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:DYEGU · Season 1 Premieres",
    "X-WR-TIMEZONE:Africa/Lagos",
    "BEGIN:VTIMEZONE",
    "TZID:Africa/Lagos",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0100",
    "TZNAME:WAT",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:dyegu-season1-premiere-${recurring ? "series" : "single"}@dyegu.co`,
    `DTSTAMP:${nowStamp}`,
  ];

  if (options?.isoDate && !recurring) {
    const start = new Date(options.isoDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    lines.push(`DTSTART:${fmt(start)}`);
    lines.push(`DTEND:${fmt(end)}`);
  } else {
    lines.push("DTSTART;TZID=Africa/Lagos:20261206T150000");
    lines.push("DTEND;TZID=Africa/Lagos:20261206T153000");
    lines.push("RRULE:FREQ=WEEKLY;BYDAY=SU;COUNT=14");
  }

  lines.push(`SUMMARY:${title}`);
  lines.push(`DESCRIPTION:${description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`);
  lines.push(`URL:${YOUTUBE_URL}`);
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n") + "\r\n"], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Formats the Sunday 15:00 WAT broadcast into the visitor's local time via Intl.DateTimeFormat.
 */
export function formatLocalBroadcastTime(iso = PREMIERE_ISO): string | null {
  try {
    const date = new Date(iso);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTime = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
    if (!tz) return localTime;
    return `${localTime} (${tz.replace(/_/g, " ")})`;
  } catch {
    return null;
  }
}

export function getGoogleCalendarUrl(title: string, isoStart = PREMIERE_ISO): string {
  const start = new Date(isoStart);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Watch on YouTube (${YOUTUBE_HANDLE}) or read verified primary sources at ${SITE_URL}/stories.`,
    location: YOUTUBE_URL,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
