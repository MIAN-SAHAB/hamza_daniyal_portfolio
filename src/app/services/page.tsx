import type { Metadata } from "next";
import Link from "@/components/AppLink";
import PageHero from "@/components/PageHero";
import ServicesList from "@/components/services/ServicesList";
import Process from "@/components/services/Process";
import Parallax from "@/components/motion/Parallax";
import ScrubWords from "@/components/motion/ScrubWords";
import { allDeveloperKeywords, constructMetadata } from "@/lib/seo-config";
import { BrowserWindow, CurvedArrow, Squiggle, WireCube } from "@/components/draw/art";

export const metadata: Metadata = constructMetadata({
  title: "Full-Stack Next.js, Headless Shopify, Three.js & Laravel Services | Hamza Daniyal",
  description:
    "End-to-end web engineering for brands and studios: Custom Headless Shopify Storefront API builds, Three.js/R3F 3D product configurators, Next.js + Laravel platforms, and bespoke WordPress plugins.",
  path: "/services",
  keywords: allDeveloperKeywords,
});

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        id="services-title"
        label="Services"
        heading="Full-Stack Next.js, Headless Shopify, Three.js 3D & Laravel Development Services"
        lines={["Built to", "be felt,", "made to last"]}
        accentLine={1}
        tone="aqua"
        art={<WireCube mode="intro" delay={0.5} duration={2.4} strokeWidth={4} className="w-full" />}
        aside={<span className="text-micro uppercase tracking-[0.2em] text-graphite">Creative engineering, end to end</span>}
        intro={
          <p>
            I partner with brands, studios and product teams that care about the details — designing the system, writing the
            code and tuning the motion myself, so nothing gets lost in hand-off.
          </p>
        }
      />

      <ServicesList />

      <section aria-label="Approach" className="relative overflow-hidden bg-sky px-4 py-24 md:px-10 md:py-40">
        <Parallax speed={-36} axis="x" className="pointer-events-none absolute left-0 top-0 select-none" aria-hidden>
          <span className="text-outline whitespace-nowrap font-display text-[clamp(6rem,20vw,22rem)] uppercase leading-none">
            Approach · Approach
          </span>
        </Parallax>
        <Squiggle strokeWidth={4} start="top 80%" end="bottom 30%" className="absolute inset-x-0 bottom-6 w-full text-accent/50" />
        <BrowserWindow strokeWidth={2.5} className="absolute right-[4vw] top-[14%] hidden w-[22vw] -rotate-6 text-aqua md:block" />
        <ScrubWords
          className="relative font-display text-big uppercase text-ink md:ml-[16vw] md:max-w-[70vw]"
          text="One engineer from *first sketch to final deploy* — fewer meetings, sharper decisions, faster sites."
        />
      </section>

      <Process />

      <section aria-labelledby="services-cta" className="relative overflow-hidden px-4 py-32 md:px-10 md:py-44">
        <CurvedArrow strokeWidth={3} className="absolute left-[8vw] top-[52%] hidden w-28 rotate-[-20deg] text-aqua md:block" />
        <p className="text-micro uppercase tracking-[0.2em] text-accent">(03) — Next step</p>
        <h2 id="services-cta" className="mt-6 font-display text-huge uppercase text-ink">
          Have a brief?
          <br />
          <Link href="/contact" className="group inline-flex items-center gap-4 text-accent md:ml-[22vw]">
            <span className="link-underline">Send it over</span>
            <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-3">
              →
            </span>
          </Link>
        </h2>
      </section>
    </main>
  );
}
