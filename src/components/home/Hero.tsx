"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, SCRUB, SplitText, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";
import { images, site } from "@/lib/site";

const chars = (word: string) =>
  word.split("").map((c, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
      <span data-char className="inline-block will-change-transform">
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

      // ---- Entrance (auto-plays once the preloader hands off) ----
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.from(q("[data-char]"), { yPercent: 115, rotate: 6, duration: reduce ? 0.01 : 1.5, stagger: 0.04 })
        .fromTo(
          q("[data-hero-media]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          0.1,
        )
        .from(q("[data-hero-media] img"), { scale: 1.35, duration: 2.2 }, 0.1)
        .from(q("[data-pill]"), { autoAlpha: 0, scale: 0.6, rotate: -18, duration: 1.2, ease: "back.out(2)" }, 0.9)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.6)
        .from(q("[data-rule]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" }, 0.3)
        .add(
          contextSafe!(() => {
            // Line-mask the lede once fonts are settled, then restore natural reflow.
            const lede = q("[data-lede]")[0];
            if (!lede) return;
            const split = SplitText.create(lede, { type: "lines", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 100,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              onComplete: () => split.revert(),
            });
          }),
          0.7,
        );
      entrance.current = tl;

      // Idle float for the status pill.
      gsap.to(q("[data-pill-inner]"), { y: -10, rotate: 2, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // ---- Scroll-scrubbed exit: the name splits apart as the page lifts away ----
      const exit = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: SCRUB },
      });
      exit
        .to(q("[data-line='1']"), { xPercent: -12 }, 0)
        .to(q("[data-line='2']"), { xPercent: 10 }, 0)
        .to(q("[data-hero-media]"), { yPercent: -18, rotate: -2 }, 0)
        .to(q("[data-pill]"), { yPercent: -160 }, 0)
        .to(q("[data-exit-fade]"), { autoAlpha: 0, y: -40 }, 0);

      // ---- Interactive coordinate tracker ----
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (!fine) return;
      const vx = gsap.quickTo(q("[data-cross-x]"), "x", { duration: 0.6, ease: "power3" });
      const hy = gsap.quickTo(q("[data-cross-y]"), "y", { duration: 0.6, ease: "power3" });
      const outX = q("[data-coord-x]")[0];
      const outY = q("[data-coord-y]")[0];
      const outD = q("[data-coord-d]")[0];
      const onMove = (e: PointerEvent) => {
        const r = root.current!.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        vx(x);
        hy(y);
        const nx = x / r.width;
        const ny = y / r.height;
        outX.textContent = (nx * 100).toFixed(2).padStart(6, "0");
        outY.textContent = (ny * 100).toFixed(2).padStart(6, "0");
        outD.textContent = `${Math.round(Math.atan2(0.5 - ny, nx - 0.5) * (180 / Math.PI) + 360) % 360}°`;
      };
      root.current!.addEventListener("pointermove", onMove);
      gsap.to(q("[data-cross]"), { autoAlpha: 1, duration: 0.6, delay: 1 });
      return () => root.current?.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  useEffect(() => {
    if (introDone) entrance.current?.play();
  }, [introDone]);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="arch-grid relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32"
    >
      {/* crosshair */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span data-cross data-cross-x className="invisible absolute left-0 top-0 h-full w-px bg-ink/10 opacity-0" />
        <span data-cross data-cross-y className="invisible absolute left-0 top-0 h-px w-full bg-ink/10 opacity-0" />
      </div>

      {/* top meta row */}
      <div data-exit-fade className="relative z-10 flex items-start justify-between gap-6 text-micro uppercase tracking-[0.2em]">
        <p data-fade className="max-w-[16rem] leading-relaxed">
          Senior Full-Stack Developer
          <br />& Creative Technologist
        </p>
        <p data-fade className="hidden text-right leading-relaxed sm:block">
          Folio — Vol. 08
          <br />
          {site.since} — Present
        </p>
      </div>

      {/* floating media, offset behind the name */}
      <div
        data-hero-media
        className="absolute right-4 top-[14%] z-0 aspect-[4/5] w-[42vw] overflow-hidden bg-mist md:right-[9vw] md:top-[14%] md:w-[26vw]"
      >
        <Image
          src={images.towers}
          alt="Monochrome skyscrapers converging toward the sky"
          fill
          preload
          sizes="(min-width: 768px) 26vw, 42vw"
          className="object-cover grayscale"
        />
        <span className="absolute bottom-3 left-3 hidden bg-white/90 md:inline px-2 py-1 text-micro uppercase tracking-[0.18em] text-ink">
          Fig. 01 — Structure
        </span>
      </div>

      {/* status pill */}
      <div data-pill className="absolute left-[6vw] top-[38%] z-20 md:left-[44vw] md:top-[16%]">
        <p
          data-pill-inner
          className="flex -rotate-6 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink shadow-[0_18px_40px_-18px_rgba(17,17,20,0.35)]"
        >
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-vermilion text-vermilion" />
          Available for Select Projects
        </p>
      </div>

      {/* the name */}
      <h1 id="hero-title" className="relative z-10 mt-[22vh] font-display uppercase text-ink md:mt-[8vh]">
        <span className="sr-only">
          {site.name} — {site.role}
        </span>
        <span aria-hidden data-line="1" className="block text-mega -ml-[0.05em]">
          {chars("Hamza")}
        </span>
        <span aria-hidden data-line="2" className="block text-right text-mega md:pr-[2vw]">
          {chars("Daniyal")}
          <span className="inline-block overflow-hidden align-bottom">
            <span data-char className="inline-block text-vermilion">.</span>
          </span>
        </span>
      </h1>

      {/* bottom band */}
      <div data-exit-fade className="relative z-10 mt-10 grid gap-8 md:grid-cols-12 md:items-end">
        <span data-rule className="absolute -top-5 left-0 h-px w-full bg-ink/15 md:col-span-12" aria-hidden />
        <p data-lede className="max-w-xl text-lede text-graphite md:col-span-6">
          I engineer high-performance platforms, headless storefronts and real-time WebGL — where motion, structure and
          speed read as a single gesture.
        </p>

        <div data-fade className="flex flex-wrap items-center gap-6 md:col-span-3 md:col-start-7">
          <Link href="/#work" data-cursor="Scroll" className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-ink">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-500 group-hover:border-vermilion group-hover:bg-vermilion group-hover:text-white">
              ↓
            </span>
            Selected work
          </Link>
          <Link href="/contact" className="link-underline text-sm uppercase tracking-[0.14em] text-ink">
            Start a project
          </Link>
        </div>

        <dl
          data-fade
          aria-label="Pointer coordinates"
          className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-graphite md:col-span-3 md:block md:justify-self-end md:text-right"
        >
          <div className="flex justify-end gap-3">
            <dt>X</dt>
            <dd data-coord-x className="w-14 tabular-nums text-ink">050.00</dd>
          </div>
          <div className="flex justify-end gap-3">
            <dt>Y</dt>
            <dd data-coord-y className="w-14 tabular-nums text-ink">050.00</dd>
          </div>
          <div className="flex justify-end gap-3">
            <dt>Θ</dt>
            <dd data-coord-d className="w-14 tabular-nums text-vermilion">0°</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
