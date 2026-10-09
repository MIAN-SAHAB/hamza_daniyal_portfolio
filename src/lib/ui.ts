"use client";

import { useSyncExternalStore } from "react";

/** Global overlay state: the menu popup and the spotlight palette are mutually exclusive. */
type Overlay = "none" | "menu" | "spotlight";

let current: Overlay = "none";
const listeners = new Set<() => void>();

export function openOverlay(next: Overlay) {
  if (current === next) return;
  current = next;
  listeners.forEach((l) => l());
}

export const closeOverlay = () => openOverlay("none");

export function useOverlay() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => "none" as Overlay,
  );
}

/** Lock page scroll while any overlay is open. */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
