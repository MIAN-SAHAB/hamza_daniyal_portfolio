"use client";

import { useRef } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

const FIRST = "Mian Muhammad";
const LAST = "Hamza Daniyal";

/**
 * Full-name wordmark. Letters rise and light up as the pointer passes over
 * them (proximity wave) and settle back; the whole mark lifts in on scroll.
 * Sized to the viewport so the full name is always visible — nothing cropped.
 */
export default function Wordmark() {
  const root = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chars = q("[data-ch]") as HTMLElement[];

      gsap.fromTo(
        chars,
        { yPercent: 60, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.035,
          // Played (not scrubbed): the wordmark is the last thing on the page, and a scrub
          // end point there can become unreachable if the page height shifts after load.
          scrollTrigger: { trigger: root.current, start: "top 92%", toggleActions: "play none none reverse" },
        },
      );

      if (!window.matchMedia("(pointer: fine)").matches) return;
      const lift = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" }));
      const scale = chars.map((c) => gsap.quickTo(c, "scaleY", { duration: 0.5, ease: "power3" }));

      const onMove = (e: PointerEvent) => {
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const f = Math.max(0, 1 - d / 260);
          lift[i](-f * r.height * 0.22);
          scale[i](1 + f * 0.18);
          c.style.setProperty("--glow", String(f));
        });
      };
      const onLeave = () =>
        chars.forEach((c, i) => {
          lift[i](0);
          scale[i](1);
          c.style.setProperty("--glow", "0");
        });

      const el = root.current!;
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  const letters = (text: string, cls: string) =>
    text.split("").map((c, i) =>
      c === " " ? (
        <span key={i} className="inline-block w-[0.32em]" />
      ) : (
        <span
          key={i}
          data-ch
          style={{ ["--glow" as string]: 0 }}
          className={`inline-block origin-bottom will-change-transform [color:color-mix(in_oklab,var(--lime)_calc(var(--glow)*100%),currentColor)] ${cls}`}
        >
          {c}
        </span>
      ),
    );

  return (
    <div ref={root} className="relative select-none px-4 pb-6 pt-10 md:px-10" aria-label={site.name} role="img">
      <p aria-hidden className="mb-1 whitespace-nowrap font-display text-[7.4vw] uppercase leading-[0.95] text-white/35 md:text-[5.2vw]">
        {letters(FIRST, "")}
      </p>
      {/* 10.2vw keeps the full surname inside the viewport (≈8.7em wide) with the side gutters. */}
      <p aria-hidden className="whitespace-nowrap pb-[0.08em] font-display text-[10.2vw] uppercase leading-[0.95] text-white">
        {letters(LAST, "")}
        <span className="inline-block text-lime">.</span>
      </p>
    </div>
  );
}
