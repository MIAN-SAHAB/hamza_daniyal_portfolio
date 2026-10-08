"use client";

import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { workflow } from "@/lib/site";

const SKINS = [
  "bg-white text-ink md:left-[6vw] md:w-[46vw]",
  "bg-ink text-white md:left-[30vw] md:w-[42vw]",
  "bg-vermilion text-white md:left-[14vw] md:w-[50vw]",
  "bg-paper text-ink md:left-[40vw] md:w-[44vw] border border-ink/10",
];

/** Stacking process sheets: a tall parent scrubs each sheet up over the last inside a sticky viewport. */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const sheets = q("[data-sheet]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });
      sheets.forEach((sheet, i) => {
        if (i === 0) return;
        tl.fromTo(sheet, { yPercent: 130, rotate: i % 2 ? 6 : -6 }, { yPercent: 0, rotate: i % 2 ? 1.5 : -1.5, duration: 1 }, i - 1)
          .to(sheets.slice(0, i), { scale: (j: number) => 1 - (i - j) * 0.05, yPercent: (j: number) => -(i - j) * 6, duration: 1 }, i - 1);
      });
      tl.to(q("[data-step-count]"), { textContent: sheets.length, snap: { textContent: 1 }, duration: sheets.length - 1 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="process-title" className="relative min-h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-x-4 top-24 z-10 flex items-start justify-between md:inset-x-10 md:top-28">
          <h2 id="process-title" className="font-display text-big uppercase text-ink">
            How it
            <br />
            gets built
          </h2>
          <p className="font-display text-big text-ink/15" aria-hidden>
            0<span data-step-count>1</span>/0{workflow.length}
          </p>
        </div>

        <ol className="absolute inset-x-4 bottom-[8vh] top-[34vh] md:inset-x-0 md:top-[30vh]">
          {workflow.map((w, i) => (
            <li
              key={w.step}
              data-sheet
              className={`absolute inset-x-0 bottom-0 flex min-h-[46vh] flex-col justify-between p-6 shadow-[0_40px_80px_-40px_rgba(17,17,20,0.5)] md:inset-x-auto md:p-10 ${SKINS[i]}`}
              style={{ zIndex: i + 1 }}
            >
              <div className="flex items-start justify-between">
                <span className="text-micro uppercase tracking-[0.2em] opacity-70">Step {w.step}</span>
                <span className="font-display text-huge leading-none opacity-20">{w.step}</span>
              </div>
              <div>
                <h3 className="font-display text-big uppercase">{w.title}</h3>
                <p className="mt-4 max-w-md text-lede opacity-80">{w.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
