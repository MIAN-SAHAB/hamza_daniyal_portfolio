"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import type { SteamData } from "@/lib/steam";
import { site } from "@/lib/site";
import { Crosshair, Gamepad, Sparkle, Squiggle } from "@/components/draw/art";

const twitch = site.socials.find((s) => s.label === "Twitch")!;

export default function GamingHero({ steam }: { steam: SteamData }) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();
  const online = steam.status === "online" || steam.status === "in-game";

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from(q("[data-glow]"), { scale: 0.3, autoAlpha: 0, duration: 2, stagger: 0.2 })
        .from(q("[data-line]"), { yPercent: 110, rotate: 4, duration: 1.4, stagger: 0.1 }, 0.1)
        .from(q("[data-card]"), { y: 60, rotate: -8, autoAlpha: 0, duration: 1.3, ease: "back.out(1.4)" }, 0.4)
        .from(q("[data-stage]"), { scale: 0.4, rotate: 30, autoAlpha: 0, duration: 1.6, ease: "back.out(1.3)" }, 0.2)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.6);

      gsap.to(q("[data-spin]"), { rotate: 360, duration: 18, ease: "none", repeat: -1 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
        })
        .to(q("[data-stage]"), { yPercent: -20, rotate: -12 }, 0)
        .to(q("[data-card]"), { yPercent: -30 }, 0)
        .to(q("h1"), { yPercent: -12 }, 0);
    },
    { scope: root },
  );

  useEffect(() => {
    if (introDone) tl.current?.play();
  }, [introDone]);

  return (
    <section ref={root} aria-labelledby="gaming-title" className="relative overflow-hidden bg-[#160b33] px-4 pb-24 pt-32 text-white md:min-h-svh md:px-10 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span data-glow className="blob -left-[10vw] top-[-10vw] h-[45vw] w-[45vw] bg-accent opacity-55" />
        <span data-glow className="blob bottom-[-16vw] right-[-6vw] h-[44vw] w-[44vw] bg-pink opacity-40" />
        <span data-glow className="blob left-[40%] top-[30%] h-[20vw] w-[20vw] bg-aqua opacity-30" />
      </div>

      <div className="relative grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <p data-fade className="mb-8 inline-flex items-center gap-3">
            <span className="rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Gaming</span>
            <span className="text-micro uppercase tracking-[0.2em] text-white/60">Player profile</span>
          </p>
          <h1 id="gaming-title" className="font-display text-[clamp(2.75rem,7.2vw,8rem)] uppercase leading-[0.88]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">Off the clock,</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] md:pl-[6vw]">
              <span data-line className="text-gradient block">on the server.</span>
            </span>
          </h1>
          <Squiggle mode="intro" delay={0.9} duration={1.6} strokeWidth={5} className="mt-2 w-[min(80%,30rem)] text-lime" />
          <p data-fade className="mt-8 max-w-lg text-lede text-white/75">
            When the deploys are green, I&rsquo;m usually holding an angle in Counter-Strike. Same obsession as the day job —
            timing, precision and a little bit of flair.
          </p>

          {/* player card */}
          <div
            data-card
            className="mt-10 flex max-w-md items-center gap-5 rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-4 pr-6 backdrop-blur-md"
          >
            <div className="relative shrink-0 rounded-2xl bg-gradient-to-br from-accent to-aqua p-[3px]">
              <Image src={steam.avatar} alt={`${steam.persona} Steam avatar`} width={84} height={84} loading="eager" className="rounded-[0.9rem]" />
              <span
                aria-hidden
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#160b33] ${online ? "bg-[#3ddc84]" : "bg-white/40"}`}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl uppercase leading-none">{steam.persona}</p>
              <p className="mt-2 text-sm text-white/65">
                Steam since {steam.memberYear}
                {steam.level ? ` · Level ${steam.level}` : ""}
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${online ? "bg-[#3ddc84]" : "bg-white/40"}`} />
                {online ? "Online at last sync" : "Offline at last sync"}
              </p>
            </div>
          </div>

          <div data-fade className="mt-8 flex flex-wrap gap-3">
            <a
              href={steam.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-aqua px-6 py-3.5 text-sm uppercase tracking-[0.14em] shadow-[0_18px_40px_-16px_rgba(122,60,255,0.9)]"
            >
              Add me on Steam <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href={twitch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-ink"
            >
              Watch on Twitch
            </a>
          </div>
        </div>

        {/* stage */}
        <div className="relative mx-auto w-[min(80vw,30rem)] md:col-span-5 md:w-full md:max-w-[34rem]">
          <div
            data-stage
            className="relative aspect-square rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-gradient-to-br from-accent via-[#b04dff] to-pink shadow-[0_60px_120px_-40px_rgba(255,79,163,0.6)]"
          >
            <div data-spin className="absolute inset-[6%] text-white/25">
              <Crosshair mode="intro" delay={0.4} duration={2} strokeWidth={1.5} className="h-full w-full" />
            </div>
            <div className="absolute inset-[18%] flex items-center justify-center text-white">
              <Gamepad mode="intro" delay={0.7} duration={2.4} strokeWidth={5} className="w-full" />
            </div>
          </div>
          <Sparkle mode="intro" delay={1.6} duration={1} strokeWidth={3} className="absolute -right-2 -top-4 w-12 text-lime" />
          <Sparkle mode="intro" delay={1.9} duration={1} strokeWidth={3} className="absolute -left-4 bottom-10 w-8 text-aqua" />
        </div>
      </div>
    </section>
  );
}
