"use client";

import Link from "@/components/AppLink";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { gsap, ScrollTrigger, SCRUB, useGSAP } from "@/lib/gsap";
import { metrics } from "@/lib/site";
import { Bolt, BrowserWindow, Orbits, Sparkle } from "@/components/draw/art";

type IconProps = { mode?: "scroll" | "intro"; duration?: number; strokeWidth?: number; className?: string };
const ICONS: ComponentType<IconProps>[] = [Bolt, BrowserWindow, Orbits, Sparkle];
const TONES = ["from-accent to-aqua", "from-aqua to-lime", "from-pink to-accent", "from-lime to-aqua"];

/**
 * Impact console: a sticky stage where scrolling steps through each metric.
 * The ring tracks overall progress, the number rolls to the active value and
 * its icon redraws. Click a metric to jump to it; the dial tilts toward the pointer.
 */
function ImpactConsole() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const m = metrics[active];
  const Icon = ICONS[active % ICONS.length];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const ring = q("[data-ring-arc]")[0] as unknown as SVGCircleElement;
      const len = ring.getTotalLength();
      gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB,
        animation: gsap
          .timeline({ defaults: { ease: "none" } })
          .to(ring, { strokeDashoffset: 0, duration: 1 }, 0)
          .to(q("[data-orbit-bg]"), { rotate: 120, duration: 1 }, 0),
        onUpdate: (self) => {
          const i = Math.min(metrics.length - 1, Math.floor(self.progress * metrics.length));
          setActive((prev) => (prev === i ? prev : i));
          q("[data-dwell]").forEach((bar, j) => {
            const local = gsap.utils.clamp(0, 1, self.progress * metrics.length - j);
            (bar as HTMLElement).style.transform = `scaleX(${local})`;
          });
        },
      });
    },
    { scope: root },
  );

  // Roll the number whenever the active metric changes.
  useGSAP(
    () => {
      const el = root.current!.querySelector<HTMLElement>("[data-number]")!;
      const from = Number(el.dataset.current ?? 0);
      const obj = { v: from };
      gsap.to(obj, {
        v: m.value,
        duration: 0.9,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v)).padStart(2, "0");
          el.dataset.current = String(Math.round(obj.v));
        },
      });
      gsap.fromTo("[data-swap]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out", stagger: 0.05 });
    },
    { scope: root, dependencies: [active] },
  );

  // Pointer tilt on the dial.
  useEffect(() => {
    const dial = root.current?.querySelector<HTMLElement>("[data-dial]");
    if (!dial || !window.matchMedia("(pointer: fine)").matches) return;
    const rx = gsap.quickTo(dial, "rotateX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(dial, "rotateY", { duration: 0.6, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      const r = dial.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 16);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
    };
    const reset = () => {
      rx(0);
      ry(0);
    };
    const stage = dial.parentElement!;
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", reset);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
    };
  }, []);

  const jump = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((i + 0.5) / metrics.length) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} aria-labelledby="impact-title" className="relative bg-paper" style={{ minHeight: `${100 + metrics.length * 70}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-4 md:px-10">
        <Orbits strokeWidth={1.2} start="top 90%" end="top 20%" className="pointer-events-none absolute -left-[10vw] bottom-[-14vw] w-[44vw] text-accent/20" />

        <div className="relative grid w-full items-center gap-8 md:grid-cols-12 md:gap-10">
          {/* metric selector */}
          <div className="order-2 md:order-1 md:col-span-5">
            <div>
              <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">04 — Impact</p>
              <h2 id="impact-title" className="mt-4 font-display text-[clamp(2rem,4.2vw,4.25rem)] uppercase leading-[0.9] text-ink">
                Numbers I&rsquo;m <span className="text-gradient">willing to sign</span>
              </h2>
            </div>

            <ol className="mt-6 grid grid-cols-2 gap-2 md:mt-10 md:grid-cols-1 md:gap-0 md:border-t md:border-ink/10">
              {metrics.map((x, i) => (
                <li key={x.label} className="md:border-b md:border-ink/10">
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={active === i ? "step" : undefined}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-3 py-3 text-left transition-colors duration-500 md:rounded-none md:px-2 md:py-5 ${
                      active === i ? "bg-white md:bg-transparent" : "bg-white/50 md:bg-transparent"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors duration-500 ${
                        active === i ? "bg-ink text-lime" : "bg-ink/5 text-graphite"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate font-medium transition-colors ${active === i ? "text-ink" : "text-graphite"}`}>{x.label}</span>
                      <span className="hidden text-micro uppercase tracking-[0.16em] text-graphite/80 md:block">{x.note}</span>
                    </span>
                    <span
                      data-dwell
                      aria-hidden
                      style={{ transform: "scaleX(0)" }}
                      className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-gradient-to-r from-accent to-aqua"
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* the dial */}
          <div className="order-1 flex justify-center [perspective:1000px] md:order-2 md:col-span-7">
            <div data-dial className="relative aspect-square w-[min(72vw,30rem)] [transform-style:preserve-3d] md:w-[min(42vw,34rem)]">
              <svg data-orbit-bg aria-hidden viewBox="0 0 200 200" className="absolute inset-[-10%] h-[120%] w-[120%] text-accent/15">
                <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeDasharray="2 6" />
              </svg>
              <div className={`absolute inset-[12%] rounded-full bg-gradient-to-br ${TONES[active % TONES.length]} opacity-90 blur-[2px] transition-[background] duration-700`} />
              <div className="absolute inset-[14%] rounded-full bg-paper/85 backdrop-blur-sm" />

              <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="impact-arc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7A3CFF" />
                    <stop offset="100%" stopColor="#00B8F0" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="92" fill="none" stroke="rgb(27 20 70 / 0.08)" strokeWidth="6" />
                <circle data-ring-arc cx="100" cy="100" r="92" fill="none" stroke="url(#impact-arc)" strokeWidth="6" strokeLinecap="round" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div key={`icon-${active}`} className="mb-2 w-14 text-accent md:w-16">
                  <Icon mode="intro" duration={1} strokeWidth={5} className="w-full" />
                </div>
                <p
                  className={`text-gradient font-display leading-[0.85] tabular-nums transition-[font-size] duration-500 ${
                    String(m.value).length + m.suffix.length > 3 ? "text-[clamp(3rem,7vw,6.5rem)]" : "text-[clamp(4rem,10vw,9rem)]"
                  }`}
                >
                  <span data-number aria-hidden>
                    00
                  </span>
                  <span aria-hidden>{m.suffix}</span>
                  <span className="sr-only">
                    {m.value}
                    {m.suffix}
                  </span>
                </p>
                <p data-swap className="mt-3 max-w-[16rem] px-4 font-medium text-ink">
                  {m.label}
                </p>
                <p data-swap className="mt-1 text-micro uppercase tracking-[0.18em] text-graphite">
                  {m.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Kinetic CTA: tall parent + sticky viewport, a colour portal opens as you scroll. */
function KineticCta() {
  const ctaRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ctaRef);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ctaRef.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });
      tl.fromTo(q("[data-row='a']"), { xPercent: 0 }, { xPercent: -45, duration: 1 }, 0)
        .fromTo(q("[data-row='b']"), { xPercent: -45 }, { xPercent: 0, duration: 1 }, 0)
        .fromTo(q("[data-row='c']"), { xPercent: -5 }, { xPercent: -40, duration: 1 }, 0)
        .fromTo(q("[data-portal]"), { clipPath: "circle(7% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.55, ease: "power2.in" }, 0.35)
        .fromTo(q("[data-portal-arrow]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 0.38)
        .fromTo(q("[data-portal-inner]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55 }, 0.4)
        .fromTo(q("[data-portal-copy]"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.75);
    },
    { scope: ctaRef },
  );

  const row = (words: string, outline = false) =>
    Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={`pr-[4vw] ${outline ? "text-outline" : ""}`}>
        {words}
      </span>
    ));

  return (
    <section ref={ctaRef} aria-labelledby="cta-title" className="relative min-h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex select-none flex-col justify-center gap-[2vh] font-display text-[clamp(4rem,15vw,16rem)] uppercase leading-[0.85] text-ink">
          <div data-row="a" className="w-max whitespace-nowrap">{row("Let's build —")}</div>
          <div data-row="b" className="w-max whitespace-nowrap">{row("Something —", true)}</div>
          <div data-row="c" className="text-gradient w-max whitespace-nowrap">{row("Inevitable —")}</div>
        </div>

        <div
          data-portal
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent via-[#9a5bff] to-aqua text-white [clip-path:circle(7%_at_50%_50%)]"
        >
          <span data-portal-arrow aria-hidden className="absolute font-display text-[clamp(2rem,4vw,4rem)]">
            ↘
          </span>
          <div data-portal-inner className="flex flex-col items-center px-4 text-center">
            <p data-portal-copy className="mb-6 text-micro uppercase tracking-[0.24em]">
              05 — Now booking select projects
            </p>
            <h2 id="cta-title" className="font-display text-giant uppercase">
              Start a
              <br />
              Project
            </h2>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-4 rounded-full bg-white px-7 py-4 text-sm uppercase tracking-[0.16em] text-ink transition-transform duration-500 ease-expo hover:scale-105"
            >
              Let&rsquo;s talk <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Impact() {
  return (
    <>
      <ImpactConsole />
      <KineticCta />
    </>
  );
}
