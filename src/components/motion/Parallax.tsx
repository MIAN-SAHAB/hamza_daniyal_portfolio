"use client";

import { useRef, type HTMLAttributes } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Total travel across its time on screen, in vh (y) or vw (x). Negative = against scroll. */
  speed?: number;
  axis?: "x" | "y";
  rotate?: number;
};

/** Scroll-scrubbed drift for floating editorial elements. */
export default function Parallax({ speed = 20, axis = "y", rotate = 0, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const travel = () => ((axis === "y" ? window.innerHeight : window.innerWidth) * speed) / 200;
      gsap.fromTo(
        ref.current,
        { [axis]: () => -travel(), rotate: -rotate / 2 },
        {
          [axis]: () => travel(),
          rotate: rotate / 2,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
