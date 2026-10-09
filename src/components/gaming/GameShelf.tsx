"use client";

import GameArt from "./GameArt";
import { useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import type { SteamData, SteamGame } from "@/lib/steam";
import { Joystick, Trophy } from "@/components/draw/art";

const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
const DROPS = ["md:mt-0", "md:mt-24", "md:mt-10", "md:mt-32", "md:mt-4", "md:mt-20"];

function Shelf({ title, games, kind }: { title: string; games: SteamGame[]; kind: "top" | "recent" }) {
  const max = Math.max(...games.map((g) => (kind === "recent" ? g.hours2wk ?? 0 : g.hours)), 1);
  return (
    <div className="mt-20">
      <h3 className="mb-10 font-display text-[clamp(1.75rem,3vw,3rem)] uppercase leading-none text-ink">{title}</h3>
      <ol
        className={`grid grid-cols-2 gap-x-5 gap-y-12 ${
          games.length <= 2
            ? "max-w-3xl md:gap-x-12"
            : games.length <= 4
              ? "md:grid-cols-4"
              : "sm:grid-cols-3 lg:grid-cols-6"
        }`}
      >
        {games.map((g, i) => {
          const value = kind === "recent" ? g.hours2wk ?? 0 : g.hours;
          return (
            <li key={`${kind}-${g.appid}`} data-game className={`${DROPS[i % DROPS.length]}`}>
              <a href={g.link} target="_blank" rel="noopener noreferrer" className="group block">
                <div
                  className={`relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-mist shadow-[0_30px_60px_-30px_rgba(27,20,70,0.6)] transition-transform duration-700 ease-expo group-hover:-translate-y-2 group-hover:rotate-0 ${TILTS[i % TILTS.length]}`}
                >
                  <GameArt sources={[g.capsule, g.header]} name={g.name} alt={`${g.name} cover art`} className="absolute inset-0 h-full w-full" />
                  <span className="absolute left-2 top-2 rounded-full bg-lime px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-ink">
                    #{i + 1}
                  </span>
                </div>
                <p className="mt-4 truncate font-medium text-ink">{g.name}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <span
                    data-bar
                    data-width={Math.max(4, (value / max) * 100)}
                    className="block h-full origin-left rounded-full bg-gradient-to-r from-accent to-aqua"
                  />
                </div>
                <p className="mt-1 text-sm text-graphite">
                  {value.toLocaleString("en-US")} hrs{kind === "recent" ? " · last 2 weeks" : ""}
                </p>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Game library: staggered, tilted capsules with playtime bars that fill on scroll. */
export default function GameShelf({ steam }: { steam: SteamData }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q("[data-game]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80 + (i % 3) * 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 100%", end: "top 65%", scrub: SCRUB } },
        );
        const bar = el.querySelector<HTMLElement>("[data-bar]")!;
        gsap.fromTo(
          bar,
          { width: "0%" },
          { width: `${bar.dataset.width}%`, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 45%", scrub: SCRUB } },
        );
      });
      q("[data-stat]").forEach((el) => {
        const target = Number(el.dataset.stat);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 55%", scrub: SCRUB },
          onUpdate: () => void (el.textContent = Math.round(obj.v).toLocaleString("en-US")),
        });
      });
    },
    { scope: root },
  );

  const top = steam.topGames[0];
  const stats = [
    { value: top?.hours ?? 0, count: true, label: `hours in ${top?.name ?? "my main"}` },
    steam.totalHours ? { value: steam.totalHours, count: true, label: "total hours played" } : null,
    steam.gamesOwned ? { value: steam.gamesOwned, count: true, label: "games in the library" } : null,
    { value: steam.memberYear, count: false, label: "on Steam since" },
    steam.level ? { value: steam.level, count: true, label: "Steam level" } : null,
  ].filter(Boolean) as { value: number; count: boolean; label: string }[];
  // Public profile only lists a couple of games — lay stats and covers side by side.
  const shown = steam.recent.length || Math.min(3, steam.topGames.length);
  const compact = shown <= 3;

  return (
    <section ref={root} aria-labelledby="library-title" className="relative overflow-hidden bg-bone px-4 py-28 md:px-10 md:py-40">
      <Trophy strokeWidth={4} start="top 80%" end="top 30%" className="absolute right-[6vw] top-16 w-24 text-accent md:w-32" />
      <Joystick strokeWidth={4} start="top 40%" end="center 30%" className="absolute bottom-24 left-[3vw] hidden w-28 text-pink md:block" />

      <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Library</p>
      <h2 id="library-title" className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,6rem)] uppercase leading-[0.9] text-ink">
        The <span className="text-gradient">hours</span> don&rsquo;t lie
      </h2>

      <div className={compact ? "md:grid md:grid-cols-12 md:items-start md:gap-10" : ""}>
        <dl
          className={`mt-14 grid grid-cols-2 gap-x-8 gap-y-10 ${
            compact ? "md:col-span-4 md:mt-36 md:grid-cols-1 md:gap-14" : "md:flex md:flex-wrap md:gap-16"
          }`}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-micro uppercase tracking-[0.18em]">{s.label}</dt>
              <dd className="text-gradient font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tabular-nums">
                {s.count ? <span data-stat={s.value}>{s.value.toLocaleString("en-US")}</span> : s.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className={compact ? "md:col-span-7 md:col-start-6" : ""}>
          {/* The full collection lives in the library below — this shelf shows what's hot right now. */}
          {steam.recent.length > 0 ? (
            <Shelf title="Played lately" games={steam.recent} kind="recent" />
          ) : (
            <Shelf title="Most played" games={steam.topGames.slice(0, 3)} kind="top" />
          )}
        </div>
      </div>

      <p className="mt-16 text-sm text-graphite">
        Live from my public Steam profile · refreshed hourly
        {steam.source === "snapshot" ? " (showing the last saved snapshot)" : ""}.
      </p>
    </section>
  );
}
