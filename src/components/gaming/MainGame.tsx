"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import type { SteamGame } from "@/lib/steam";
import { Crosshair } from "@/components/draw/art";

const LINES = [
  "Every round is a tiny product launch.",
  "Plan the play. Execute under pressure.",
  "Review the demo. Ship the fix next round.",
];

/** Tall parent + sticky arena: key art zooms out, crosshair draws in, hours count up — all scrubbed. */
export default function MainGame({ game }: { game: SteamGame }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = q("[data-hours]")[0];
      const obj = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });
      tl.fromTo(q("[data-art]"), { scale: 1.35, filter: "saturate(0.4) brightness(0.55)" }, { scale: 1, filter: "saturate(1.1) brightness(0.7)", duration: 3 }, 0)
        .to(obj, {
          v: game.hours,
          duration: 2,
          onUpdate: () => void (counter.textContent = Math.round(obj.v).toLocaleString("en-US")),
        }, 0.3)
        .fromTo(q("[data-ring]"), { scale: 0.6, rotate: -90, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.2 }, 0)
        .fromTo(q("[data-title]"), { yPercent: 100 }, { yPercent: 0, duration: 0.6 }, 0.1);

      q("[data-say]").forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.9 + i * 0.6);
        if (i < LINES.length - 1) tl.to(el, { autoAlpha: 0, y: -40, duration: 0.4 }, 1.4 + i * 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="main-game-title" className="relative min-h-[300vh] bg-[#160b33]">
      <div className="sticky top-0 h-screen overflow-hidden text-white">
        <div data-art className="absolute inset-0 will-change-transform">
          <Image src={game.hero} alt={`${game.name} key art`} fill sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#160b33] via-[#160b33]/40 to-[#160b33]/70" />

        <div className="absolute inset-x-4 top-24 flex items-center justify-between md:inset-x-10 md:top-28">
          <p className="rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Main game</p>
          <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-micro uppercase tracking-[0.2em] text-white/70 underline-offset-4 hover:underline"
          >
            View on Steam ↗
          </a>
        </div>

        {/* crosshair + counter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div data-ring className="relative flex aspect-square w-[min(78vw,34rem)] items-center justify-center">
            <Crosshair
              trigger="#main-game-anchor"
              start="top top"
              end="top -60%"
              strokeWidth={1.5}
              className="absolute inset-0 h-full w-full text-lime/80"
            />
            <div className="text-center">
              <p className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-none tabular-nums">
                <span data-hours>0</span>
              </p>
              <p className="mt-2 text-micro uppercase tracking-[0.24em] text-white/75">hours on record</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-10 grid gap-6 md:inset-x-10 md:bottom-14 md:grid-cols-12 md:items-end">
          <h2 id="main-game-title" className="overflow-hidden font-display text-[clamp(2.25rem,6vw,6rem)] uppercase leading-[0.9] md:col-span-7">
            <span data-title className="block">
              {game.name}
            </span>
          </h2>
          <div className="relative h-16 md:col-span-5 md:text-right">
            {LINES.map((l) => (
              <p key={l} data-say className="invisible absolute inset-x-0 bottom-0 text-lede text-white/85 opacity-0">
                {l}
              </p>
            ))}
          </div>
        </div>
      </div>
      <span id="main-game-anchor" aria-hidden className="absolute inset-x-0 top-0 h-px" />
    </section>
  );
}
