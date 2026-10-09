"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import type { SteamGame } from "@/lib/steam";
import { Crosshair, Sparkle } from "@/components/draw/art";

type Sort = "hours" | "az" | "recent";
const MAX_DEALT = 24;

const fmtDate = (unix?: number) =>
  unix ? new Date(unix * 1000).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }) : null;

function colsFor(n: number) {
  if (n <= 3) return "grid-cols-2 md:grid-cols-3";
  if (n <= 8) return "grid-cols-3 md:grid-cols-4";
  if (n <= 12) return "grid-cols-4 md:grid-cols-6";
  return "grid-cols-4 md:grid-cols-8";
}

/** Capsule art with a fallback to the header image for older titles without portrait art. */
function Cover({ game, sizes }: { game: SteamGame; sizes: string }) {
  const [src, setSrc] = useState(game.capsule);
  return (
    <Image
      src={src}
      alt={`${game.name} cover art`}
      fill
      sizes={sizes}
      onError={() => setSrc(game.header)}
      className="object-cover"
    />
  );
}

/**
 * The library: a sticky stage where every game I've played is dealt onto the
 * board one by one as you scroll. Sort it, hover to inspect, click for Steam.
 */
export default function GameLibrary({ games }: { games: SteamGame[] }) {
  const root = useRef<HTMLElement>(null);
  const [sort, setSort] = useState<Sort>("hours");
  const hasRecent = games.some((g) => g.lastPlayed);

  const sorted = useMemo(() => {
    const list = [...games];
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "recent") list.sort((a, b) => (b.lastPlayed ?? 0) - (a.lastPlayed ?? 0));
    else list.sort((a, b) => b.hours - a.hours);
    return list;
  }, [games, sort]);

  const dealt = sorted.slice(0, MAX_DEALT);
  const extra = sorted.length - dealt.length;
  const [focusId, setFocusId] = useState<number | null>(null);
  const focus = dealt.find((g) => g.appid === focusId) ?? dealt[0];
  const maxHours = Math.max(...games.map((g) => g.hours), 1);

  // Deal timeline — rebuilt whenever the sort order changes.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");
      const counter = q("[data-unlocked]")[0];
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB,
          onUpdate: (self) => {
            counter.textContent = String(Math.min(cards.length, Math.ceil(self.progress * cards.length * 1.15))).padStart(2, "0");
          },
        },
      });
      tl.fromTo(
        cards,
        {
          y: () => window.innerHeight * 0.7,
          x: (i: number) => (i % 2 ? 1 : -1) * 40,
          rotate: (i: number) => ((i * 37) % 50) - 25,
          scale: 0.55,
          autoAlpha: 0,
        },
        { y: 0, x: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 1, stagger: 0.55 },
      ).fromTo(q("[data-board-glow]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: tl.duration() }, 0);
    },
    { scope: root, dependencies: [sort], revertOnUpdate: true },
  );

  // Hover tilt — on the inner face so it never fights the deal transform.
  const { contextSafe } = useGSAP({ scope: root });
  const tilt = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    const face = e.currentTarget.querySelector("[data-face]");
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(face, { rotateY: px * 22, rotateX: -py * 22, scale: 1.06, duration: 0.4, ease: "power2.out" });
  });
  const untilt = contextSafe((e: React.PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget.querySelector("[data-face]"), { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1,0.6)" });
  });

  const SORTS: { id: Sort; label: string }[] = [
    { id: "hours", label: "Most played" },
    { id: "az", label: "A – Z" },
    ...(hasRecent ? [{ id: "recent" as const, label: "Recent" }] : []),
  ];

  return (
    <section
      ref={root}
      aria-labelledby="game-library-title"
      className="relative bg-[#160b33]"
      style={{ minHeight: `${140 + dealt.length * 16}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 pb-6 pt-24 text-white md:px-10 md:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span data-board-glow className="blob left-[40%] top-[20%] h-[40vw] w-[40vw] bg-accent opacity-40" />
          <span className="blob -bottom-[10vw] -left-[6vw] h-[30vw] w-[30vw] bg-aqua opacity-25" />
        </div>
        <Crosshair
          strokeWidth={1.2}
          start="top 60%"
          end="top top"
          className="pointer-events-none absolute -right-[6vw] top-[10%] w-[30vw] text-white/10"
        />

        <div className="relative grid min-h-0 flex-1 gap-6 md:grid-cols-12 md:gap-10">
          {/* control column */}
          <div className="flex flex-col md:col-span-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">The library</span>
              <span className="text-micro uppercase tracking-[0.2em] text-white/60">
                <span data-unlocked>00</span> / {String(dealt.length).padStart(2, "0")} unlocked
              </span>
            </div>
            <h2 id="game-library-title" className="mt-4 font-display text-[clamp(2rem,4.4vw,4.25rem)] uppercase leading-[0.9]">
              Games I&rsquo;ve <span className="text-gradient">played</span>
            </h2>

            <div role="group" aria-label="Sort games" className="mt-5 flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={sort === s.id}
                  onClick={() => setSort(s.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    sort === s.id ? "border-lime bg-lime text-ink" : "border-white/25 text-white hover:border-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* focus panel */}
            {focus && (
              <div className="relative mt-6 hidden overflow-hidden rounded-[1.5rem] border border-white/15 md:block" aria-live="polite">
                <div className="relative aspect-[16/7]">
                  <Image key={focus.appid} src={focus.header} alt="" fill sizes="30vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160b33] to-transparent" />
                </div>
                <div className="relative -mt-8 p-5">
                  <p className="font-display text-2xl uppercase leading-none">{focus.name}</p>
                  <p className="mt-3 text-sm text-white/70">
                    {focus.hours.toLocaleString("en-US")} hrs played
                    {fmtDate(focus.lastPlayed) ? ` · last played ${fmtDate(focus.lastPlayed)}` : ""}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-accent to-aqua transition-[width] duration-700 ease-expo"
                      style={{ width: `${Math.max(3, (focus.hours / maxHours) * 100)}%` }}
                    />
                  </div>
                  <a
                    href={focus.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-micro uppercase tracking-[0.18em] text-lime hover:underline"
                  >
                    View on Steam ↗
                  </a>
                </div>
              </div>
            )}

            {extra > 0 && (
              <p className="mt-4 text-sm text-white/60">
                + {extra} more in the full library.
              </p>
            )}
          </div>

          {/* the board */}
          <ol
            className={`relative grid content-center gap-3 [perspective:900px] md:col-span-8 md:gap-4 ${colsFor(dealt.length)}`}
            aria-label="Played games"
          >
            {dealt.map((g, i) => (
              <li key={g.appid} data-card className={i >= 16 ? "max-md:hidden" : ""}>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={tilt}
                  onPointerEnter={() => setFocusId(g.appid)}
                  onFocus={() => setFocusId(g.appid)}
                  onPointerLeave={untilt}
                  aria-label={`${g.name} — ${g.hours} hours played`}
                  className="group block [transform-style:preserve-3d]"
                >
                  <div
                    data-face
                    className={`relative aspect-[2/3] overflow-hidden rounded-xl border-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow] duration-300 md:rounded-2xl ${
                      focus?.appid === g.appid
                        ? "border-lime shadow-[0_0_0_4px_rgba(200,245,66,0.25),0_30px_60px_-20px_rgba(122,60,255,0.8)]"
                        : "border-white/10"
                    }`}
                  >
                    <Cover game={g} sizes={dealt.length > 12 ? "12vw" : "22vw"} />
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-[#160b33]/80 px-1.5 py-0.5 text-[0.625rem] font-medium tabular-nums text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#160b33] to-transparent p-2 pt-6 text-[0.6875rem] leading-tight transition-transform duration-300 group-hover:translate-y-0">
                      {g.hours.toLocaleString("en-US")} hrs
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <Sparkle strokeWidth={3} start="top 50%" end="top top" className="pointer-events-none absolute bottom-8 left-[30%] w-10 text-lime" />
      </div>
    </section>
  );
}
