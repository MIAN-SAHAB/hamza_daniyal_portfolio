"use client";

import Image from "next/image";
import Link from "@/components/AppLink";
import { useRef } from "react";
import { gsap, SCRUB, useDeferredGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/site";
import { BrowserWindow } from "@/components/draw/art";

const ACCENT: Record<Project["accent"], string> = {
  accent: "bg-accent text-white",
  aqua: "bg-aqua text-white",
  ink: "bg-ink text-white",
};

// Staggered baselines: every panel composes its media differently.
const LAYOUTS = [
  { media: "md:left-0 md:top-[17%] md:w-[58%] md:aspect-[4/3]", title: "md:left-[34%] md:top-[56%]", copy: "md:left-[64%] md:top-[18%]" },
  { media: "md:left-[22%] md:top-[26%] md:w-[38%] md:aspect-[3/4]", title: "md:left-0 md:top-[12%]", copy: "md:left-[66%] md:top-[48%]" },
  { media: "md:left-[8%] md:top-[30%] md:w-[52%] md:aspect-[16/11]", title: "md:left-[40%] md:top-[14%]", copy: "md:left-[66%] md:top-[62%]" },
  { media: "md:left-[30%] md:top-[14%] md:w-[42%] md:aspect-[4/5]", title: "md:left-[2%] md:top-[62%]", copy: "md:left-[76%] md:top-[22%]" },
  { media: "md:left-[4%] md:top-[20%] md:w-[50%] md:aspect-[5/4]", title: "md:left-[38%] md:top-[60%]", copy: "md:left-[62%] md:top-[16%]" },
];

export default function Works() {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0] as HTMLElement;
      const counter = q("[data-current]")[0] as HTMLElement;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      // Tall parent drives the sticky viewport — ScrollTrigger only scrubs, never pins.
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(projects.length, Math.max(1, Math.round(self.progress * projects.length + 0.4)));
            counter.textContent = String(i).padStart(2, "0");
          },
        },
      });

      gsap.fromTo(q("[data-progress]"), { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: SCRUB },
      });

      // Inner parallax, measured against the horizontal tween.
      q("[data-panel]").forEach((panel) => {
        const sub = { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: SCRUB };
        gsap.fromTo(panel.querySelector("[data-media-img]"), { xPercent: -10, scale: 1.15 }, { xPercent: 10, scale: 1.15, ease: "none", scrollTrigger: sub });
        gsap.fromTo(panel.querySelector("[data-title]"), { xPercent: 18 }, { xPercent: -18, ease: "none", scrollTrigger: sub });
        gsap.fromTo(panel.querySelector("[data-num]"), { xPercent: -30 }, { xPercent: 30, ease: "none", scrollTrigger: sub });
        gsap.fromTo(
          panel.querySelector("[data-media]"),
          { clipPath: "inset(12% 30% 12% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { ...sub, end: "center center" } },
        );
      });

      gsap.fromTo(q("[data-intro-word]"), { yPercent: 100 }, {
        yPercent: 0,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "top top", scrub: SCRUB },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="work"
      ref={root}
      aria-labelledby="work-title"
      className="relative min-h-[350vh] bg-sky"
    >
      {/* diagonal entry edge */}
      <div aria-hidden className="absolute inset-x-0 -top-[8vw] h-[8vw] bg-sky [clip-path:polygon(0_100%,100%_0,100%_100%)]" />

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-4 top-24 z-20 flex items-center gap-4 text-micro uppercase tracking-[0.2em] md:inset-x-10 md:top-28">
          <span className="rounded-full bg-lime px-3 py-1.5 text-ink">02 — Selected Works</span>
          <span className="relative h-px flex-1 bg-ink/10">
            <span data-progress className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-aqua" />
          </span>
          <span className="tabular-nums text-ink">
            <span data-current>01</span> / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div data-track className="flex h-full w-max items-stretch will-change-transform">
          {/* intro panel */}
          <div className="relative flex h-full w-[88vw] shrink-0 flex-col justify-center px-4 md:w-[48vw] md:px-10">
            <h2 id="work-title" className="font-display text-giant uppercase text-ink">
              <span className="block overflow-hidden">
                <span data-intro-word className="block">Selected</span>
              </span>
              <span className="block overflow-hidden md:pl-[8vw]">
                <span data-intro-word className="block">
                  <span className="text-gradient">Works</span>
                </span>
              </span>
            </h2>
            <p className="mt-8 max-w-sm leading-relaxed md:ml-[8vw]">
              Five platforms across headless commerce, real-time WebGL and corporate systems — each engineered from a blank
              file, none from a template.
            </p>
            <p className="mt-6 text-micro uppercase tracking-[0.2em] md:ml-[8vw]">Keep scrolling →</p>
            <BrowserWindow
              trigger="#work"
              start="top 70%"
              end="top top"
              strokeWidth={2.5}
              className="pointer-events-none absolute bottom-[10%] right-[4%] hidden w-[16vw] rotate-6 text-accent md:block"
            />
          </div>

          {projects.map((p, i) => {
            const L = LAYOUTS[i % LAYOUTS.length];
            return (
              <article
                key={p.slug}
                id={p.slug}
                data-panel
                aria-labelledby={`${p.slug}-title`}
                className="relative flex h-full w-[88vw] shrink-0 flex-col justify-center gap-6 px-4 pt-20 md:block md:w-[78vw] md:px-0 md:pt-0"
              >
                <span
                  data-num
                  aria-hidden
                  className="text-outline pointer-events-none absolute -top-[4vh] right-0 font-display text-[clamp(10rem,30vw,34rem)] leading-none md:right-[6%]"
                >
                  {p.index}
                </span>

                <div data-media className={`relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-mist shadow-[0_50px_90px_-50px_rgba(27,20,70,0.6)] md:absolute ${L.media}`}>
                  <Image
                    data-media-img
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 88vw"
                    className="object-cover will-change-transform"
                  />
                </div>

                <h3
                  id={`${p.slug}-title`}
                  data-title
                  className={`relative z-10 font-display text-huge uppercase text-ink md:absolute ${L.title}`}
                >
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                </h3>

                <div className={`relative z-10 max-w-sm md:absolute md:max-w-[22vw] ${L.copy}`}>
                  <p className="flex items-center gap-3 text-micro uppercase tracking-[0.2em]">
                    <span className={`rounded-full px-2.5 py-1 ${ACCENT[p.accent]}`}>{p.index}</span>
                    {p.kicker}
                  </p>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed">{p.summary}</p>
                  <p className="mt-4 hidden text-[0.8125rem] leading-relaxed text-ink sm:block">
                    <span className="text-graphite">Role — </span>
                    {p.role}
                  </p>
                  <p className="mt-3 text-micro uppercase tracking-[0.16em] text-ink">{p.stack.join("  /  ")}</p>
                </div>
              </article>
            );
          })}

          <div className="flex h-full w-[80vw] shrink-0 items-center justify-center px-6 md:w-[40vw]">
            <Link
              href="/work"
              className="group relative flex aspect-square w-[min(70vw,24rem)] flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent to-aqua text-center text-white shadow-[0_50px_100px_-40px_rgba(122,60,255,0.8)] transition-transform duration-700 ease-expo hover:scale-105"
            >
              <span className="text-micro uppercase tracking-[0.2em] text-white/80">Full case studies</span>
              <span className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[0.9]">
                See all
                <br />
                the work
              </span>
              <span className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-lime text-xl text-ink transition-transform duration-500 group-hover:-rotate-45">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
