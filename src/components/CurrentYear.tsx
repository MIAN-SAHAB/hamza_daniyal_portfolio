"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Copyright year. Read on the client only, so the prerendered shell stays
 * deterministic (Cache Components forbids reading the clock during prerender).
 */
export default function CurrentYear() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
  return <span suppressHydrationWarning>{year ?? 2026}</span>;
}
