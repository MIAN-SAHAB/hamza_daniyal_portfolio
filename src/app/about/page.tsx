import type { Metadata } from "next";
import Link from "@/components/AppLink";
import PageHero from "@/components/PageHero";
import Collage from "@/components/about/Collage";
import Timeline from "@/components/about/Timeline";
import Parallax from "@/components/motion/Parallax";
import ScrubWords from "@/components/motion/ScrubWords";
import { Bolt, CurvedArrow, Meander, PaperPlane, Signature, Sparkle } from "@/components/draw/art";
import { constructMetadata, developerKeywords } from "@/lib/seo-config";
import { principles, site } from "@/lib/site";

export const metadata: Metadata = constructMetadata({
  title: "About Hamza Daniyal — Hire a Senior Full-Stack Developer & Creative Technologist",
  description:
    "Meet Mian Muhammad Hamza Daniyal: senior full-stack developer & creative technologist shipping since 2018 — Next.js, Laravel, headless Shopify and real-time WebGL. Remote-first, working with teams worldwide.",
  path: "/about",
  type: "profile",
  keywords: [
    ...developerKeywords.core,
    "Hire Senior Full-Stack Developer",
    "Hire Creative Technologist",
    "Remote Next.js Developer",
    "Laravel & PHP Systems Architect",
  ],
});

const FACTS = [
  ["Based in", `${site.location} — working worldwide`],
  ["Practising since", String(site.since)],
  ["Focus", "Creative front end, full-stack platforms, headless commerce"],
  ["Toolbelt", "TypeScript · Next.js · GSAP · R3F · Laravel · Shopify"],
] as const;

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        id="about-title"
        label="About"
        heading="Hamza Daniyal, Senior Full-Stack Developer & Creative Technologist"
        lines={["Code with", "a point", "of view"]}
        accentLine={1}
        tone="violet"
        art={<Signature mode="intro" delay={0.5} duration={2.6} strokeWidth={6} className="w-full" />}
        aside={<span className="text-micro uppercase tracking-[0.2em] text-graphite">The journey since {site.since}</span>}
        intro={
          <p>
            I&rsquo;m <strong className="font-normal text-ink">{site.name}</strong> — a senior full-stack developer and
            creative technologist. Since {site.since} I&rsquo;ve been building the kind of web that feels designed all the
            way down: from database schema to easing curve.
          </p>
        }
      />

      <Collage />

      {/* Philosophy — asymmetric long-form */}
      <section aria-labelledby="philosophy-title" className="relative overflow-hidden bg-paper px-4 py-32 md:px-10 md:py-48">
        <Parallax speed={-30} axis="x" className="pointer-events-none absolute -right-[10vw] top-6 select-none" aria-hidden>
          <span className="text-outline whitespace-nowrap font-display text-[clamp(6rem,20vw,22rem)] uppercase leading-none">
            Philosophy
          </span>
        </Parallax>
        <Meander
          strokeWidth={3}
          start="top 70%"
          end="bottom bottom"
          className="pointer-events-none absolute left-[38%] top-[18%] hidden h-[78%] text-aqua/70 md:block"
        />
        <Bolt strokeWidth={4} className="absolute right-[8vw] top-[30%] hidden w-24 rotate-12 text-accent md:block" />
        <Sparkle strokeWidth={3} className="absolute left-[44%] top-[12%] w-12 text-accent" />

        <div className="relative grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(02) — Engineering Philosophy</p>
            <h2 id="philosophy-title" className="mt-6 font-display text-big uppercase text-ink">
              Fast, honest,
              <br />
              <span className="md:pl-[5vw]">and felt.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-32">
            <ScrubWords
              className="text-statement text-ink"
              text="Every project starts with a question, not a framework. I pick the stack after I understand the problem — then I *sweat the milliseconds* and the micro-interactions with equal care."
            />
          </div>
        </div>

        <ol className="relative mt-24 grid gap-14 md:mt-40 md:grid-cols-12">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className={["md:col-span-4 md:col-start-1", "md:col-span-4 md:col-start-6 md:mt-28", "md:col-span-3 md:col-start-10 md:-mt-10"][i]}
            >
              <Parallax speed={(i + 1) * 5}>
                <p className="font-display text-huge leading-none text-ink/10">0{i + 1}</p>
                <h3 className="-mt-6 font-display text-[clamp(1.5rem,2.4vw,2.25rem)] uppercase leading-none text-ink">{p.title}</h3>
                <p className="mt-3 leading-relaxed">{p.copy}</p>
              </Parallax>
            </li>
          ))}
        </ol>

        <dl className="relative mt-28 grid gap-x-10 gap-y-6 border-t border-ink/10 pt-8 sm:grid-cols-2 md:ml-[25%] md:grid-cols-4">
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt className="text-micro uppercase tracking-[0.2em]">{k}</dt>
              <dd className="mt-2 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Timeline />

      <section aria-labelledby="about-cta" className="relative overflow-hidden px-4 py-32 md:px-10 md:py-44">
        <PaperPlane strokeWidth={3} start="top 90%" end="bottom 60%" className="absolute right-[4vw] top-10 w-[70vw] text-accent/60 md:w-[44vw]" />
        <CurvedArrow strokeWidth={3} className="absolute left-[4vw] top-[58%] hidden w-24 rotate-[-30deg] text-aqua md:block" />
        <h2 id="about-cta" className="relative font-display text-huge uppercase text-ink">
          Next chapter?
          <br />
          <Link href="/contact" className="group inline-flex items-center gap-4 text-accent md:ml-[18vw]">
            <span className="link-underline">Let&rsquo;s write it</span>
            <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-3">→</span>
          </Link>
        </h2>
      </section>
    </main>
  );
}
