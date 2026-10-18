"use client";

import GameArt from "./GameArt";
import { useEffect, useRef, useState } from "react";
import { countUpOnce, gsap, ScrollTrigger, useDeferredGSAP, useGSAP } from "@/lib/gsap";
import type { SteamGame } from "@/lib/steam";
import { Crosshair } from "@/components/draw/art";

type Props = {
  game: SteamGame;
  /** Hours across the whole Steam library (Web API only). */
  totalHours?: number;
  memberYear: number;
  /** Number of games with recorded playtime. */
  gamesPlayed: number;
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** One stat, three ways to feel it. Matches assume ~40 min per competitive game. */
const UNITS = [
  { id: "hours", label: "Hours", caption: "hours on record", of: (h: number) => h },
  { id: "days", label: "Days", caption: "days of non-stop play", of: (h: number) => h / 24 },
  { id: "matches", label: "Matches", caption: "competitive matches (≈40 min each)", of: (h: number) => (h * 60) / 40 },
] as const;
type UnitId = (typeof UNITS)[number]["id"];

const ROUND = [
  {
    title: "Plan the play",
    game: "Call the strat, assign roles and line up utility before the round timer starts.",
    code: "Scope the brief, split the work and set performance budgets before a single component exists.",
  },
  {
    title: "Execute under pressure",
    game: "Trade kills, hold angles and adapt the moment the plan meets the enemy.",
    code: "Ship in tight loops, hold the quality bar and adapt when requirements shift mid-sprint.",
  },
  {
    title: "Review the demo",
    game: "Rewatch the round, find the mistake and fix it before the next half.",
    code: "Read the metrics, find the bottleneck and ship the fix in the next release.",
  },
];

/**
 * Main game: tilting key-art card with an hours counter you can re-express in
 * days or matches, live Steam stat tiles, and a game-vs-code "round loop".
 * Counters roll once when the section is reached — never scrubbed, never replayed.
 */
export default function MainGame({ game, totalHours, memberYear, gamesPlayed }: Props) {
  const root = useRef<HTMLElement>(null);
  const shown = useRef({ v: 0 });
  const entered = useRef(false);
  const [unit, setUnit] = useState<UnitId>("hours");
  const [mode, setMode] = useState<"game" | "code">("game");

  const share = totalHours ? Math.min(100, Math.round((game.hours / totalHours) * 100)) : null;
  const lastPlayed = game.lastPlayed
    ? new Date(game.lastPlayed * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    : null;
  const current = UNITS.find((u) => u.id === unit)!;

  // Entrance + the one-time count-up.
  useDeferredGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const big = q("[data-big]")[0] as HTMLElement;
      big.textContent = "0";

      gsap.set(q("[data-rise]"), { autoAlpha: 0, y: 50 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        end: "max",
        once: true,
        onEnter: () => {
          entered.current = true;
          gsap.to(q("[data-rise]"), { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08 });
          gsap.to(shown.current, {
            v: UNITS[0].of(game.hours),
            duration: 2.2,
            delay: 0.2,
            ease: "power3.out",
            onUpdate: () => void (big.textContent = fmt(shown.current.v)),
          });
        },
      });

      q("[data-count]").forEach((el) => countUpOnce(el as HTMLElement, Number((el as HTMLElement).dataset.count), { start: "top 90%" }));

      const ring = q("[data-ring]")[0] as unknown as SVGCircleElement | undefined;
      if (ring && share !== null) {
        const len = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: ring,
          start: "top 90%",
          end: "max",
          once: true,
          onEnter: () => void gsap.to(ring, { strokeDashoffset: len * (1 - share / 100), duration: 2, ease: "power3.out" }),
        });
      }
    },
    { scope: root },
  );

  // Switching units rolls from whatever is showing to the new figure (user-driven, not scroll).
  useGSAP(
    () => {
      if (!entered.current) return;
      const big = root.current!.querySelector<HTMLElement>("[data-big]")!;
      gsap.to(shown.current, {
        v: current.of(game.hours),
        duration: 0.9,
        ease: "expo.out",
        overwrite: true,
        onUpdate: () => void (big.textContent = fmt(shown.current.v)),
      });
    },
    { scope: root, dependencies: [unit] },
  );

  useGSAP(
    () => {
      if (!entered.current) return;
      gsap.fromTo("[data-mode-text]", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", stagger: 0.06 });
    },
    { scope: root, dependencies: [mode] },
  );

  // Pointer tilt + moving glare on the key-art card.
  useEffect(() => {
    const card = root.current?.querySelector<HTMLElement>("[data-tilt]");
    if (!card || !window.matchMedia("(pointer: fine)").matches) return;
    const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ry((x - 0.5) * 10);
      rx(-(y - 0.5) * 10);
      card.style.setProperty("--gx", `${x * 100}%`);
      card.style.setProperty("--gy", `${y * 100}%`);
    };
    const reset = () => {
      rx(0);
      ry(0);
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", reset);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", reset);
    };
  }, []);

  const chip = (active: boolean) =>
    `h-9 rounded-full px-4 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
      active ? "bg-lime text-ink" : "text-white/75 hover:text-white"
    }`;

  return (
    <section ref={root} aria-labelledby="main-game-title" className="relative overflow-hidden bg-[#160b33] px-4 py-28 text-white md:px-10 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="blob -right-[10vw] top-[4%] h-[36vw] w-[36vw] bg-accent opacity-30" />
        <span className="blob -left-[8vw] bottom-[8%] h-[30vw] w-[30vw] bg-aqua opacity-15" />
      </div>

      {/* header */}
      <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
        <div data-rise className="md:col-span-8">
          <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Main game</p>
          <h2 id="main-game-title" className="mt-6 font-display text-[clamp(2.5rem,6.5vw,6.5rem)] uppercase leading-[0.9]">
            {game.name}
          </h2>
        </div>
        <div data-rise className="md:col-span-4 md:text-right">
          <p className="text-lede text-white/75 md:ml-auto md:max-w-xs">
            The one I always come back to — #1 of {gamesPlayed} games I&rsquo;ve played on Steam.
          </p>
          <a
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors hover:border-transparent hover:bg-lime hover:text-ink"
          >
            View on Steam <span aria-hidden>↗</span>
          </a>
        </div>
      </div>

      <div className="relative mt-14 grid gap-5 md:grid-cols-12">
        {/* key-art card */}
        <div data-rise className="[perspective:1200px] md:col-span-7">
          <div
            data-tilt
            className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-5 [transform-style:preserve-3d] sm:aspect-[16/11] md:aspect-auto md:h-full md:min-h-[32rem] md:p-8"
          >
            <GameArt sources={[game.hero, game.header]} name={game.name} alt={`${game.name} key art`} className="absolute inset-0 h-full w-full" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#160b33] via-[#160b33]/50 to-[#160b33]/10" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.18),transparent_45%)] [@media(pointer:fine)]:opacity-100"
            />

            <div className="relative flex items-start justify-between gap-4">
              <span className="rounded-full bg-[#160b33]/70 px-3 py-1.5 text-micro uppercase tracking-[0.2em] backdrop-blur-md">
                {game.hours2wk ? `${fmt(game.hours2wk)} hrs this fortnight` : "Most played"}
              </span>
              <Crosshair strokeWidth={2} start="top 80%" end="top 30%" className="w-16 text-lime/90 md:w-24" />
            </div>

            <div className="relative">
              <p className="font-display text-[clamp(3.5rem,10vw,8.5rem)] leading-none tabular-nums" aria-live="polite">
                {/* GSAP owns this text after mount; the server render is the real figure for crawlers. */}
                <span data-big>{fmt(game.hours)}</span>
              </p>
              <p className="mt-2 text-micro uppercase tracking-[0.22em] text-white/75">{current.caption}</p>

              <div role="group" aria-label="Show playtime as" className="mt-6 inline-flex rounded-full border border-white/20 bg-[#160b33]/60 p-1 backdrop-blur-md">
                {UNITS.map((u) => (
                  <button key={u.id} type="button" aria-pressed={unit === u.id} onClick={() => setUnit(u.id)} className={chip(unit === u.id)}>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* stat tiles */}
        <dl className="grid grid-cols-2 gap-5 md:col-span-5">
          {share !== null && (
            <div data-rise className="col-span-2 flex items-center gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md md:p-6">
              <div className="relative aspect-square w-24 shrink-0 md:w-28">
                <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="main-share" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" style={{ stopColor: "var(--lime)" }} />
                      <stop offset="100%" style={{ stopColor: "var(--aqua)" }} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="8" />
                  <circle data-ring cx="50" cy="50" r="44" fill="none" stroke="url(#main-share)" strokeWidth="8" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display text-2xl tabular-nums">
                  <span data-count={share}>{share}</span>%
                </span>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-white/65">of all my time on Steam goes into {game.name}</dt>
                <dd className="font-display text-xl uppercase">Share of playtime</dd>
              </div>
            </div>
          )}

          <Tile label="hours on record">
            <span data-count={Math.round(game.hours)}>{fmt(game.hours)}</span>
          </Tile>
          {game.hours2wk ? (
            <Tile label="hours in the last 2 weeks">
              <span data-count={Math.round(game.hours2wk)}>{fmt(game.hours2wk)}</span>
            </Tile>
          ) : (
            <Tile label="games played on Steam">
              <span data-count={gamesPlayed}>{gamesPlayed}</span>
            </Tile>
          )}
          {lastPlayed && <Tile label="last session">{lastPlayed}</Tile>}
          <Tile label="on Steam since" wide={!lastPlayed}>
            {memberYear}
          </Tile>
        </dl>
      </div>

      {/* round loop */}
      <div className="relative mt-20 md:mt-28">
        <div data-rise className="flex flex-wrap items-end justify-between gap-6">
          <h3 className="font-display text-[clamp(1.75rem,3vw,3rem)] uppercase leading-none">
            One round, <span className="text-gradient">two jobs</span>
          </h3>
          <div role="group" aria-label="Read the round as" className="inline-flex rounded-full border border-white/20 p-1">
            <button type="button" aria-pressed={mode === "game"} onClick={() => setMode("game")} className={chip(mode === "game")}>
              In game
            </button>
            <button type="button" aria-pressed={mode === "code"} onClick={() => setMode("code")} className={chip(mode === "code")}>
              In code
            </button>
          </div>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {ROUND.map((r, i) => (
            <li
              key={r.title}
              data-rise
              className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-colors duration-500 hover:border-lime/50 hover:bg-white/[0.07] md:p-8"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-sm text-white transition-colors duration-500 group-hover:bg-lime group-hover:text-ink">
                0{i + 1}
              </span>
              <p className="mt-6 font-display text-2xl uppercase leading-tight">{r.title}</p>
              <p data-mode-text className="mt-3 min-h-[4.5rem] leading-relaxed text-white/70">
                {mode === "game" ? r.game : r.code}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Tile({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div
      data-rise
      className={`flex flex-col-reverse justify-end rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-colors duration-500 hover:border-white/25 md:p-6 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <dt className="mt-2 text-micro uppercase tracking-[0.18em] text-white/60">{label}</dt>
      <dd className="text-gradient font-display text-[clamp(2rem,3.5vw,3.25rem)] leading-none tabular-nums">{children}</dd>
    </div>
  );
}
