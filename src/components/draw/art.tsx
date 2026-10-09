import DrawSVG from "./DrawSVG";
import type { ComponentProps } from "react";

/*
 * Hand-authored line illustrations. Each is a thin wrapper over <DrawSVG>, so
 * they stroke themselves in on scroll by default (pass mode="intro" to draw on
 * mount). Colour comes from `currentColor` — set it with a text-* class.
 */

type ArtProps = Omit<ComponentProps<typeof DrawSVG>, "children" | "viewBox">;

/** Long wave — section connective tissue. */
export function Squiggle(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 1200 140" {...props}>
      <path d="M0 80 C 90 10, 170 140, 260 76 S 420 6, 500 70 C 560 118, 640 120, 660 74 C 680 30, 610 20, 600 60 C 590 104, 700 130, 790 82 S 960 8, 1040 68 S 1160 120, 1200 60" />
    </DrawSVG>
  );
}

/** Loose hand-drawn loop for circling a word. */
export function ScribbleCircle(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 400 160" {...props}>
      <path d="M214 20 C 120 8, 34 30, 22 80 C 10 132, 140 152, 246 144 C 346 136, 396 104, 386 64 C 376 22, 286 6, 186 14 C 146 17, 116 24, 96 34" />
    </DrawSVG>
  );
}

/** Swooping arrow, points down-right. */
export function CurvedArrow(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 200 200" {...props}>
      <path d="M18 24 C 40 120, 96 176, 176 150" />
      <path d="M146 128 L178 150 L150 178" />
    </DrawSVG>
  );
}

/** Brush-like underline. */
export function Underline(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 300 30" {...props}>
      <path d="M4 20 C 60 4, 120 28, 180 14 S 270 6, 296 18" />
    </DrawSVG>
  );
}

/** Four-point sparkle. */
export function Sparkle(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 100 100" {...props}>
      <path d="M50 6 C 54 40, 60 46, 94 50 C 60 54, 54 60, 50 94 C 46 60, 40 54, 6 50 C 40 46, 46 40, 50 6 Z" />
    </DrawSVG>
  );
}

/** Isometric wireframe cube with an orbit — real-time 3D. */
export function WireCube(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 240 260" {...props}>
      <path d="M120 20 L210 70 L210 180 L120 230 L30 180 L30 70 Z" />
      <path d="M30 70 L120 120 L210 70" />
      <path d="M120 120 L120 230" />
      <path d="M30 180 L120 130 L210 180" opacity="0.45" />
      <ellipse cx="120" cy="130" rx="118" ry="38" transform="rotate(-18 120 130)" />
      <circle data-fill cx="225" cy="96" r="7" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}

/** Browser window with layout blocks and a rising chart — web platforms. */
export function BrowserWindow(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 320 220" {...props}>
      <path d="M16 8 H304 Q314 8 314 18 V202 Q314 212 304 212 H16 Q6 212 6 202 V18 Q6 8 16 8 Z" />
      <path d="M6 40 H314" />
      <circle cx="24" cy="24" r="5" />
      <circle cx="40" cy="24" r="5" />
      <circle cx="56" cy="24" r="5" />
      <path d="M30 68 H170" />
      <path d="M30 88 H136" />
      <path d="M30 112 H150 V184 H30 Z" />
      <path d="M180 68 H292 V184 H180 Z" />
      <path d="M192 166 L216 134 L240 150 L264 104 L284 118" />
      <circle data-fill cx="264" cy="104" r="5" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}

/** </> brackets. */
export function CodeBrackets(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 260 160" {...props}>
      <path d="M82 28 L30 80 L82 132" />
      <path d="M178 28 L230 80 L178 132" />
      <path d="M152 18 L108 142" />
    </DrawSVG>
  );
}

/** Shopping cart — headless commerce. */
export function Cart(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 220 170" {...props}>
      <path d="M10 18 H42 L68 110 H176 L200 44 H52" />
      <path d="M78 80 H186" />
      <circle cx="84" cy="138" r="13" />
      <circle cx="160" cy="138" r="13" />
    </DrawSVG>
  );
}

/** Plug — plugin engineering. */
export function Plug(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 220 230" {...props}>
      <path d="M78 14 V58" />
      <path d="M122 14 V58" />
      <path d="M56 58 H144 V98 C 144 130 124 150 100 150 C 76 150 56 130 56 98 Z" />
      <path d="M100 150 V176 C 100 210 150 214 170 192 C 186 174 206 180 212 196" />
    </DrawSVG>
  );
}

/** Paper plane with a looping flight trail. */
export function PaperPlane(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 600 300" {...props}>
      <path d="M12 270 C 120 262, 168 170, 246 176 C 326 182, 306 262, 236 246 C 166 230, 262 96, 384 92 C 452 90, 486 72, 520 54" />
      <path d="M520 54 L592 18 L560 96 L540 66 Z" />
      <path d="M540 66 L592 18" />
    </DrawSVG>
  );
}

/** Envelope. */
export function Envelope(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 300 210" {...props}>
      <path d="M20 30 H280 V190 H20 Z" />
      <path d="M20 30 L150 124 L280 30" />
      <path d="M20 190 L118 104" />
      <path d="M280 190 L182 104" />
    </DrawSVG>
  );
}

/** Lightning bolt — performance. */
export function Bolt(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 200 230" {...props}>
      <path d="M122 10 L46 128 H108 L86 220 L170 90 H108 Z" />
    </DrawSVG>
  );
}

/** Atom-style orbits around a core. */
export function Orbits(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 260 260" {...props}>
      <ellipse cx="130" cy="130" rx="120" ry="44" />
      <ellipse cx="130" cy="130" rx="120" ry="44" transform="rotate(60 130 130)" />
      <ellipse cx="130" cy="130" rx="120" ry="44" transform="rotate(120 130 130)" />
      <circle data-fill cx="130" cy="130" r="14" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}

/** Flowing signature-style scribble. */
export function Signature(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 420 170" {...props}>
      <path d="M24 140 C 44 92, 58 50, 70 22 C 66 70, 56 110, 50 150" />
      <path d="M38 92 C 70 82, 96 84, 124 86" />
      <path d="M140 24 C 128 76, 120 116, 114 150 C 140 112, 166 100, 190 104 C 222 112, 222 146, 190 148 C 166 150, 166 126, 194 120 C 246 108, 292 78, 340 86 C 380 92, 396 120, 360 130 C 330 138, 338 104, 404 96" />
    </DrawSVG>
  );
}

/** Small looping flourish (the curl on the menu card). */
export function ScribbleLoop(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 120 130" {...props}>
      <path d="M8 18 C 40 30, 80 20, 102 40 C 124 62, 96 92, 70 74 C 48 58, 78 30, 100 58 C 116 80, 96 114, 60 122" />
    </DrawSVG>
  );
}

/** Game controller. */
export function Gamepad(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 320 210" {...props}>
      <path d="M92 40 H228 C 268 40, 296 70, 304 120 C 312 168, 296 196, 270 196 C 248 196, 236 176, 222 158 H98 C 84 176, 72 196, 50 196 C 24 196, 8 168, 16 120 C 24 70, 52 40, 92 40 Z" />
      <path d="M76 92 V136" />
      <path d="M54 114 H98" />
      <circle cx="232" cy="96" r="9" />
      <circle cx="256" cy="120" r="9" />
      <circle cx="208" cy="120" r="9" />
      <circle cx="232" cy="144" r="9" />
      <path d="M140 108 H180" />
      <path d="M112 40 C 116 22, 130 14, 160 14 C 190 14, 204 22, 208 40" />
      <circle data-fill cx="232" cy="96" r="5" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}

/** Sniper-style crosshair. */
export function Crosshair(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 240 240" {...props}>
      <circle cx="120" cy="120" r="100" />
      <circle cx="120" cy="120" r="58" />
      <path d="M120 4 V80" />
      <path d="M120 160 V236" />
      <path d="M4 120 H80" />
      <path d="M160 120 H236" />
      <circle data-fill cx="120" cy="120" r="6" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}

/** Trophy. */
export function Trophy(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 220 240" {...props}>
      <path d="M60 20 H160 V80 C 160 118, 138 142, 110 142 C 82 142, 60 118, 60 80 Z" />
      <path d="M60 40 H22 C 22 86, 40 104, 66 106" />
      <path d="M160 40 H198 C 198 86, 180 104, 154 106" />
      <path d="M110 142 V184" />
      <path d="M70 222 H150 L140 184 H80 Z" />
      <path d="M98 66 L110 54 V108" />
    </DrawSVG>
  );
}

/** Headset with mic — streams & squads. */
export function Headset(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 240 240" {...props}>
      <path d="M40 140 V118 C 40 70, 76 32, 120 32 C 164 32, 200 70, 200 118 V140" />
      <path d="M30 136 H62 V196 H44 C 36 196, 30 190, 30 182 Z" />
      <path d="M210 136 H178 V196 H196 C 204 196, 210 190, 210 182 Z" />
      <path d="M62 186 C 70 214, 98 222, 128 220" />
      <circle cx="136" cy="220" r="8" />
    </DrawSVG>
  );
}

/** Arcade joystick. */
export function Joystick(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 220 240" {...props}>
      <path d="M20 170 H200 V214 C 200 222, 194 228, 186 228 H34 C 26 228, 20 222, 20 214 Z" />
      <path d="M110 170 V96" />
      <circle cx="110" cy="66" r="32" />
      <path d="M44 150 H86 V170" />
      <circle cx="166" cy="198" r="10" />
      <circle cx="136" cy="198" r="10" />
    </DrawSVG>
  );
}

/** Meandering vertical guide line for long sections. */
export function Meander(props: ArtProps) {
  return (
    <DrawSVG viewBox="0 0 300 1600" {...props}>
      <path d="M150 0 C 260 120, 40 220, 150 340 C 250 450, 280 520, 180 600 C 80 680, 40 760, 120 840 C 220 940, 280 1000, 200 1100 C 120 1200, 20 1240, 90 1340 C 150 1430, 260 1460, 150 1600" />
      <circle cx="180" cy="600" r="16" />
      <circle cx="90" cy="1340" r="16" />
      <circle data-fill cx="150" cy="340" r="9" fill="currentColor" stroke="none" />
      <circle data-fill cx="200" cy="1100" r="9" fill="currentColor" stroke="none" />
    </DrawSVG>
  );
}
