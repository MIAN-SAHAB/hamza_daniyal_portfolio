"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/*
 * "HD" architectural monogram. The H's right stem doubles as the D's spine —
 * one continuous structure. Paths share identical command structures so GSAP
 * can morph between the resting and hover states point-for-point.
 */
const SHAPES = {
  rest: {
    h: "M4 4 L4 36 M4 20 L24 20",
    d: "M24 4 L24 36 L34 36 C50 36 58 28 58 20 C58 12 50 4 34 4 L24 4",
  },
  hover: {
    h: "M4 8 L4 32 M4 13 L24 27",
    d: "M24 4 L24 36 L30 36 C54 36 60 30 60 20 C60 10 54 4 30 4 L24 4",
  },
};

export default function Logo({ className = "" }: { className?: string }) {
  const root = useRef<HTMLAnchorElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      // One-off stroke-draw on mount.
      gsap.fromTo(
        "[data-stroke]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.6, ease: "expo.inOut", stagger: 0.18, delay: 0.3 },
      );
      gsap.from("[data-dot]", { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(3)", delay: 1.4 });
    },
    { scope: root },
  );

  const morph = contextSafe((to: keyof typeof SHAPES) => {
    const s = SHAPES[to];
    gsap.to("[data-h]", { attr: { d: s.h }, duration: 0.7, ease: "expo.out", overwrite: true });
    gsap.to("[data-d]", { attr: { d: s.d }, duration: 0.7, ease: "expo.out", overwrite: true });
    gsap.to("[data-dot]", { x: to === "hover" ? -42 : 0, y: to === "hover" ? -2 : 0, duration: 0.7, ease: "expo.out", overwrite: true });
  });

  return (
    <Link
      ref={root}
      href="/"
      aria-label="Hamza Daniyal — home"
      data-cursor="Home"
      onMouseEnter={() => morph("hover")}
      onMouseLeave={() => morph("rest")}
      onFocus={() => morph("hover")}
      onBlur={() => morph("rest")}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <svg viewBox="0 0 72 40" className="h-8 w-auto overflow-visible md:h-9" fill="none" aria-hidden>
        <path
          data-h
          data-stroke
          d={SHAPES.rest.h}
          pathLength={1}
          strokeDasharray="1"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-d
          data-stroke
          d={SHAPES.rest.d}
          pathLength={1}
          strokeDasharray="1"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
        />
        <circle data-dot cx="67" cy="34" r="3" className="fill-vermilion" />
      </svg>
      <span className="hidden flex-col text-micro uppercase leading-tight tracking-[0.18em] sm:flex">
        <span>Hamza</span>
        <span className="opacity-60">Daniyal</span>
      </span>
    </Link>
  );
}
