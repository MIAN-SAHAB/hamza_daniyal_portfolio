"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import type { SteamData } from "@/lib/steam";
import type { GenreSlice } from "@/lib/gaming";
import { site } from "@/lib/site";
import { Crosshair, Gamepad, Sparkle, Squiggle } from "@/components/draw/art";
import GameArt from "./GameArt";

const twitch = site.socials.find((s) => s.label === "Twitch")!;
const discord = site.socials.find((s) => s.label === "Discord")!;

const BAR_TONES = ["from-accent to-aqua", "from-aqua to-lime", "from-pink to-accent", "from-lime to-aqua", "from-accent to-pink"];
// Floating covers around the stage: position, tilt and pointer depth.
const FLOATERS = [
  { cls: "-left-[14%] top-[6%] w-[30%] -rotate-[10deg]", depth: 28 },
  { cls: "-right-[10%] top-[30%] w-[27%] rotate-[8deg]", depth: 44 },
  { cls: "left-[6%] -bottom-[8%] w-[25%] rotate-[4deg]", depth: 60 },
];

export default function GamingHero({ steam, genres }: { steam: SteamData; genres: GenreSlice[] }) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();
  const [genreFocus, setGenreFocus] = useState<string | null>(null);
  const online = steam.status === "online" || steam.status === "in-game";
  const main = steam.topGames[0];
  const played = steam.library.length;

  const stats = [
    { value: main?.hours ?? 0, label: `hrs in ${main?.name ?? "my main"}` },
    steam.totalHours ? { value: steam.totalHours, label: "hrs on Steam" } : null,
    { value: played, label: "games played" },
    steam.level ? { value: steam.level, label: "Steam level" } : { value: steam.memberYear, label: "on Steam since", raw: true },
  ].filter(Boolean) as { value: number; label: string; raw?: boolean }[];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counters = q("[data-count]") as HTMLElement[];
      const nums = counters.map(() => ({ v: 0 }));

      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(q("[data-glow]"), { scale: 0.3, autoAlpha: 0, duration: 2, stagger: 0.2 })
        .from(q("[data-line]"), { yPercent: 110, rotate: 4, duration: 1.4, stagger: 0.1 }, 0.1)
        .from(q("[data-stage]"), { scale: 0.4, rotate: 30, autoAlpha: 0, duration: 1.6, ease: "back.out(1.3)" }, 0.2)
        .from(q("[data-floater]"), { y: 120, rotate: 0, autoAlpha: 0, duration: 1.4, stagger: 0.12, ease: "back.out(1.4)" }, 0.5)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.07 }, 0.5)
        .from(q("[data-card]"), { y: 60, rotate: -6, autoAlpha: 0, duration: 1.2, ease: "back.out(1.4)" }, 0.8)
        .from(q("[data-bar]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, stagger: 0.1 }, 0.9)
        .to(
          nums,
          {
            v: (i: number) => Number(counters[i].dataset.count),
            duration: 2,
            ease: "power3.out",
            onUpdate: () =>
              counters.forEach((el, i) => {
                el.textContent = el.dataset.raw ? String(Math.round(nums[i].v)) : Math.round(nums[i].v).toLocaleString("en-US");
              }),
          },
          0.7,
        );
      // Start states are applied — reveal the CSS-hidden hero without a flash.
      root.current!.classList.add("hero-ready");

      gsap.to(q("[data-spin]"), { rotate: 360, duration: 18, ease: "none", repeat: -1 });
      q("[data-floater-inner]").forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? 12 : -12, duration: 3 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      );

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
        })
        .to(q("[data-stage-wrap]"), { yPercent: -14 }, 0)
        .to(q("[data-display]"), { yPercent: -10 }, 0);

      // Pointer depth: floating covers drift at different rates.
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const movers = (q("[data-floater]") as HTMLElement[]).map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.depth);
          m.y(ny * m.depth);
        });
      };
      const el = root.current!;
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  useEffect(() => {
    if (introDone) tl.current?.play();
  }, [introDone]);

  const topGenres = genres.slice(0, 3).map((g) => g.label.toLowerCase());

  return (
    <section
      ref={root}
      data-hero
      aria-labelledby="gaming-title"
      className="relative overflow-hidden bg-[#160b33] px-4 pb-20 pt-28 text-white md:min-h-svh md:px-10 md:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span data-glow className="blob -left-[10vw] top-[-10vw] h-[45vw] w-[45vw] bg-accent opacity-55" />
        <span data-glow className="blob bottom-[-16vw] right-[-6vw] h-[44vw] w-[44vw] bg-pink opacity-40" />
        <span data-glow className="blob left-[40%] top-[30%] h-[20vw] w-[20vw] bg-aqua opacity-30" />
      </div>

      <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* ---------- copy column ---------- */}
        <div className="lg:col-span-7">
          <div data-fade className="mb-6 flex flex-wrap items-center gap-2">
            <h1 id="gaming-title" className="rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">
              Gaming
              <span className="sr-only">
                {" "}
                — Tommy Vercetti (tommyvercetti__455 / IamTommyVercetti): Counter-Strike 2 (CS2) competitive FPS player &amp; Twitch streamer
              </span>
            </h1>
            <span className="rounded-full border border-white/20 px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-white/70">
              Player profile
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-white/70">
              Steam since {steam.memberYear}
            </span>
          </div>

          <p data-display className="font-display text-[clamp(2.6rem,6.6vw,7.25rem)] uppercase leading-[0.88]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">Off the clock,</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] md:pl-[5vw]">
              <span data-line className="text-gradient block">on the server.</span>
            </span>
          </p>
          <Squiggle mode="intro" delay={0.9} duration={1.6} strokeWidth={5} className="mt-1 w-[min(80%,28rem)] text-lime" />

          {/* SEO-rich intro, written from live Steam numbers */}
          <p data-fade className="mt-6 max-w-2xl text-lede text-white/80">
            I&rsquo;m {site.shortName} — a senior full-stack developer by day and a competitive{" "}
            <strong className="font-medium text-white">{main?.name ?? "Counter-Strike 2"}</strong> player by night, with{" "}
            <strong className="font-medium text-white">{(main?.hours ?? 0).toLocaleString("en-US")}+ hours</strong> on record
            {played > 1 ? ` and ${played} games played on Steam` : ""}.
          </p>
          <p data-fade className="mt-3 max-w-2xl text-white/60">
            {topGenres.length
              ? `Mostly ${topGenres.join(", ")} — the same instincts I bring to code: timing, precision and reading the room. `
              : ""}
            In game I&rsquo;m Tommy Vercetti — catch me streaming on Twitch as tommyvercetti__455 or squad up on Discord.
          </p>

          {/* live stats */}
          <dl data-fade className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-l-2 border-lime/70 pl-4">
                <dt className="mt-1 text-[0.6875rem] uppercase tracking-[0.16em] text-white/60">{s.label}</dt>
                <dd className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none tabular-nums">
                  <span data-count={s.value} data-raw={s.raw ? "" : undefined}>
                    {s.raw ? s.value : s.value.toLocaleString("en-US")}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {/* player card + CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div
              data-card
              className="flex items-center gap-4 rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-3 pr-5 backdrop-blur-md"
            >
              <div className="relative shrink-0 rounded-2xl bg-gradient-to-br from-accent to-aqua p-[3px]">
                <Image src={steam.avatar} alt={`${steam.persona} Steam avatar`} width={64} height={64} loading="eager" className="rounded-[0.8rem]" />
                <span
                  aria-hidden
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#160b33] ${online ? "bg-[#3ddc84]" : "bg-white/40"}`}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-xl uppercase leading-none">{steam.persona}</p>
                <p className="mt-1.5 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${online ? "bg-[#3ddc84]" : "bg-white/40"}`} />
                  {online ? "Online at last sync" : "Offline at last sync"}
                </p>
              </div>
            </div>
            <div data-fade className="flex flex-wrap gap-3">
              <a
                href={steam.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-aqua px-5 py-3 text-sm uppercase tracking-[0.14em] shadow-[0_18px_40px_-16px_rgba(122,60,255,0.9)]"
              >
                Add on Steam <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href={twitch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm uppercase tracking-[0.14em] transition-colors hover:bg-[#9146FF] hover:border-transparent"
              >
                Twitch
              </a>
              <a
                href={discord.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-sm uppercase tracking-[0.14em] transition-colors hover:bg-[#5865F2] hover:border-transparent"
              >
                Discord
              </a>
            </div>
          </div>
        </div>

        {/* ---------- stage column ---------- */}
        <div className="lg:col-span-5">
          <div data-stage-wrap className="relative mx-auto w-[min(76vw,26rem)] lg:mt-6 lg:w-full lg:max-w-[28rem]">
            <div
              data-stage
              className="relative aspect-square rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-gradient-to-br from-accent via-[#b04dff] to-pink shadow-[0_60px_120px_-40px_rgba(255,79,163,0.6)]"
            >
              <div data-spin className="absolute inset-[6%] text-white/25">
                <Crosshair mode="intro" delay={0.4} duration={2} strokeWidth={1.5} className="h-full w-full" />
              </div>
              <div className="absolute inset-[24%] flex items-center justify-center text-white">
                <Gamepad mode="intro" delay={0.7} duration={2.4} strokeWidth={5} className="w-full" />
              </div>
            </div>

            {/* top games floating around the stage */}
            {steam.topGames.slice(0, 3).map((g, i) => (
              <a
                key={g.appid}
                href={g.link}
                target="_blank"
                rel="noopener noreferrer"
                data-floater
                data-depth={FLOATERS[i].depth}
                aria-label={`${g.name} — ${g.hours.toLocaleString("en-US")} hours`}
                className={`group absolute ${FLOATERS[i].cls}`}
              >
                <span data-floater-inner className="block">
                  <span className="relative block aspect-[2/3] overflow-hidden rounded-xl border-2 border-white/80 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-expo group-hover:scale-110">
                    <GameArt sources={[g.capsule, g.header]} name={g.name} eager className="absolute inset-0 h-full w-full" />
                  </span>
                  <span className="mt-1.5 block truncate text-center text-[0.625rem] uppercase tracking-[0.14em] text-white/80">
                    {g.hours.toLocaleString("en-US")} hrs
                  </span>
                </span>
              </a>
            ))}

            {main && (
              <span data-fade className="absolute -top-3 right-[8%] rotate-6 rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.18em] text-ink shadow-lg">
                Main · {main.name}
              </span>
            )}
            <Sparkle mode="intro" delay={1.6} duration={1} strokeWidth={3} className="absolute -right-4 bottom-[18%] w-10 text-lime" />
          </div>

          {/* genre DNA */}
          {genres.length > 0 && (
            <div data-fade className="mt-16 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
              <div className="flex items-baseline justify-between">
                <h2 className="text-micro uppercase tracking-[0.2em] text-white/70">Genre DNA</h2>
                <span className="text-[0.6875rem] text-white/50">by hours played</span>
              </div>
              <ul className="mt-4 space-y-3">
                {genres.map((g, i) => (
                  <li
                    key={g.id}
                    onPointerEnter={() => setGenreFocus(g.id)}
                    onPointerLeave={() => setGenreFocus(null)}
                    className={`transition-opacity duration-300 ${genreFocus && genreFocus !== g.id ? "opacity-40" : "opacity-100"}`}
                  >
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-white">{g.label}</span>
                      <span className="tabular-nums text-white/60">
                        {g.share}% · {g.hours.toLocaleString("en-US")} h
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <span
                        data-bar
                        className={`block h-full rounded-full bg-gradient-to-r ${BAR_TONES[i % BAR_TONES.length]}`}
                        style={{ width: `${Math.max(2, g.share)}%` }}
                      />
                    </div>
                    <p
                      className={`overflow-hidden text-[0.6875rem] text-white/55 transition-all duration-500 ease-expo ${
                        genreFocus === g.id ? "mt-1.5 max-h-12" : "max-h-0"
                      }`}
                    >
                      {g.games.slice(0, 5).join(" · ")}
                      {g.games.length > 5 ? ` +${g.games.length - 5}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
