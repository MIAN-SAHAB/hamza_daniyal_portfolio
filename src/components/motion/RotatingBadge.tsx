"use client";

import { useId, useRef } from "react";
import { gsap, SCRUB, useDeferredGSAP } from "@/lib/gsap";

/** Circular text badge whose ring rotation is scrubbed to page scroll. */
export default function RotatingBadge({ text, center, size = 148 }: { text: string; center: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useDeferredGSAP(
    () => {
      gsap.to("[data-ring]", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: SCRUB },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg data-ring viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ink">
        <defs>
          <path id={`c-${id}`} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <text className="fill-current text-[8.4px] uppercase tracking-[0.18em]">
          <textPath href={`#c-${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[26%] flex items-center justify-center rounded-full bg-accent font-display text-2xl text-white">
        {center}
      </span>
    </div>
  );
}
