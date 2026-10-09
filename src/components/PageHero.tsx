"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { Squiggle } from "@/components/draw/art";

type Tone = "violet" | "aqua" | "lime";

type Props = {
  id: string;
  label: string;
  /** Each entry renders as its own masked line. */
  lines: string[];
  /** Index of the line set in gradient type. */
  accentLine?: number;
  intro: ReactNode;
  aside?: ReactNode;
  /** A line illustration from components/draw/art, rendered with mode="intro". */
  art: ReactNode;
  tone?: Tone;
};

const STAGE: Record<Tone, string> = {
  violet: "from-accent via-[#9a5bff] to-aqua",
  aqua: "from-aqua via-[#38a8ff] to-accent",
  lime: "from-lime via-[#7fe0a0] to-aqua",
};

/** Inner-page hero: title on the left, a self-drawing illustration on a colour stage at right. */
export default function PageHero({ id, label, lines, accentLine = 1, intro, aside, art, tone = "violet" }: Props) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(q("[data-stage]"), { scale: 0.5, rotate: -20, autoAlpha: 0, duration: 1.6, ease: "back.out(1.3)" })
        .from(q("[data-line]"), { yPercent: 110, rotate: 3, duration: 1.4, stagger: 0.1 }, 0.1)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.5)
        .from(q("[data-blob]"), { scale: 0.3, autoAlpha: 0, duration: 2 }, 0);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
        })
        .to(q("[data-stage-wrap]"), { yPercent: -16, rotate: 8 }, 0)
        .to(q("h1"), { yPercent: -10 }, 0);
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
      className="relative overflow-hidden px-4 pb-16 pt-32 md:min-h-[92svh] md:px-10 md:pb-20 md:pt-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span data-blob className="blob -left-[12vw] -top-[10vw] h-[40vw] w-[40vw] bg-accent opacity-25" />
        <span data-blob className="blob -bottom-[16vw] right-[20vw] h-[36vw] w-[36vw] bg-aqua opacity-30" />
      </div>

      <div className="relative grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div data-fade className="mb-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ink px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-white">{label}</span>
            {aside}
          </div>

          <h1 id={id} className="font-display text-[clamp(2.75rem,7vw,8rem)] uppercase leading-[0.88] text-ink">
            {lines.map((l, i) => (
              <span key={l} className={`block overflow-hidden pb-[0.06em] ${i % 2 ? "md:pl-[6vw]" : ""}`}>
                <span data-line className={`block will-change-transform ${i === accentLine ? "text-gradient" : ""}`}>
                  {l}
                </span>
              </span>
            ))}
          </h1>
          <Squiggle mode="intro" delay={0.9} duration={1.6} strokeWidth={5} className="mt-2 w-[min(80%,34rem)] text-accent" />
        </div>

        <div data-stage-wrap className="relative mx-auto w-[min(78vw,30rem)] md:col-span-5 md:w-full md:max-w-[34rem]">
          <div
            data-stage
            className={`relative aspect-square rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-gradient-to-br ${STAGE[tone]} shadow-[0_60px_120px_-50px_rgba(122,60,255,0.7)]`}
          >
            <div className="absolute inset-[14%] flex items-center justify-center text-white">{art}</div>
          </div>
        </div>
      </div>

      <div data-fade className="relative mt-12 max-w-xl text-lede text-graphite md:ml-[8vw] md:mt-16">
        {intro}
      </div>
    </section>
  );
}
