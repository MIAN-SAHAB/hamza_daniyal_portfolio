"use client";

import Image from "next/image";
import Link from "@/components/AppLink";
import { useEffect, useRef } from "react";
import { gsap, SCRUB, SplitText, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { site } from "@/lib/site";
import { CurvedArrow, Orbits, Sparkle } from "@/components/draw/art";

const chars = (word: string, animate = true) =>
  word.split("").map((c, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
      <span data-char={animate ? "" : undefined} className="inline-block will-change-transform">
        {c}
      </span>
    </span>
  ));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = (s: number) => (reduce ? 0.01 : s);

      // ---- Entrance (auto-plays once the preloader hands off) ----
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.from(q("[data-blob]"), { scale: 0.3, autoAlpha: 0, duration: d(2), stagger: 0.15 })
        .from(q("[data-disc]"), { scale: 0.2, duration: d(1.6), ease: "back.out(1.4)" }, 0.1)
        .from(q("[data-char]"), { yPercent: 115, rotate: 8, duration: d(1.4), stagger: 0.035 }, 0.2)
        .from(q("[data-figure]"), { yPercent: 18, autoAlpha: 0, duration: d(1.6) }, 0.35)
        .from(q("[data-front]"), { autoAlpha: 0, duration: d(1) }, 1.1)
        .from(q("[data-chip]"), { autoAlpha: 0, scale: 0.5, y: 30, duration: d(1.1), stagger: 0.12, ease: "back.out(2)" }, 0.9)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: d(1), stagger: 0.08 }, 0.7)
        .add(
          contextSafe!(() => {
            const lede = q("[data-lede]")[0];
            if (!lede || reduce) return;
            const split = SplitText.create(lede, { type: "lines", mask: "lines" });
            gsap.from(split.lines, { yPercent: 100, duration: 1.1, ease: "expo.out", stagger: 0.09, onComplete: () => split.revert() });
          }),
          0.8,
        );
      entrance.current = tl;
      // Start states are applied — safe to reveal the (CSS-hidden) hero without a flash.
      root.current!.classList.add("hero-ready");

      // Idle float on the chips — each on its own rhythm.
      q("[data-chip-inner]").forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? 10 : -10, rotate: i % 2 ? -2 : 2, duration: 2.6 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      );

      // ---- Scroll-scrubbed exit ----
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
        })
        .to(q("[data-line='1']"), { xPercent: -14 }, 0)
        .to(q("[data-line='2']"), { xPercent: 10 }, 0)
        .to(q("[data-figure-wrap]"), { yPercent: 12 }, 0)
        .to(q("[data-disc]"), { scale: 1.25 }, 0)
        .to(q("[data-chip]"), { y: (i: number) => -80 - i * 40 }, 0)
        .to(q("[data-blob]"), { yPercent: (i: number) => (i % 2 ? 30 : -30) }, 0);
    },
    { scope: root },
  );

  useEffect(() => {
    if (introDone) entrance.current?.play();
  }, [introDone]);

  const nameClasses = "font-display uppercase leading-[0.84] text-[clamp(3.6rem,16.5vw,9rem)] md:text-[11.2vw]";

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      data-hero
      className="relative flex min-h-svh flex-col overflow-hidden px-4 pt-28 md:block md:px-10 md:pt-0"
    >
      {/* colour field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span data-blob className="blob -right-[10vw] -top-[12vw] h-[48vw] w-[48vw] bg-aqua" />
        <span data-blob className="blob -left-[14vw] bottom-[-18vw] h-[46vw] w-[46vw] bg-accent opacity-40" />
        <span data-blob className="blob left-[38%] top-[8%] h-[16vw] w-[16vw] bg-lime opacity-50" />
      </div>

      {/* meta row */}
      <div data-fade className="relative z-30 flex items-start justify-between gap-6 text-micro uppercase tracking-[0.2em] text-graphite md:absolute md:inset-x-10 md:top-28">
        <p className="leading-relaxed">
          Senior Full-Stack Developer
          <br />& Creative Technologist
        </p>
        <p className="hidden text-right leading-relaxed sm:block">
          Based in {site.location}
          <br />
          Shipping since {site.since}
        </p>
      </div>

      {/* the name — sits BEHIND the figure */}
      <h1 id="hero-title" className="relative z-10 mt-8 text-ink md:absolute md:inset-x-10 md:top-[24%] md:mt-0">
        <span className="sr-only">
          {site.name} — {site.role}
        </span>
        <span aria-hidden data-line="1" className={`block ${nameClasses}`}>
          {chars("Hamza")}
        </span>
        <span aria-hidden data-line="2" className={`block md:pl-[9vw] ${nameClasses}`}>
          {chars("Daniyal")}
        </span>
      </h1>

      {/* the figure */}
      <div
        data-figure-wrap
        className="relative z-20 mx-auto mt-2 aspect-[2287/2827] h-[52svh] max-w-full md:absolute md:max-w-none md:bottom-0 md:left-[66%] md:mt-0 md:h-[94svh] md:-translate-x-1/2"
      >
        <div
          data-disc
          aria-hidden
          className="absolute bottom-[4%] left-1/2 aspect-square w-[96%] -translate-x-1/2 rounded-full bg-gradient-to-br from-accent via-[#9a5bff] to-aqua shadow-[0_60px_120px_-40px_rgba(122,60,255,0.6)]"
        />
        <Orbits
          mode="intro"
          delay={0.6}
          strokeWidth={1.2}
          className="absolute bottom-[-4%] left-1/2 w-[140%] -translate-x-1/2 text-accent/40"
        />
        <div data-figure className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
          <Image
            src="/assets/images/Hamza-Daniyal.webp"
            alt={`Portrait of ${site.name}`}
            width={2287}
            height={2827}
            // LCP on every viewport: fetch immediately at top priority (per Next 16, instead of `preload`).
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 50vw, 80vw"
            className="h-full w-full object-contain object-bottom"
          />
        </div>

        {/* floating chips, anchored to the figure */}
        <div data-chip className="absolute -top-[2%] left-0 md:left-[-30%] md:top-[24%]">
          <p
            data-chip-inner
            className="flex -rotate-6 items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink shadow-[0_18px_40px_-16px_rgba(27,20,70,0.45)] md:text-[0.75rem]"
          >
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent text-accent" />
            Available for select projects
          </p>
        </div>
        <div data-chip className="absolute right-0 top-[50%] md:right-[-22%] md:top-[46%]">
          <p
            data-chip-inner
            className="rotate-3 rounded-2xl bg-white/80 px-4 py-3 text-ink shadow-[0_24px_50px_-20px_rgba(27,20,70,0.45)] backdrop-blur-md"
          >
            <span className="block font-display text-2xl leading-none text-gradient md:text-3xl">8+ yrs</span>
            <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.14em]">crafting the web</span>
          </p>
        </div>
        <div data-chip className="absolute bottom-[16%] left-[-18%] hidden sm:block md:left-[-26%]">
          <p
            data-chip-inner
            className="-rotate-3 rounded-full bg-aqua px-4 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink shadow-[0_18px_40px_-16px_rgba(0,184,240,0.7)]"
          >
            Next.js · R3F · Laravel
          </p>
        </div>
        <Sparkle mode="intro" delay={1.4} duration={1} className="absolute right-[6%] top-[4%] w-10 text-accent md:w-14" />
        <Sparkle mode="intro" delay={1.7} duration={1} className="absolute left-[8%] top-[14%] w-6 text-aqua md:w-8" />
      </div>

      {/* outline echo of the surname IN FRONT of the figure — the type wraps around him */}
      <p
        aria-hidden
        data-front
        className={`pointer-events-none absolute z-20 hidden text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.85)] md:inset-x-10 md:top-[24%] md:block`}
      >
        <span className={`invisible block ${nameClasses}`}>{chars("Hamza", false)}</span>
        <span data-line="2" className={`block md:pl-[9vw] ${nameClasses}`}>
          {chars("Daniyal", false)}
        </span>
      </p>

      {/* intro + CTAs */}
      <div className="relative z-30 mt-8 pb-10 md:absolute md:bottom-12 md:left-10 md:mt-0 md:max-w-sm md:pb-0">
        <p data-lede className="text-lede text-graphite">
          I build <span className="marker text-ink">fast, vivid</span> web platforms — headless storefronts, real-time WebGL and
          the systems underneath.
        </p>
        <div data-fade className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-aqua px-6 py-3.5 text-sm uppercase tracking-[0.14em] text-white shadow-[0_18px_40px_-16px_rgba(122,60,255,0.8)] transition-transform duration-500 ease-expo hover:-translate-y-0.5"
          >
            See the work
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
          </Link>
          <Link href="/contact" className="link-underline text-sm uppercase tracking-[0.14em] text-ink">
            Start a project
          </Link>
        </div>
      </div>

      <CurvedArrow
        mode="intro"
        delay={1.2}
        duration={1.2}
        strokeWidth={2}
        className="absolute bottom-[14%] left-[26%] z-30 hidden w-28 -rotate-12 text-accent lg:block"
      />
    </section>
  );
}
