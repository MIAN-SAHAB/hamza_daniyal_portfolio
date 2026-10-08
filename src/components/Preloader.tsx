"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { completeIntro } from "@/lib/intro";

const TOP = "Hamza";
const BOTTOM = "Daniyal";

function waitForAssets() {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const load =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
  // Never hold the visitor hostage to a slow third-party asset.
  const cap = new Promise<void>((r) => setTimeout(r, 4000));
  return Promise.race([Promise.all([fonts, load]), cap]);
}

/**
 * Counter 0 → 100 over a split typographic curtain. On completion the halves
 * part, the hero timeline is released via `completeIntro()`, and the component
 * unmounts. Played once per session; route changes never replay it.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(
    (_, contextSafe) => {
      const html = document.documentElement;
      if (html.dataset.intro === "done") {
        html.classList.remove("is-loading");
        setVisible(false);
        return;
      }
      html.classList.add("is-loading");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);
      const counter = q("[data-count]")[0] as HTMLElement;
      const progress = { v: 0 };
      const render = () => {
        counter.textContent = String(Math.round(progress.v)).padStart(3, "0");
      };

      const intro = gsap.timeline();
      intro
        .from(q("[data-char]"), {
          yPercent: 110,
          duration: reduce ? 0.01 : 1.1,
          ease: "expo.out",
          stagger: 0.045,
        })
        .from(q("[data-meta]"), { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.08 }, 0.2)
        .to(progress, {
          v: 72,
          duration: reduce ? 0.2 : 1.6,
          ease: "power2.inOut",
          onUpdate: render,
        }, 0.1)
        .to(q("[data-bar]"), { scaleX: 0.72, duration: reduce ? 0.2 : 1.6, ease: "power2.inOut" }, 0.1);

      const exit = contextSafe!(() => {
        gsap
          .timeline({
            onComplete: () => {
              setVisible(false);
              ScrollTrigger.refresh();
            },
          })
          .to(progress, { v: 100, duration: reduce ? 0.1 : 0.6, ease: "power3.out", onUpdate: render })
          .to(q("[data-bar]"), { scaleX: 1, duration: reduce ? 0.1 : 0.6, ease: "power3.out" }, "<")
          .to(q("[data-meta], [data-counter]"), { autoAlpha: 0, duration: 0.35 }, ">-0.05")
          .to(q("[data-bar]"), { scaleY: 0, duration: 0.3 }, "<")
          .add(() => {
            html.classList.remove("is-loading");
            completeIntro();
          })
          .to(q("[data-half='top']"), { yPercent: -100, duration: reduce ? 0.3 : 1.25, ease: "expo.inOut" }, "<")
          .to(q("[data-half='bottom']"), { yPercent: 100, duration: reduce ? 0.3 : 1.25, ease: "expo.inOut" }, "<")
          .to(q("[data-word='top']"), { yPercent: 40, duration: 1.25, ease: "expo.inOut" }, "<")
          .to(q("[data-word='bottom']"), { yPercent: -40, duration: 1.25, ease: "expo.inOut" }, "<");
      });

      Promise.all([waitForAssets(), new Promise<void>((r) => intro.eventCallback("onComplete", () => r()))]).then(
        () => exit(),
      );
    },
    { scope: root },
  );

  if (!visible) return null;

  const chars = (word: string) =>
    word.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span data-char className="inline-block">
          {c}
        </span>
      </span>
    ));

  return (
    <div
      ref={root}
      data-preloader
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] select-none"
    >
      <div
        data-half="top"
        className="absolute inset-x-0 top-0 flex h-1/2 items-end justify-start overflow-hidden bg-paper px-4 md:px-10"
      >
        <span
          data-word="top"
          aria-hidden
          className="font-display text-giant uppercase leading-[0.78] text-ink md:pl-[8vw]"
        >
          {chars(TOP)}
        </span>
      </div>
      <div
        data-half="bottom"
        className="absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-end overflow-hidden bg-paper px-4 md:px-10"
      >
        <span
          data-word="bottom"
          aria-hidden
          className="font-display text-giant uppercase leading-[0.86] text-ink md:pr-[6vw]"
        >
          {chars(BOTTOM)}
        </span>
      </div>

      {/* progress hairline sits exactly on the split */}
      <div
        data-bar
        className="absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-vermilion"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-4 top-5 flex justify-between text-micro uppercase tracking-[0.2em] text-graphite md:inset-x-10 md:top-8">
        <span data-meta>HD — Folio ©2026</span>
        <span data-meta className="hidden sm:inline">Creative Engineering · {"{"}Since 2018{"}"}</span>
        <span data-meta>PKT / UTC+5</span>
      </div>

      <div
        data-counter
        className="pointer-events-none absolute bottom-5 left-4 flex items-baseline gap-1 md:bottom-8 md:left-10"
      >
        <span data-count className="font-display text-big tabular-nums text-ink">
          000
        </span>
        <span className="text-micro uppercase tracking-[0.2em] text-vermilion">%</span>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
