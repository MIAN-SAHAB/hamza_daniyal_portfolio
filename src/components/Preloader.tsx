"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { completeIntro } from "@/lib/intro";

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
 * Interactive preloader. The HD monogram, orbit rings and sparkles draw in
 * lock-step with the 0 → 100 counter; layers drift with the pointer (depth
 * parallax) and a click or any key skips ahead. When it finishes the curtain
 * collapses into a circle — only then is the hero entrance released.
 * Plays once per session; later page loads skip it before first paint.
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

      // Every stroke becomes a dash we can "draw".
      const strokes = q("[data-draw]") as unknown as SVGGeometryElement[];
      strokes.forEach((el) => {
        const len = Math.ceil(el.getTotalLength()) + 2;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });

      // A paused drawing timeline we drive with the load progress.
      const draw = gsap
        .timeline({ paused: true, defaults: { ease: "none" } })
        .to(q("[data-draw='mono']"), { strokeDashoffset: 0, duration: 0.55, stagger: 0.08 }, 0)
        .to(q("[data-draw='orbit']"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.1 }, 0.15)
        .to(q("[data-draw='spark']"), { strokeDashoffset: 0, duration: 0.3, stagger: 0.08 }, 0.6)
        .fromTo(q("[data-dot]"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.15, ease: "back.out(3)" }, 0.85);

      const progress = { v: 0 };
      const render = () => {
        counter.textContent = String(Math.round(progress.v)).padStart(3, "0");
        draw.progress(progress.v / 100);
        gsap.set(q("[data-bar]"), { scaleX: progress.v / 100 });
      };

      gsap.from(q("[data-meta]"), { autoAlpha: 0, y: 10, duration: 0.8, stagger: 0.08 });
      const intro = gsap.to(progress, { v: 78, duration: reduce ? 0.2 : 2.2, ease: "power2.inOut", onUpdate: render });

      // ---- Interaction: pointer parallax ----
      const layers = q("[data-depth]");
      const movers = layers.map((el) => ({
        depth: Number((el as HTMLElement).dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.depth);
          m.y(ny * m.depth);
        });
      };
      window.addEventListener("pointermove", onMove);

      let exiting = false;
      const exit = contextSafe!(() => {
        if (exiting) return;
        exiting = true;
        intro.kill();
        window.removeEventListener("pointermove", onMove);
        gsap
          .timeline({
            onComplete: () => {
              // Hero entrance only starts once the curtain is fully gone.
              html.classList.remove("is-loading");
              completeIntro();
              setVisible(false);
              ScrollTrigger.refresh();
            },
          })
          .to(progress, { v: 100, duration: reduce ? 0.1 : 0.7, ease: "power3.out", onUpdate: render })
          .to(q("[data-meta], [data-counter], [data-hint]"), { autoAlpha: 0, duration: 0.3 }, ">-0.1")
          .to(q("[data-stage]"), { scale: 1.25, duration: 0.9, ease: "expo.in" }, "<")
          .to(
            root.current,
            { clipPath: "circle(0% at 50% 50%)", duration: reduce ? 0.3 : 1, ease: "expo.inOut" },
            "<0.15",
          );
      });

      // ---- Interaction: click / key to skip ----
      const skip = () => exit();
      root.current!.addEventListener("click", skip);
      window.addEventListener("keydown", skip, { once: true });

      Promise.all([waitForAssets(), new Promise<void>((r) => intro.eventCallback("onComplete", () => r()))]).then(() => exit());

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div
      ref={root}
      data-preloader
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      style={{ clipPath: "circle(150% at 50% 50%)" }}
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden bg-gradient-to-br from-accent via-[#6f63ff] to-aqua text-white"
    >
      {/* depth glows */}
      <span data-depth="-60" aria-hidden className="blob left-[8%] top-[12%] h-[34vw] w-[34vw] bg-pink opacity-40" />
      <span data-depth="-90" aria-hidden className="blob bottom-[6%] right-[8%] h-[30vw] w-[30vw] bg-lime opacity-30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div data-stage className="relative aspect-square w-[min(78vw,34rem)]">
          {/* orbits — far layer */}
          <svg data-depth="40" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeLinecap="round" className="absolute inset-0 h-full w-full text-white/45" aria-hidden>
            <ellipse data-draw="orbit" cx="100" cy="100" rx="94" ry="34" strokeWidth="1" />
            <ellipse data-draw="orbit" cx="100" cy="100" rx="94" ry="34" strokeWidth="1" transform="rotate(60 100 100)" />
            <ellipse data-draw="orbit" cx="100" cy="100" rx="94" ry="34" strokeWidth="1" transform="rotate(120 100 100)" />
          </svg>

          {/* monogram — near layer */}
          <svg data-depth="18" viewBox="-6 -6 84 52" fill="none" stroke="currentColor" strokeLinecap="butt" className="absolute inset-[22%] h-[56%] w-[56%]" aria-hidden>
            <path data-draw="mono" d="M4 4 L4 36" strokeWidth="3.4" />
            <path data-draw="mono" d="M4 20 L24 20" strokeWidth="3.4" />
            <path data-draw="mono" d="M24 4 L24 36 L34 36 C50 36 58 28 58 20 C58 12 50 4 34 4 L24 4" strokeWidth="3.4" strokeLinejoin="miter" />
            <circle data-dot cx="67" cy="34" r="3.2" className="fill-lime" stroke="none" />
          </svg>

          {/* sparkles — nearest layer */}
          <svg data-depth="70" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 h-full w-full text-lime" aria-hidden>
            <path data-draw="spark" strokeWidth="1.6" d="M168 30 C170 42 172 44 184 46 C172 48 170 50 168 62 C166 50 164 48 152 46 C164 44 166 42 168 30 Z" />
            <path data-draw="spark" strokeWidth="1.4" d="M28 150 C29 158 31 159 38 160 C31 161 29 162 28 170 C27 162 25 161 18 160 C25 159 27 158 28 150 Z" />
            <path data-draw="spark" strokeWidth="1.2" d="M40 30 C60 22 70 40 58 46 C48 50 50 34 66 34" />
          </svg>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 top-5 flex justify-between text-micro uppercase tracking-[0.2em] text-white/80 md:inset-x-10 md:top-8">
        <span data-meta>HD — Folio ©2026</span>
        <span data-meta className="hidden sm:inline">Creative Engineering · Since 2018</span>
        <span data-meta>Based in Pakistan</span>
      </div>

      <div data-counter className="pointer-events-none absolute bottom-5 left-4 md:bottom-8 md:left-10">
        <div className="flex items-baseline gap-1">
          <span data-count className="font-display text-big tabular-nums">000</span>
          <span className="text-micro uppercase tracking-[0.2em] text-lime">%</span>
        </div>
        <span className="mt-3 block h-[3px] w-40 overflow-hidden rounded-full bg-white/25">
          <span data-bar style={{ transform: "scaleX(0)" }} className="block h-full origin-left rounded-full bg-lime" />
        </span>
      </div>

      <p data-hint className="pointer-events-none absolute bottom-6 right-4 text-micro uppercase tracking-[0.2em] text-white/75 md:bottom-9 md:right-10">
        Move to play · click to skip
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
