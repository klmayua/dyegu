"use client";

import React from "react";
import { downloadSundayPremiereIcs, getGoogleCalendarUrl } from "@/lib/calendar";

export function PremiereActionsClient({
  title,
  isoDate,
  slug,
}: {
  title: string;
  isoDate: string;
  slug: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <button
        type="button"
        onClick={() =>
          downloadSundayPremiereIcs({
            title,
            isoDate,
            filename: `dyegu-${slug}.ics`,
            recurring: false,
          })
        }
        className="label-track flex-1 border border-[#444444] px-4 py-3 text-[#F5F5F0] hover:border-[#C5A059] hover:text-[#C5A059]"
      >
        Download .ICS
      </button>
      <a
        href={getGoogleCalendarUrl(title, isoDate)}
        target="_blank"
        rel="noopener noreferrer"
        className="label-track flex-1 border border-[#444444] px-4 py-3 text-[#8E8E8A] hover:border-[#C5A059] hover:text-[#C5A059]"
      >
        Google Calendar
      </a>
    </div>
  );
}
