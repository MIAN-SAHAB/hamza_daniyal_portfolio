"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Custom editorial cursor: a vermilion point plus a lagging ring that expands
 * into a labelled lens over anything marked `data-cursor="Label"` (and links).
 * Only active for fine pointers; touch devices keep native behaviour.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const html = document.documentElement;
      html.classList.add("has-cursor");

      const dot = root.current!.querySelector<HTMLElement>("[data-dot]")!;
      const ring = root.current!.querySelector<HTMLElement>("[data-ring]")!;
      const label = root.current!.querySelector<HTMLElement>("[data-label]")!;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
      const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
      const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

      let shown = false;
      const move = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
          gsap.to(root.current, { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };

      let current: Element | null = null;
      const over = (e: PointerEvent) => {
        const target = (e.target as Element).closest("[data-cursor], a, button, input, textarea, select, label");
        if (target === current) return;
        current = target;
        const text = target?.getAttribute("data-cursor") ?? "";
        const isField = !!target && /INPUT|TEXTAREA|SELECT/.test(target.tagName);
        label.textContent = text;
        gsap.to(ring, {
          width: target ? (text ? 96 : 56) : 34,
          height: target ? (text ? 96 : 56) : 34,
          backgroundColor: text ? "rgba(255,77,45,0.95)" : "rgba(255,77,45,0)",
          borderColor: target ? "rgba(255,77,45,0.9)" : "rgba(17,17,20,0.35)",
          opacity: isField ? 0 : 1,
          duration: 0.45,
          ease: "expo.out",
        });
        gsap.to(dot, { scale: text ? 0 : 1, duration: 0.3 });
        gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 });
      };
      const leave = () => gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: () => void (shown = false) });

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        html.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[110] opacity-0 invisible">
      <div
        data-ring
        className="fixed left-0 top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-ink/35"
      >
        <span
          data-label
          className="invisible text-[0.625rem] font-medium uppercase tracking-[0.16em] text-white opacity-0"
        />
      </div>
      <div data-dot className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-vermilion" />
    </div>
  );
}
