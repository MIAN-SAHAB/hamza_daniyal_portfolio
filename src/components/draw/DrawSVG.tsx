"use client";

import { useEffect, useRef, type ReactNode, type SVGProps } from "react";
import { gsap, SCRUB, useDeferredGSAP, useGSAP } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";

type Props = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  children: ReactNode;
  /** "scroll" scrubs the drawing to scroll position; "intro" draws once on mount (after the preloader). */
  mode?: "scroll" | "intro";
  start?: string;
  end?: string;
  /** Element whose passage through the viewport drives the scrub (defaults to the SVG itself). */
  trigger?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
};

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

/**
 * Hand-drawn line art that strokes itself in. Every stroked shape inside is
 * measured with getTotalLength() and revealed via stroke-dashoffset; shapes
 * marked `data-fill` fade/scale in once the lines are down.
 */
export default function DrawSVG({
  children,
  mode = "scroll",
  start = "top 85%",
  end = "bottom 35%",
  trigger,
  delay = 0,
  duration = 2.2,
  strokeWidth = 2.5,
  className = "",
  ...rest
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const introDone = useIntroDone();

  // Scroll-scrubbed drawings are off screen at first paint; intro ones must set up immediately.
  const setup = mode === "scroll" ? useDeferredGSAP : useGSAP;
  setup(
    () => {
      const svg = ref.current!;
      const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>(SHAPES)).filter((el) => !el.hasAttribute("data-fill"));
      const fills = svg.querySelectorAll("[data-fill]");

      strokes.forEach((el) => {
        const len = Math.ceil(el.getTotalLength()) + 2;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      // Fills fade rather than scale: any transform on an SVG child forces a layout every frame.
      if (fills.length) gsap.set(fills, { autoAlpha: 0 });

      const t = gsap.timeline(
        mode === "scroll"
          ? {
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: trigger ? document.querySelector(trigger) : svg,
                start,
                end,
                scrub: SCRUB,
              },
            }
          : { paused: true, delay, defaults: { ease: "power2.inOut" } },
      );
      t.to(strokes, {
        strokeDashoffset: 0,
        duration: mode === "scroll" ? 1 : duration,
        stagger: mode === "scroll" ? 0.15 : duration / Math.max(strokes.length * 2.5, 1),
      });
      if (fills.length) {
        t.to(fills, { autoAlpha: 1, duration: mode === "scroll" ? 0.3 : 0.6, ease: "power2.out", stagger: 0.08 }, "-=0.3");
      }
      tl.current = t;
    },
    { scope: ref },
  );

  useEffect(() => {
    if (mode === "intro" && introDone) tl.current?.play();
  }, [mode, introDone]);

  return (
    <svg
      ref={ref}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`overflow-visible ${className}`}
      {...rest}
    >
      {children}
    </svg>
  );
}
