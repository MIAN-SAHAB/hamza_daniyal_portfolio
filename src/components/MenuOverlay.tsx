"use client";

import Image from "next/image";
import Link from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { closeOverlay, lockScroll, openOverlay, useOverlay } from "@/lib/ui";
import { images, nav, projects, services, site } from "@/lib/site";
import CopyEmail, { PhoneLink } from "./CopyEmail";
import { ScribbleLoop } from "./draw/art";

const PREVIEW: Record<string, { src: string; alt: string; tint: string }> = {
  "/": { src: "/assets/images/Hamza-Daniyal.webp", alt: "Portrait of Hamza Daniyal", tint: "from-accent to-aqua" },
  "/work": { src: projects[0].image, alt: projects[0].imageAlt, tint: "from-aqua to-accent" },
  "/services": { src: images.waves, alt: "Flowing blue light waves", tint: "from-accent to-pink" },
  "/about": { src: images.desk, alt: "Minimal desk setup", tint: "from-lime to-aqua" },
  "/gaming": { src: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_hero.jpg", alt: "Counter-Strike 2 key art", tint: "from-pink to-accent" },
  "/contact": { src: images.notebook, alt: "Notebook and pen", tint: "from-aqua to-lime" },
};

const BADGES: Record<string, string> = {
  "/work": String(projects.length).padStart(2, "0"),
  "/gaming": "GG",
};

/** Full-screen navigation popup. Stays mounted (inert when closed) so open/close can animate both ways. */
export default function MenuOverlay() {
  const overlay = useOverlay();
  const open = overlay === "menu";
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const preview = PREVIEW[hovered ?? pathname] ?? PREVIEW["/"];
  // The (invisible) overlay covers the viewport, so lazy-loading can't hold its
  // preview image back — only mount it once the menu has actually been opened.
  const [armed, setArmed] = useState(false);
  if (open && !armed) setArmed(true);

  // Close when the route changes.
  useEffect(() => {
    closeOverlay();
  }, [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    root.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOverlay();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.getElementById("menu-button")?.focus();
    };
  }, [open]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (open) {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .set(root.current, { autoAlpha: 1 })
          .fromTo(root.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" })
          .fromTo(q("[data-link]"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06 }, 0.35)
          .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.06 }, 0.35)
          .fromTo(q("[data-card]"), { rotate: 18, scale: 0.7, autoAlpha: 0 }, { rotate: 6, scale: 1, autoAlpha: 1, duration: 1.2, ease: "back.out(1.4)" }, 0.45)
          .fromTo(q("[data-fade]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.6);
      } else if (armed) {
        gsap
          .timeline()
          .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "expo.inOut" })
          .set(root.current, { autoAlpha: 0 });
      }
    },
    { dependencies: [open], scope: root },
  );

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className="invisible fixed inset-0 z-[80] overflow-y-auto bg-[#160b33] text-[#fbf7ff] opacity-0"
    >
      {/* glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <span className="blob -left-[10vw] -top-[10vw] h-[45vw] w-[45vw] bg-accent opacity-45" />
        <span className="blob -bottom-[14vw] -right-[8vw] h-[42vw] w-[42vw] bg-pink opacity-35" />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-[1400px] flex-col px-4 pb-10 md:px-10">
        {/* top bar */}
        <div className="flex items-center justify-between py-6 md:py-8">
          <button
            type="button"
            data-close
            onClick={closeOverlay}
            className="flex items-center gap-2 rounded-md border border-white/40 px-3 py-1.5 font-display text-sm uppercase tracking-[0.08em] transition-colors hover:border-lime hover:text-lime"
          >
            <span aria-hidden>✕</span> Close
          </button>
          <Link href="/" className="font-display text-xl uppercase tracking-[0.06em] md:text-2xl" aria-label="Home">
            HD<span className="text-lime">.</span>
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-white px-5 py-2.5 font-display text-sm uppercase tracking-[0.06em] text-ink transition-colors hover:bg-lime"
          >
            Let&rsquo;s talk
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-16 py-8 md:grid-cols-12 md:gap-10">
          {/* links */}
          <nav aria-label="Primary" className="md:col-span-6">
            <ul>
              {nav.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const badge = BADGES[item.href];
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      onClick={closeOverlay}
                      onMouseEnter={() => setHovered(item.href)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(item.href)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-start gap-5 py-3 md:gap-8"
                    >
                      <span className="mt-3 w-6 text-[0.6875rem] font-medium tracking-[0.1em] text-lime">0{i + 1}</span>
                      <span className="block overflow-hidden">
                        <span
                          data-link
                          className={`flex items-center gap-4 font-display text-[clamp(2.75rem,6.4vw,6rem)] uppercase leading-[0.95] transition-colors duration-300 ${
                            active ? "text-aqua" : "group-hover:text-lime"
                          }`}
                        >
                          {item.label}
                          {badge && (
                            <span className="mt-1 self-start rounded-full bg-pink px-2 py-0.5 font-sans text-xs font-medium text-white">
                              {badge}
                            </span>
                          )}
                          <span
                            aria-hidden
                            className={`text-[0.5em] transition-all duration-500 ease-expo ${
                              active ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          >
                            →
                          </span>
                        </span>
                      </span>
                    </Link>
                    <span data-rule aria-hidden className="block h-px origin-left bg-white/12" />
                  </li>
                );
              })}
            </ul>
            <p data-fade className="mt-8 font-display text-sm uppercase tracking-[0.08em] text-white/50">
              We make the web feel inevitable
            </p>
          </nav>

          {/* preview card + contact */}
          <div className="md:col-span-5 md:col-start-8">
            <div className="relative mx-auto w-full max-w-[34rem]">
              <div
                data-card
                className={`relative aspect-[16/10] overflow-hidden rounded-[1.6rem] border-[6px] border-white bg-gradient-to-br ${preview.tint} shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]`}
              >
                {armed && <Image
                  key={preview.src}
                  src={preview.src}
                  alt={preview.alt}
                  fill
                  sizes="(min-width: 768px) 34rem, 90vw"
                  className={`animate-[page-enter_0.6s_var(--ease-out-expo)_both] ${preview.src.endsWith(".webp") ? "object-contain object-bottom" : "object-cover"}`}
                />}
              </div>
              <span
                data-fade
                className="absolute -right-3 -top-5 rotate-[-6deg] rounded-full bg-lime px-4 py-2 font-display text-sm uppercase tracking-[0.06em] text-ink shadow-lg md:-right-8"
              >
                {services.length} services ✦
              </span>
              <ScribbleLoop mode="intro" duration={1.4} strokeWidth={3} className="absolute -bottom-12 -right-6 w-24 text-pink md:-right-12" />
            </div>

            <div data-fade className="mt-14 md:pl-4">
              <p className="font-display text-sm uppercase tracking-[0.08em] text-lime">Say hello</p>
              <CopyEmail className="mt-2 text-lede font-medium text-white" />
              <p className="mt-2 text-white/80">
                <PhoneLink />
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full border border-white/25 px-4 py-2 text-sm font-medium transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Trigger used by the header. */
export function MenuButton() {
  const overlay = useOverlay();
  return (
    <button
      id="menu-button"
      type="button"
      onClick={() => openOverlay(overlay === "menu" ? "none" : "menu")}
      aria-expanded={overlay === "menu"}
      aria-controls="site-menu"
      className="group flex items-center gap-3 rounded-full bg-ink py-2.5 pl-5 pr-3 text-[0.8125rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent"
    >
      Menu
      <span aria-hidden className="flex h-6 w-6 flex-col items-center justify-center gap-1 rounded-full bg-lime">
        <span className="h-px w-3 bg-ink transition-transform duration-300 group-hover:translate-x-0.5" />
        <span className="h-px w-3 bg-ink transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
    </button>
  );
}
