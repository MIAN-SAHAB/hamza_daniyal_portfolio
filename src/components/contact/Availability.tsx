"use client";

import LocalTime, { useAvailability } from "@/components/LocalTime";
import { site } from "@/lib/site";

/** Timezone indicator: live PKT clock plus a working-hours status light. */
export default function Availability() {
  const state = useAvailability();
  const online = state?.online;

  return (
    <div className="relative">
      <p className="text-micro uppercase tracking-[0.2em]">Local time — {site.timezoneLabel}</p>
      <p className="mt-3 font-display text-big leading-none text-ink">
        <LocalTime withSeconds suffix="" />
      </p>
      <p className="mt-4 flex items-center gap-2.5 text-sm text-ink" aria-live="polite">
        <span
          className={`pulse-dot inline-block h-2 w-2 rounded-full ${
            online === undefined ? "bg-mist text-mist" : online ? "bg-[#1DB954] text-[#1DB954]" : "bg-vermilion text-vermilion"
          }`}
        />
        {online === undefined
          ? "Checking studio hours…"
          : online
            ? "In the studio now — expect a quick reply"
            : "Outside studio hours (10:00–19:00 PKT) — I'll reply first thing"}
      </p>
    </div>
  );
}
