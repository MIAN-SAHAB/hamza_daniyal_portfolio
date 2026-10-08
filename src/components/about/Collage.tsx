import Image from "next/image";
import Parallax from "@/components/motion/Parallax";
import ClipReveal from "@/components/motion/ClipReveal";
import ScrubWords from "@/components/motion/ScrubWords";
import { images } from "@/lib/site";

// Each frame drifts at its own rate — the collage re-composes itself as you scroll.
const FRAMES = [
  { src: images.laptopCode, alt: "Laptop on a white desk displaying source code", cls: "left-[2%] top-[2%] w-[44%] md:w-[24%] aspect-[4/5]", speed: 10, cap: "Fig. 02 — Workbench" },
  { src: images.sketch, alt: "Hand sketching interface wireframes on paper", cls: "right-[4%] top-[8%] w-[40%] md:right-[10%] md:w-[20%] aspect-[3/4]", speed: 26, cap: "Fig. 03 — Wireframes first" },
  { src: images.architecture, alt: "White angular architecture against the sky", cls: "left-[30%] top-[40%] w-[46%] md:left-[34%] md:top-[30%] md:w-[30%] aspect-[16/11]", speed: -8, cap: "Fig. 04 — Structure" },
  { src: images.codeClose, alt: "Close-up of colourful code on a dark monitor", cls: "left-[4%] top-[70%] w-[36%] md:left-[8%] md:top-[60%] md:w-[18%] aspect-square", speed: 34, cap: "Fig. 05 — Detail" },
  { src: images.desk, alt: "Minimal desk with a monitor, plant and calendar", cls: "right-[2%] top-[66%] w-[48%] md:right-[6%] md:top-[58%] md:w-[26%] aspect-[4/3]", speed: 16, cap: "Fig. 06 — Quiet hours" },
];

export default function Collage() {
  return (
    <section aria-labelledby="collage-title" className="relative h-[180vh] overflow-hidden md:h-[200vh]">
      <h2 id="collage-title" className="sr-only">
        Studio collage
      </h2>
      {FRAMES.map((f) => (
        <Parallax key={f.src} speed={f.speed} className={`absolute ${f.cls}`}>
          <ClipReveal className="h-full w-full bg-mist" from="bottom">
            <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 30vw, 50vw" className="object-cover" />
          </ClipReveal>
          <p className="absolute -bottom-6 left-0 whitespace-nowrap text-micro uppercase tracking-[0.18em]">{f.cap}</p>
        </Parallax>
      ))}

      <div className="pointer-events-none absolute inset-x-4 top-[36%] z-10 md:inset-x-[12vw] md:top-[44%]">
        <ScrubWords
          className="font-display text-statement uppercase text-ink mix-blend-multiply"
          text="Since 2018 I've treated the browser as a *medium,* not a destination — somewhere ideas can move, respond and earn attention."
        />
      </div>
    </section>
  );
}
