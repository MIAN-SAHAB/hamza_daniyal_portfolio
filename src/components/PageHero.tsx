"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";

type Props = {
  label: string;
  /** Each entry renders as its own masked line; lines alternate their indent. */
  lines: string[];
  intro: ReactNode;
  aside?: ReactNode;
  id: string;
};

const INDENTS = ["", "md:pl-[14vw]", "md:pl-[5vw]", "md:pl-[22vw]"];

/** Inner-page hero: plays its entrance on mount (after the preloader), then scrubs away on scroll. */
export default function PageHero({ label, lines, intro, aside, id }: Props) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(q("[data-line]"), { yPercent: 110, rotate: 3, duration: 1.4, stagger: 0.1 })
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.4)
        .from(q("[data-rule]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" }, 0.2);

      gsap.to(q("[data-drift]"), {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (introDone) tl.current?.play();
  }, [introDone]);

  return (
    <section
      ref={root}
      aria-labelledby={id}
      className="arch-grid relative flex min-h-[92svh] flex-col justify-end overflow-hidden px-4 pb-12 pt-32 md:px-10 md:pb-16"
    >
      <p data-fade className="absolute left-4 top-28 text-micro uppercase tracking-[0.2em] text-vermilion md:left-10 md:top-32">
        {label}
      </p>
      {aside && (
        <div data-fade className="absolute right-4 top-28 md:right-10 md:top-32">
          {aside}
        </div>
      )}

      <h1 id={id} data-drift className="font-display text-giant uppercase text-ink">
        {lines.map((l, i) => (
          <span key={l} className={`block overflow-hidden pb-[0.06em] ${INDENTS[i % INDENTS.length]}`}>
            <span data-line className="block will-change-transform">
              {l}
            </span>
          </span>
        ))}
      </h1>

      <div className="relative mt-10 grid gap-6 md:grid-cols-12">
        <span data-rule aria-hidden className="absolute -top-5 left-0 h-px w-full bg-ink/15" />
        <div data-fade className="max-w-xl text-lede md:col-span-6 md:col-start-7">
          {intro}
        </div>
      </div>
    </section>
  );
}
