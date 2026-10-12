"use client";

import { useEffect } from "react";
import { GA_ID } from "@/lib/gtag";

const INTERACTIONS = ["pointerdown", "pointermove", "keydown", "touchstart", "scroll", "wheel"] as const;
const IDLE_FALLBACK_MS = 5000;

/**
 * gtag.js is ~150KB of third-party JS whose evaluation is a long main-thread
 * task. It's only fetched once the page is fully loaded AND the visitor first
 * interacts (or after a few idle seconds), then run in an idle callback — so
 * it never competes with first paint, hydration or an input response.
 */
export default function GoogleTag() {
  useEffect(() => {
    let timer = 0;
    let started = false;

    const inject = () => {
      if (document.querySelector("script[data-gtag]")) return;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.dataset.gtag = "";
      document.head.append(s);
    };
    const start = () => {
      if (started) return;
      started = true;
      cleanup();
      if ("requestIdleCallback" in window) requestIdleCallback(inject, { timeout: 2000 });
      else setTimeout(inject, 0);
    };
    const arm = () => {
      INTERACTIONS.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
      timer = window.setTimeout(start, IDLE_FALLBACK_MS);
    };
    const cleanup = () => {
      INTERACTIONS.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", arm);
      clearTimeout(timer);
    };

    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return cleanup;
  }, []);

  return null;
}
