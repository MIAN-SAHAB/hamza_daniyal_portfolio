"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";

type Props = {
  /** Plain text; wrap a phrase in *asterisks* to set it in the accent colour. */
  text: string;
  as?: ElementType;
  className?: string;
  start?: string;
  end?: string;
  id?: string;
};

/**
 * Statement typography that "reads itself" as you scroll: each word scrubs
 * from a ghosted state to full ink. Words are split in JSX (not at runtime) so
 * server and client markup are identical.
 */
export default function ScrubWords({ text, as: Tag = "p", className = "", start = "top 85%", end = "bottom 45%", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-w]",
        { opacity: 0.14, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start, end, scrub: SCRUB },
        },
      );
    },
    { scope: ref },
  );

  const nodes: ReactNode[] = [];
  let accent = false;
  text.split(" ").forEach((raw, i) => {
    const opens = raw.startsWith("*");
    const closes = raw.endsWith("*");
    if (opens) accent = true;
    const word = raw.replace(/\*/g, "");
    nodes.push(
      <span key={i} data-w className={`inline-block will-change-transform ${accent ? "text-accent italic" : ""}`}>
        {word}
      </span>,
      " ",
    );
    if (closes) accent = false;
  });

  return (
    <Tag ref={ref} id={id} className={className}>
      {nodes}
    </Tag>
  );
}
