"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, ...opts });

/**
 * Live PKT clock. Time is only read inside effects (never during render), so
 * prerendering stays deterministic and hydration can't mismatch.
 */
export default function LocalTime({
  withSeconds = false,
  suffix = "PKT",
}: {
  withSeconds?: boolean;
  suffix?: string;
}) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const f = fmt({ hour: "2-digit", minute: "2-digit", second: withSeconds ? "2-digit" : undefined, hour12: false });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [withSeconds]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ?? (withSeconds ? "--:--:--" : "--:--")} {suffix}
    </time>
  );
}

/** Whether it's within working hours (10:00–19:00 PKT, Mon–Sat). */
export function useAvailability() {
  const [state, setState] = useState<{ online: boolean; year: number } | null>(null);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hour = Number(fmt({ hour: "2-digit", hour12: false }).format(now));
      const day = fmt({ weekday: "short" }).format(now);
      setState({ online: day !== "Sun" && hour >= 10 && hour < 19, year: now.getFullYear() });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return state;
}

export function CurrentYear() {
  const state = useAvailability();
  return <span suppressHydrationWarning>{state?.year ?? 2026}</span>;
}
