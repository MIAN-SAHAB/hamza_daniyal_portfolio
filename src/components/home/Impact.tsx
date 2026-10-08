"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { metrics } from "@/lib/site";

const OFFSETS = ["md:ml-0", "md:ml-[38vw]", "md:ml-[12vw]", "md:ml-[52vw]"];

export default function Impact() {
  const metricsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Metrics: numbers count up, scrubbed to each row's passage through the viewport.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-metric]").forEach((row) => {
        const num = row.querySelector<HTMLElement>("[data-value]")!;
        const target = Number(num.dataset.value);
        const obj = { v: 0 };
        const st = { trigger: row, start: "top 90%", end: "top 40%", scrub: SCRUB };
        gsap.to(obj, {
          v: target,
          ease: "none",
          scrollTrigger: st,
          onUpdate: () => void (num.textContent = String(Math.round(obj.v)).padStart(2, "0")),
        });
        gsap.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(row.querySelector("[data-meta]"), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: metricsRef },
  );

  // Kinetic CTA: tall parent + sticky viewport, a vermilion portal opens as you scroll.
  useGSAP(
    () => {
      const q = gsap.utils.selector(ctaRef);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ctaRef.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });
      tl.fromTo(q("[data-row='a']"), { xPercent: 0 }, { xPercent: -45, duration: 1 }, 0)
        .fromTo(q("[data-row='b']"), { xPercent: -45 }, { xPercent: 0, duration: 1 }, 0)
        .fromTo(q("[data-row='c']"), { xPercent: -5 }, { xPercent: -40, duration: 1 }, 0)
        .fromTo(q("[data-portal]"), { clipPath: "circle(7% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.55, ease: "power2.in" }, 0.35)
        .fromTo(q("[data-portal-arrow]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 0.38)
        .fromTo(q("[data-portal-inner]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55 }, 0.4)
        .fromTo(q("[data-portal-copy]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.75);
    },
    { scope: ctaRef },
  );

  const row = (words: string, outline = false) =>
    Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={`pr-[4vw] ${outline ? "text-outline" : ""}`}>
        {words}
      </span>
    ));

  return (
    <>
      <section ref={metricsRef} aria-labelledby="impact-title" className="relative overflow-hidden px-4 py-32 md:px-10 md:py-48">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <p className="text-micro uppercase tracking-[0.2em] text-vermilion">(04) — Impact</p>
          <h2 id="impact-title" className="max-w-xl text-right font-display text-big uppercase text-ink">
            Numbers I&rsquo;m willing to sign
          </h2>
        </div>

        <ul>
          {metrics.map((m, i) => (
            <li key={m.label} data-metric className={`relative mb-14 md:mb-6 ${OFFSETS[i]}`}>
              <span data-rule aria-hidden className="absolute -top-3 left-0 block h-px w-full origin-left bg-ink/15 md:w-[40vw]" />
              <div className="flex items-end gap-6">
                <p className="font-display text-giant leading-[0.8] text-ink tabular-nums">
                  <span data-value={m.value} aria-hidden>
                    {String(m.value).padStart(2, "0")}
                  </span>
                  <span className="text-vermilion" aria-hidden>
                    {m.suffix}
                  </span>
                  <span className="sr-only">
                    {m.value}
                    {m.suffix}
                  </span>
                </p>
                <div data-meta className="pb-2">
                  <p className="max-w-[14rem] text-ink">{m.label}</p>
                  <p className="mt-1 text-micro uppercase tracking-[0.18em]">{m.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section ref={ctaRef} aria-labelledby="cta-title" className="relative min-h-[260vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div aria-hidden className="absolute inset-0 flex select-none flex-col justify-center gap-[2vh] font-display text-[clamp(4rem,15vw,16rem)] uppercase leading-[0.85] text-ink">
            <div data-row="a" className="w-max whitespace-nowrap">{row("Let's build —")}</div>
            <div data-row="b" className="w-max whitespace-nowrap">{row("Something —", true)}</div>
            <div data-row="c" className="w-max whitespace-nowrap">{row("Inevitable —")}</div>
          </div>

          <div
            data-portal
            className="absolute inset-0 flex items-center justify-center bg-vermilion text-white [clip-path:circle(7%_at_50%_50%)]"
          >
            <span data-portal-arrow aria-hidden className="absolute font-display text-[clamp(2rem,4vw,4rem)]">
              ↘
            </span>
            <div data-portal-inner className="flex flex-col items-center px-4 text-center">
              <p data-portal-copy className="mb-6 text-micro uppercase tracking-[0.24em]">
                (05) — Now booking select projects
              </p>
              <h2 id="cta-title" className="font-display text-giant uppercase">
                Start a
                <br />
                Project
              </h2>
              <Link
                href="/contact"
                data-cursor="Let's talk"
                className="mt-10 inline-flex items-center gap-4 rounded-full bg-white px-7 py-4 text-sm uppercase tracking-[0.16em] text-ink transition-transform duration-500 ease-expo hover:scale-105"
              >
                Let&rsquo;s talk <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
