"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useDeferredGSAP } from "@/lib/gsap";

const ROW_A = ["Next.js", "TypeScript", "React", "GSAP", "Three.js", "React Three Fiber", "Tailwind CSS", "WebGL"];
const ROW_B = ["Laravel", "PHP", "MySQL", "Shopify Storefront API", "Headless Commerce", "WordPress", "Custom Plugins", "Core Web Vitals"];

/**
 * Two counter-scrolling rows of stack chips. They idle on their own, speed up
 * with scroll velocity and flip direction when you scroll back up. Hover pauses.
 */
export default function StackTicker() {
  const root = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
      // Each row holds its chips twice, so sliding by 50% loops seamlessly. Row B runs the other way.
      const loops = rows.map((row, i) =>
        gsap
          .fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 })
          // Start deep into the repeats so a negative timeScale (scrolling up) can run backwards indefinitely.
          .totalTime(38 * 500),
      );

      let dir = 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (v !== 0) dir = v > 0 ? 1 : -1;
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 400);
          loops.forEach((l) => {
            gsap.to(l, { timeScale: dir * boost, duration: 0.2, overwrite: true });
            gsap.to(l, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
          });
        },
      });

      const el = root.current!;
      const pause = () => loops.forEach((l) => gsap.to(l, { timeScale: 0, duration: 0.5, overwrite: true }));
      const resume = () => loops.forEach((l) => gsap.to(l, { timeScale: dir, duration: 0.8, overwrite: true }));
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", resume);
      return () => {
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", resume);
      };
    },
    { scope: root },
  );

  const chips = (items: string[], tone: string) =>
    [...items, ...items].map((s, i) => (
      <li
        key={`${s}-${i}`}
        className={`flex shrink-0 items-center gap-3 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 ${tone}`}
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {s}
      </li>
    ));

  return (
    <div ref={root} aria-label="Tech stack" className="relative space-y-3 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul data-row className="flex w-max gap-3">
        {chips(ROW_A, "border-white/15 text-white/85 hover:border-lime hover:bg-lime hover:text-ink")}
      </ul>
      <ul data-row className="flex w-max gap-3" aria-hidden>
        {chips(ROW_B, "border-white/10 text-white/60 hover:border-aqua hover:bg-aqua hover:text-ink")}
      </ul>
    </div>
  );
}
