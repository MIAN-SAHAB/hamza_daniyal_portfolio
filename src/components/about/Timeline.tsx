"use client";

import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { milestones } from "@/lib/site";

/** Milestones on a horizontal rail inside a sticky viewport, scrubbed by a tall parent. */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0] as HTMLElement;
      const st = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: SCRUB, invalidateOnRefresh: true };

      const slide = gsap.to(track, {
        x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: st,
      });
      gsap.fromTo(q("[data-rail]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { ...st } });

      q("[data-milestone]").forEach((m) => {
        const sub = { trigger: m, containerAnimation: slide, start: "left 85%", end: "left 35%", scrub: SCRUB };
        gsap.fromTo(m.querySelector("[data-year]"), { yPercent: 40, autoAlpha: 0.15 }, { yPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: sub });
        gsap.fromTo(m.querySelector("[data-node]"), { scale: 0 }, { scale: 1, ease: "none", scrollTrigger: sub });
        gsap.fromTo(m.querySelector("[data-copy]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: sub });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="timeline-title" className="relative min-h-[320vh] bg-paper">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-x-4 top-24 flex items-end justify-between md:inset-x-10 md:top-28">
          <h2 id="timeline-title" className="font-display text-big uppercase text-ink">
            Milestones
          </h2>
          <p className="text-micro uppercase tracking-[0.2em] text-accent">2018 → Now</p>
        </div>

        {/* the rail */}
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink/10">
          <span data-rail className="absolute inset-0 origin-left bg-gradient-to-r from-accent via-aqua to-pink" />
        </div>

        <ol data-track className="relative flex h-full w-max items-center pl-[8vw] pr-[30vw]">
          {milestones.map((m, i) => {
            const above = i % 2 === 0;
            return (
              <li key={m.year} data-milestone className="relative h-full w-[78vw] shrink-0 sm:w-[46vw] md:w-[30vw]">
                <span
                  data-node
                  aria-hidden
                  className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-paper"
                />
                <div className={`absolute left-0 pr-8 ${above ? "bottom-1/2 pb-8" : "top-1/2 pt-8"}`}>
                  <p data-year className="font-display text-huge leading-none text-ink">
                    {m.year}
                  </p>
                  <div data-copy className="mt-3 max-w-xs">
                    <h3 className="text-micro uppercase tracking-[0.2em] text-ink">{m.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed">{m.copy}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
