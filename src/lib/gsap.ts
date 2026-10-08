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

export { gsap, ScrollTrigger, SplitText, useGSAP };
