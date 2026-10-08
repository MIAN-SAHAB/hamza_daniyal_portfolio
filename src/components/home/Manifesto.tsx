import Image from "next/image";
import Parallax from "@/components/motion/Parallax";
import ScrubWords from "@/components/motion/ScrubWords";
import ClipReveal from "@/components/motion/ClipReveal";
import RotatingBadge from "@/components/motion/RotatingBadge";
import { images, principles } from "@/lib/site";

export default function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="relative overflow-hidden px-4 pb-32 pt-36 md:px-10 md:pb-48 md:pt-56">
      {/* ambient watermark */}
      <Parallax speed={-40} axis="x" className="pointer-events-none absolute left-0 top-10 select-none whitespace-nowrap" aria-hidden>
        <span className="text-outline font-display text-[clamp(6rem,22vw,24rem)] uppercase leading-none">Manifesto — Manifesto</span>
      </Parallax>

      <div className="relative grid gap-y-10 md:grid-cols-12">
        <p className="text-micro uppercase tracking-[0.2em] text-vermilion md:col-span-2 md:pt-4">(01) — Philosophy</p>

        <h2 id="manifesto-title" className="sr-only">
          Engineering philosophy
        </h2>
        <ScrubWords
          className="font-display text-big uppercase text-ink md:col-span-9 md:col-start-3"
          text="I don't decorate websites. I engineer *interfaces that feel inevitable* — where structure, motion and performance are designed as one decision, not three."
        />
      </div>

      {/* floating callouts */}
      <Parallax speed={30} className="absolute right-[6vw] top-[18%] hidden md:block" aria-hidden>
        <RotatingBadge text="Engineering since 2018 · Engineering since 2018 · " center="08" />
      </Parallax>
      <Parallax speed={45} rotate={10} className="absolute left-[4vw] top-[58%] z-10 md:left-[46vw] md:top-[52%]" aria-hidden>
        <span className="inline-block -rotate-3 rounded-full border border-ink/15 bg-white px-4 py-2 text-[0.75rem] uppercase tracking-[0.14em] text-ink shadow-[0_18px_40px_-20px_rgba(17,17,20,0.4)]">
          <span className="text-cobalt">●</span> WebGL · R3F · GLSL
        </span>
      </Parallax>

      {/* offset image + staggered principles */}
      <div className="relative mt-24 grid gap-16 md:mt-40 md:grid-cols-12">
        <div className="relative md:col-span-4 md:col-start-2 md:-mb-24">
          <ClipReveal className="aspect-[3/4] w-[78%] bg-mist md:w-full">
            <Image
              src={images.workspace}
              alt="Minimal desk with a laptop showing code beside a window"
              fill
              sizes="(min-width: 768px) 30vw, 78vw"
              className="object-cover"
            />
          </ClipReveal>
          <Parallax speed={35} className="absolute -right-2 bottom-[12%] md:-right-16" aria-hidden>
            <span className="inline-block rotate-6 bg-vermilion px-3 py-1.5 text-micro uppercase tracking-[0.18em] text-white">
              Perf budget: green
            </span>
          </Parallax>
        </div>

        <ol className="space-y-14 md:col-span-5 md:col-start-8 md:pt-40">
          {principles.map((p, i) => (
            <li key={p.title} className={i === 1 ? "md:-ml-24" : i === 2 ? "md:ml-12" : ""}>
              <Parallax speed={(i + 1) * 6}>
                <p className="mb-3 text-micro uppercase tracking-[0.2em] text-graphite">0{i + 1}</p>
                <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.5rem)] uppercase leading-none text-ink">{p.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed">{p.copy}</p>
              </Parallax>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
