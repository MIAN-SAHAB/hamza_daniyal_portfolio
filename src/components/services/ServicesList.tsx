"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";
import { services } from "@/lib/site";
import { Cart, CodeBrackets, Plug, WireCube } from "@/components/draw/art";

const ICONS = [WireCube, CodeBrackets, Cart, Plug];
const TONES = ["text-accent", "text-aqua", "text-pink", "text-accent"];

/**
 * Editorial service index. Hovering (or focusing) a row expands its detail and
 * summons a floating preview that trails the pointer; rows themselves glide in
 * on a scroll scrub.
 */
export default function ServicesList() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const follow = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q("[data-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? 8 : -8, autoAlpha: 0.2 },
          {
            xPercent: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top 95%", end: "top 55%", scrub: SCRUB },
          },
        );
      });

      const preview = q("[data-preview]")[0];
      gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      follow.current = {
        x: gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3" }),
        y: gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3" }),
      };
    },
    { scope: root },
  );

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !follow.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    follow.current.x(e.clientX - r.left);
    follow.current.y(e.clientY - r.top);
  };

  const show = contextSafe((i: number | null) => {
    setActive(i);
    gsap.to("[data-preview]", {
      scale: i === null ? 0 : 1,
      autoAlpha: i === null ? 0 : 1,
      rotate: i === null ? -8 : (i % 2 ? 4 : -4),
      duration: 0.6,
      ease: "expo.out",
    });
    if (i !== null) {
      gsap.to("[data-preview-strip]", { yPercent: -100 * i, duration: 0.8, ease: "expo.inOut" });
    }
  });

  return (
    <section
      ref={root}
      aria-labelledby="services-list-title"
      onPointerMove={onMove}
      onPointerLeave={() => show(null)}
      className="relative overflow-hidden px-4 py-24 md:px-10 md:py-36"
    >
      <div className="mb-14 flex items-end justify-between">
        <h2 id="services-list-title" className="text-micro uppercase tracking-[0.2em] text-accent">
          (01) — Offerings
        </h2>
        <p className="hidden text-micro uppercase tracking-[0.2em] md:block">Hover to unfold</p>
      </div>

      {/* floating preview — one element, image strip slides to the hovered service */}
      <div
        data-preview
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/5] w-[22vw] overflow-hidden bg-mist shadow-[0_40px_80px_-30px_rgba(27,20,70,0.45)] md:block"
      >
        <div data-preview-strip className="h-full w-full">
          {services.map((s) => (
            <div key={s.index} className="relative h-full w-full">
              <Image src={s.image} alt="" fill sizes="22vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <ul className="border-t border-ink/15">
        {services.map((s, i) => {
          const open = active === i;
          const Icon = ICONS[i % ICONS.length];
          return (
            <li
              key={s.index}
              data-row
              onPointerEnter={() => show(i)}
              onFocus={() => show(i)}
              className={`group relative border-b border-ink/15 ${i % 2 ? "md:pl-[12vw]" : ""}`}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`svc-${s.index}`}
                onClick={() => show(open ? null : i)}
                className="flex w-full items-center gap-4 py-8 text-left md:gap-10 md:py-10"
              >
                <Icon strokeWidth={5} start="top 90%" end="top 50%" className={`w-12 shrink-0 md:w-16 ${TONES[i % TONES.length]}`} />
                <span
                  className={`font-display text-huge uppercase leading-[0.9] transition-[color,transform] duration-700 ease-expo ${
                    open ? "translate-x-4 text-accent" : "text-ink"
                  }`}
                >
                  {s.title}
                </span>
              </button>

              <div
                id={`svc-${s.index}`}
                className={`grid transition-[grid-template-rows] duration-700 ease-expo ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-8 pb-10 md:grid-cols-12 md:pl-[4.5rem]">
                    <p className="max-w-lg text-lede md:col-span-5">{s.summary}</p>
                    <ul className="space-y-1 text-ink md:col-span-3 md:col-start-7">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex gap-3">
                          <span aria-hidden className="text-accent">+</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="text-micro uppercase leading-loose tracking-[0.18em] md:col-span-3">{s.stack.join(" / ")}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
