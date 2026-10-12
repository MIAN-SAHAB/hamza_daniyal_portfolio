"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out" });}

/**
 * House rule: no `pin: true` anywhere. "Pinned" moments are built from a tall
 * parent + `sticky top-0 h-screen` child, with ScrollTrigger bound to the
 * parent and `scrub: 1` driving what happens inside the sticky viewport.
 */
export const SCRUB = 1;

type ContextFunc = Extract<Parameters<typeof useGSAP>[0], (...args: never[]) => unknown>;

// Deferred setups start after the first frame has painted and run in short
// time-boxed batches, so below-the-fold scroll scenes never stall first paint
// or form a long task (8ms here stays well under 50ms on a 4x-slower phone).
const queue: Array<() => void> = [];
let pumping = false;
function pump() {
  const deadline = performance.now() + 8;
  while (queue.length && performance.now() < deadline) queue.shift()!();
  if (queue.length) setTimeout(pump, 0);
  else pumping = false;
}
function afterPaint(job: () => void) {
  queue.push(job);
  if (!pumping) {
    pumping = true;
    requestAnimationFrame(() => setTimeout(pump, 0));
  }
  return () => {
    const i = queue.indexOf(job);
    if (i >= 0) queue.splice(i, 1);
  };
}

/**
 * `useGSAP` for scroll-driven scenes that can't be on screen at first paint.
 * Setup is queued until after the first frame (each component in its own
 * task); everything it creates still lives in — and reverts with — the context.
 */
export function useDeferredGSAP(callback: ContextFunc, config?: { scope?: React.RefObject<Element | null>; dependencies?: unknown[] }) {
  return useGSAP((context, contextSafe) => afterPaint(contextSafe!(() => callback(context, contextSafe))), config);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
