"use client";

import { useEffect, useRef } from "react";

const R = 30;
const C = 2 * Math.PI * R;

/** Back-to-top button whose ring fills with page scroll progress. */
export default function BackToTop() {
  const ring = useRef<SVGCircleElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ring.current?.setAttribute("stroke-dashoffset", String(C * (1 - p)));
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-500 ease-expo hover:-translate-y-1"
    >
      <svg viewBox="0 0 72 72" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={R} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="3" />
        <circle
          ref={ring}
          cx="36"
          cy="36"
          r={R}
          fill="none"
          stroke="var(--lime)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <span className="flex flex-col items-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <span ref={pct} className="mt-0.5 text-[0.625rem] tabular-nums text-white/70">
          0%
        </span>
      </span>
    </button>
  );
}
