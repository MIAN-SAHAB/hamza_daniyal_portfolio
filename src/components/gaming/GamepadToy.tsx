"use client";

import { useRef, useState } from "react";
import { gsap, SCRUB, useGSAP } from "@/lib/gsap";

const BUTTONS = [
  { id: "Y", cx: 232, cy: 92, fill: "#C8F542" },
  { id: "B", cx: 258, cy: 118, fill: "#FF4FA3" },
  { id: "X", cx: 206, cy: 118, fill: "#00B8F0" },
  { id: "A", cx: 232, cy: 144, fill: "#7A3CFF" },
] as const;

const STICK = { cx: 92, cy: 112, r: 16 };

/**
 * Playable gamepad doodle. The outline strokes in on scroll; the left stick
 * tracks the pointer (or arrow keys / WASD when focused) and the face buttons
 * light up and build a combo when pressed.
 */
export default function GamepadToy({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const [combo, setCombo] = useState(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGSAP(
    () => {
      const strokes = gsap.utils.toArray<SVGGeometryElement>("[data-stroke]", root.current);
      strokes.forEach((el) => {
        const len = Math.ceil(el.getTotalLength()) + 2;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 45%", scrub: SCRUB } })
        .to(strokes, { strokeDashoffset: 0, ease: "none", stagger: 0.1 })
        .from("[data-btn]", { scale: 0, transformOrigin: "50% 50%", stagger: 0.05, ease: "back.out(3)" }, ">-0.2");

      // Idle wiggle so it reads as interactive.
      gsap.to("[data-body]", { rotate: 2, transformOrigin: "50% 50%", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: root },
  );

  // Interaction handlers — short-lived tweens fired from events, no context needed.
  const moveStick = (dx: number, dy: number) => {
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, len) * STICK.r * 0.75;
    const thumb = root.current?.querySelector("[data-thumb]");
    if (thumb) gsap.to(thumb, { x: (dx / len) * k, y: (dy / len) * k, duration: 0.25, ease: "power3.out", overwrite: true });
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = root.current!;
    const r = svg.getBoundingClientRect();
    const sx = r.left + (STICK.cx / 320) * r.width;
    const sy = r.top + (STICK.cy / 210) * r.height;
    moveStick((e.clientX - sx) / (r.width * 0.25), (e.clientY - sy) / (r.height * 0.4));
  };

  const press = (id: string) => {
    const svg = root.current;
    if (!svg) return;
    gsap.fromTo(
      svg.querySelector(`[data-btn="${id}"]`),
      { scale: 0.75 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1.2,0.4)", transformOrigin: "50% 50%" },
    );
    gsap.fromTo(
      svg.querySelector(`[data-ring="${id}"]`),
      { scale: 1, autoAlpha: 0.9, transformOrigin: "50% 50%" },
      { scale: 2.4, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
    );
    setCombo((c) => c + 1);
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 1400);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const dirs: Record<string, [number, number]> = {
      arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
    };
    if (dirs[k]) {
      e.preventDefault();
      moveStick(...dirs[k]);
    } else if (["j", "k", "l", "i", " ", "enter"].includes(k)) {
      e.preventDefault();
      press({ j: "X", k: "A", l: "B", i: "Y", " ": "A", enter: "A" }[k]!);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={root}
        viewBox="0 0 320 210"
        tabIndex={0}
        role="application"
        aria-label="Playable gamepad: move your pointer or use arrow keys to steer, press the buttons or J K L I to fire"
        onPointerMove={onPointerMove}
        onPointerLeave={() => moveStick(0, 0)}
        onKeyUp={() => moveStick(0, 0)}
        onKeyDown={onKeyDown}
        className="w-full cursor-crosshair overflow-visible rounded-3xl outline-offset-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g data-body>
          <path
            data-stroke
            d="M92 40 H228 C 268 40, 296 70, 304 120 C 312 168, 296 196, 270 196 C 248 196, 236 176, 222 158 H98 C 84 176, 72 196, 50 196 C 24 196, 8 168, 16 120 C 24 70, 52 40, 92 40 Z"
          />
          <path data-stroke d="M112 40 C 116 22, 130 14, 160 14 C 190 14, 204 22, 208 40" />
          <path data-stroke d="M146 112 H174" strokeWidth={4} />

          {/* left stick */}
          <circle data-stroke cx={STICK.cx} cy={STICK.cy} r={STICK.r + 10} strokeWidth={3} opacity={0.6} />
          <g data-thumb>
            <circle cx={STICK.cx} cy={STICK.cy} r={STICK.r} fill="currentColor" fillOpacity={0.15} strokeWidth={4} />
          </g>

          {/* face buttons */}
          {BUTTONS.map((b) => (
            <g key={b.id}>
              <circle data-ring={b.id} cx={b.cx} cy={b.cy} r={11} stroke={b.fill} strokeWidth={3} opacity={0} />
              <g
                data-btn={b.id}
                onPointerDown={(e) => {
                  e.preventDefault();
                  press(b.id);
                }}
                className="cursor-pointer"
              >
                <circle cx={b.cx} cy={b.cy} r={11} fill={b.fill} stroke="none" />
                <text x={b.cx} y={b.cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1B1446" stroke="none">
                  {b.id}
                </text>
              </g>
            </g>
          ))}
        </g>
      </svg>

      <p
        aria-live="polite"
        className={`pointer-events-none absolute -top-6 right-2 rounded-full bg-ink px-3 py-1 font-display text-sm uppercase text-lime transition-all duration-300 ${
          combo > 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        Combo ×{combo}
      </p>
      <p className="mt-2 text-center text-[0.6875rem] uppercase tracking-[0.18em] opacity-70">Hover · tap the buttons</p>
    </div>
  );
}
