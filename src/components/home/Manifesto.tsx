import Image from "next/image";
import Parallax from "@/components/motion/Parallax";
import ScrubWords from "@/components/motion/ScrubWords";
import ClipReveal from "@/components/motion/ClipReveal";
import RotatingBadge from "@/components/motion/RotatingBadge";
import { Bolt, BrowserWindow, CurvedArrow, Sparkle, Squiggle } from "@/components/draw/art";
import { images, principles } from "@/lib/site";

const ICONS = [Bolt, BrowserWindow, Sparkle];
const ICON_TONE = ["text-accent", "text-aqua", "text-pink"];

export default function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="relative overflow-hidden px-4 pb-32 pt-28 md:px-10 md:pb-48 md:pt-40">
      {/* the line that hands you over from the hero */}
      <Squiggle strokeWidth={5} start="top 95%" end="top 25%" className="absolute inset-x-0 top-0 w-full text-accent" />

      <Parallax speed={-40} axis="x" className="pointer-events-none absolute left-0 top-24 select-none whitespace-nowrap" aria-hidden>
        <span className="text-outline font-display text-[clamp(6rem,22vw,24rem)] uppercase leading-none">Manifesto — Manifesto</span>
      </Parallax>

      <div className="relative mt-24 grid gap-y-10 md:mt-32 md:grid-cols-12">
        <p className="md:col-span-2 md:pt-4">
          <span className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">01 — Philosophy</span>
        </p>

        <h2 id="manifesto-title" className="sr-only">
          Engineering philosophy
        </h2>
        <ScrubWords
          className="font-display text-big uppercase text-ink md:col-span-9 md:col-start-3"
          text="I don't decorate websites. I engineer *interfaces that feel inevitable* — where structure, motion and performance are designed as one decision, not three."
        />
      </div>

      <Parallax speed={30} className="absolute right-[6vw] top-[16%] hidden md:block" aria-hidden>
        <RotatingBadge text="Engineering since 2018 · Engineering since 2018 · " center="08" />
      </Parallax>

      <div className="relative mt-24 grid gap-16 md:mt-40 md:grid-cols-12">
        <div className="relative md:col-span-4 md:col-start-2 md:-mb-24">
          <Parallax speed={8} aria-hidden className="absolute inset-0 translate-x-5 translate-y-5 rotate-3">
            <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-accent to-aqua" />
          </Parallax>
          <ClipReveal className="relative aspect-[3/4] w-full rounded-[2rem] bg-mist">
            <Image
              src={images.workspace}
              alt="Minimal desk with a laptop showing code beside a window"
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
              className="object-cover"
            />
          </ClipReveal>
          <Parallax speed={35} className="absolute -right-2 bottom-[12%] md:-right-16" aria-hidden>
            <span className="inline-block rotate-6 rounded-full bg-lime px-4 py-2 text-micro uppercase tracking-[0.18em] text-ink shadow-[0_18px_40px_-16px_rgba(27,20,70,0.4)]">
              Perf budget: green ✓
            </span>
          </Parallax>
          <CurvedArrow strokeWidth={3} className="absolute -right-24 top-6 hidden w-24 rotate-[200deg] text-accent md:block" />
        </div>

        <ol className="space-y-16 md:col-span-5 md:col-start-8 md:pt-32">
          {principles.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <li key={p.title} className={i === 1 ? "md:-ml-24" : i === 2 ? "md:ml-12" : ""}>
                <Parallax speed={(i + 1) * 6} className="flex gap-6">
                  <Icon strokeWidth={4} className={`mt-1 w-14 shrink-0 ${ICON_TONE[i]}`} />
                  <div>
                    <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.5rem)] uppercase leading-none text-ink">{p.title}</h3>
                    <p className="mt-3 max-w-sm leading-relaxed">{p.copy}</p>
                  </div>
                </Parallax>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
