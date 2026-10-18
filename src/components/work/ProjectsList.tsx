"use client";

import Image from "next/image";
import Link from "@/components/AppLink";
import { useRef, useState, type ComponentType } from "react";
import { gsap, ScrollTrigger, SCRUB, useDeferredGSAP } from "@/lib/gsap";
import { projects } from "@/lib/site";
import { Bolt, BrowserWindow, Cart, Orbits, WireCube } from "@/components/draw/art";

const ICONS: Record<string, ComponentType<{ className?: string; strokeWidth?: number; start?: string; end?: string }>> = {
  touchpoint: BrowserWindow,
  "headless-commerce": Cart,
  "3d-configurators": WireCube,
  haprow: Bolt,
  gophygital: Orbits,
};

const TINTS = ["from-accent to-aqua", "from-aqua to-lime", "from-pink to-accent", "from-accent to-pink", "from-lime to-aqua"];

/** Case-study index: sticky project rail on the left tracks the article in view. */
export default function ProjectsList() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useDeferredGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q("[data-project]").forEach((article, i) => {
        ScrollTrigger.create({
          trigger: article,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: article, start: "top 90%", end: "top 25%", scrub: SCRUB },
        });
        tl.fromTo(article.querySelector("[data-media]"), { clipPath: "inset(18% 12% 18% 12% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 2rem)" }, 0)
          .fromTo(article.querySelector("[data-media] img"), { scale: 1.3 }, { scale: 1 }, 0)
          .fromTo(article.querySelector("[data-tint]"), { rotate: 0, x: 0, y: 0 }, { rotate: i % 2 ? -4 : 4, x: i % 2 ? -18 : 18, y: 18 }, 0)
          .fromTo(article.querySelectorAll("[data-reveal]"), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0.1);

        gsap.fromTo(
          article.querySelector("[data-num]"),
          { yPercent: 30 },
          { yPercent: -30, ease: "none", scrollTrigger: { trigger: article, start: "top bottom", end: "bottom top", scrub: SCRUB } },
        );
      });

      gsap.fromTo(q("[data-rail-fill]"), { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: q("[data-list]")[0], start: "top 55%", end: "bottom 55%", scrub: SCRUB },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="projects-title" className="relative px-4 pb-24 md:px-10 md:pb-40">
      <h2 id="projects-title" className="sr-only">
        Case studies
      </h2>
      <div className="grid gap-12 md:grid-cols-12">
        {/* sticky index */}
        <nav aria-label="Projects" className="hidden md:col-span-3 md:block">
          <div className="sticky top-32">
            <p className="mb-6 inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Index</p>
            <div className="relative pl-6">
              <span aria-hidden className="absolute left-0 top-0 h-full w-[3px] rounded-full bg-ink/10">
                <span data-rail-fill className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-accent via-aqua to-pink" />
              </span>
              <ol className="space-y-4">
                {projects.map((p, i) => (
                  <li key={p.slug}>
                    <a
                      href={`#${p.slug}`}
                      aria-current={active === i ? "true" : undefined}
                      className={`flex items-baseline gap-3 transition-all duration-500 ease-expo ${
                        active === i ? "translate-x-2 text-ink" : "text-graphite/60 hover:text-ink"
                      }`}
                    >
                      <span className={`text-micro ${active === i ? "text-accent" : ""}`}>{p.index}</span>
                      <span className={`font-display uppercase leading-none ${active === i ? "text-2xl" : "text-lg"} transition-all duration-500`}>
                        {p.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </nav>

        {/* articles */}
        <div data-list className="space-y-32 md:col-span-9 md:space-y-48">
          {projects.map((p, i) => {
            const Icon = ICONS[p.slug] ?? BrowserWindow;
            const flip = i % 2 === 1;
            return (
              <article
                key={p.slug}
                id={p.slug}
                data-project
                aria-labelledby={`${p.slug}-h`}
                className="relative scroll-mt-28"
              >
                <span
                  data-num
                  aria-hidden
                  className={`text-outline pointer-events-none absolute -top-16 font-display text-[clamp(8rem,18vw,18rem)] leading-none ${flip ? "left-0" : "right-0"}`}
                >
                  {p.index}
                </span>

                <div className={`relative grid items-center gap-10 lg:grid-cols-12 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div className="relative lg:col-span-7">
                    <div data-tint aria-hidden className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${TINTS[i % TINTS.length]}`} />
                    <div data-media className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-mist">
                      <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 50vw, 92vw" className="object-cover" />
                    </div>
                    <Icon
                      strokeWidth={4}
                      start="top 80%"
                      end="top 30%"
                      className={`absolute -bottom-10 w-24 text-accent md:w-28 ${flip ? "-left-6" : "-right-6"} rounded-2xl`}
                    />
                  </div>

                  <div className="lg:col-span-5">
                    <p data-reveal className="flex flex-wrap items-center gap-3 text-micro uppercase tracking-[0.2em]">
                      <span className="rounded-full bg-ink px-2.5 py-1 text-white">{p.index}</span>
                      <span className="text-accent">{p.kicker}</span>
                    </p>
                    <h3 id={`${p.slug}-h`} data-reveal className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] uppercase leading-[0.9] text-ink">
                      <Link href={`/work/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p data-reveal className="mt-5 text-lede">
                      {p.summary}
                    </p>
                    <p data-reveal className="mt-5 text-sm leading-relaxed text-ink">
                      <span className="text-graphite">Role — </span>
                      {p.role}
                    </p>
                    <ul data-reveal className="mt-5 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[0.75rem] text-ink">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                      <Link
                        href={`/work/${p.slug}`}
                        className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-ink"
                      >
                        <span className="link-underline">Read the case study</span>
                        <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-lime transition-transform duration-500 ease-expo group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                      <Link href="/contact" className="link-underline text-sm uppercase tracking-[0.14em] text-graphite hover:text-ink">
                        Build something like this
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
