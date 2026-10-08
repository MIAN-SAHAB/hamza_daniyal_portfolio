"use client";

import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { stackClusters } from "@/lib/site";

const CORE = { x: 50, y: 50 };

export default function TechUniverse() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });

      gsap.set(q("[data-line]"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q("[data-node], [data-anchor]"), { scale: 0, autoAlpha: 0 });
      gsap.set(q("[data-desc]"), { autoAlpha: 0, y: 30 });

      tl.from(q("[data-core]"), { scale: 0.4, autoAlpha: 0, duration: 0.6 })
        .from(q("[data-orbit]"), { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%", stagger: 0.1, duration: 0.6 }, 0)
        .to(q("[data-orbit]"), { rotate: 90, transformOrigin: "50% 50%", duration: 4 }, 0);

      stackClusters.forEach((c, i) => {
        const at = 0.7 + i * 1.1;
        tl.to(q(`[data-line="${c.id}-core"]`), { strokeDashoffset: 0, duration: 0.35 }, at)
          .to(q(`[data-anchor="${c.id}"]`), { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" }, at + 0.25)
          .to(q(`[data-line^="${c.id}-item"]`), { strokeDashoffset: 0, duration: 0.35, stagger: 0.05 }, at + 0.35)
          .to(q(`[data-node="${c.id}"]`), { scale: 1, autoAlpha: 1, duration: 0.25, stagger: 0.05, ease: "back.out(2)" }, at + 0.45)
          .to(q(`[data-desc="${c.id}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.1);
        if (i < stackClusters.length - 1) {
          tl.to(q(`[data-desc="${c.id}"]`), { autoAlpha: 0, y: -30, duration: 0.3 }, at + 0.95);
        }
      });

      const counter = q("[data-counter]")[0];
      tl.eventCallback("onUpdate", () => {
        const active = stackClusters.filter((_, i) => tl.time() >= 0.8 + i * 1.1).length;
        counter.textContent = String(active).padStart(2, "0");
      });

      tl.to(q("[data-constellation]"), { scale: 0.94, duration: 0.6 }, ">").to(q("[data-all]"), { autoAlpha: 1, y: 0, duration: 0.4 }, "<");
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="universe-title" className="relative min-h-[320vh]">
      <div className="dot-field sticky top-0 h-screen overflow-hidden">
        {/* copy column */}
        <div className="absolute inset-x-4 top-24 z-10 md:inset-x-auto md:bottom-14 md:left-10 md:top-28 md:flex md:w-[30vw] md:flex-col md:justify-between">
          <div>
            <p className="text-micro uppercase tracking-[0.2em] text-vermilion">(03) — Technical Universe</p>
            <h2 id="universe-title" className="mt-4 font-display text-big uppercase text-ink">
              Architecture
              <br />
              <span className="md:pl-[4vw]">&amp; Stack</span>
            </h2>
          </div>

          <div className="relative mt-4 h-28 md:mt-0 md:h-56">
            {stackClusters.map((c) => (
              <div key={c.id} data-desc={c.id} className="invisible absolute inset-0 opacity-0">
                <p className="text-micro uppercase tracking-[0.2em] text-ink">{c.label}</p>
                <p className="mt-3 font-display text-[clamp(1.25rem,2vw,2rem)] uppercase leading-none text-ink">{c.title}</p>
                <p className="mt-3 hidden max-w-sm text-[0.9375rem] leading-relaxed md:block">{c.description}</p>
              </div>
            ))}
            <p data-all className="invisible absolute inset-x-0 bottom-0 translate-y-6 text-micro uppercase tracking-[0.18em] opacity-0">
              One engineer · one mental model · front to back
            </p>
          </div>
        </div>

        {/* constellation */}
        <div
          data-constellation
          className="absolute inset-x-3 bottom-6 top-[42%] md:bottom-[8%] md:left-[34vw] md:right-[3vw] md:top-[12%]"
          role="img"
          aria-label="Technology constellation: Modern Frontend, Backend & Headless, and Custom Systems clusters connected to a single core"
        >
          {/* Percentage coordinates keep strokes crisp at any aspect ratio without viewBox scaling. */}
          <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
            {[18, 32, 46].map((r) => (
              <ellipse
                key={r}
                data-orbit
                cx={`${CORE.x}%`}
                cy={`${CORE.y}%`}
                rx={`${r}%`}
                ry={`${r * 0.92}%`}
                fill="none"
                stroke="rgb(17 17 20 / 0.12)"
                strokeDasharray="2 7"
              />
            ))}
            {stackClusters.map((c) => (
              <g key={c.id}>
                <line
                  data-line={`${c.id}-core`}
                  pathLength={1}
                  x1={`${CORE.x}%`}
                  y1={`${CORE.y}%`}
                  x2={`${c.x}%`}
                  y2={`${c.y}%`}
                  stroke="#111114"
                  strokeWidth={1.25}
                />
                {c.items.map((it, j) => (
                  <line
                    key={it.name}
                    data-line={`${c.id}-item-${j}`}
                    pathLength={1}
                    x1={`${c.x}%`}
                    y1={`${c.y}%`}
                    x2={`${it.x}%`}
                    y2={`${it.y}%`}
                    stroke={c.id === "frontend" ? "#FF4D2D" : c.id === "backend" ? "#0047FF" : "#5B5B66"}
                    strokeWidth={1}
                  />
                ))}
              </g>
            ))}
          </svg>

          <div
            data-core
            className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink font-display text-xl text-white shadow-[0_0_0_10px_rgba(17,17,20,0.06)] md:h-28 md:w-28 md:text-3xl"
            style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}
          >
            HD<span className="text-vermilion">.</span>
          </div>

          {stackClusters.map((c) => (
            <div key={c.id} data-cluster={c.id}>
              <span
                data-anchor={c.id}
                className="invisible absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-ink px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.18em] text-white opacity-0 md:text-micro"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {c.label.split(" — ")[1]}
              </span>
              {c.items.map((it) => (
                <span
                  key={it.name}
                  data-node={c.id}
                  className="invisible absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[0.6875rem] text-ink opacity-0 shadow-[0_10px_24px_-14px_rgba(17,17,20,0.35)] md:px-3.5 md:py-1.5 md:text-[0.8125rem]"
                  style={{ left: `${it.x}%`, top: `${it.y}%` }}
                >
                  {it.name}
                </span>
              ))}
            </div>
          ))}

          <p aria-hidden className="absolute bottom-0 right-0 font-display text-[clamp(3rem,8vw,8rem)] leading-none text-ink/10">
            <span data-counter>00</span>/03
          </p>
        </div>
      </div>
    </section>
  );
}
