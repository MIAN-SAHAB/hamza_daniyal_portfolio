"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SCRUB, useDeferredGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Where the mask opens from. */
  from?: "center" | "bottom" | "left";
};

const START = {
  center: "inset(22% 16% 22% 16%)",
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
};

/** Scrubbed clip-path reveal with a counter-scaling inner layer. */
export default function ClipReveal({ children, className = "", from = "center" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ref.current, start: "top 92%", end: "top 30%", scrub: SCRUB },
      });
      tl.fromTo(ref.current, { clipPath: START[from] }, { clipPath: "inset(0% 0% 0% 0%)" }).fromTo(
        "[data-inner]",
        { scale: 1.3 },
        { scale: 1 },
        0,
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-inner className="relative h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
