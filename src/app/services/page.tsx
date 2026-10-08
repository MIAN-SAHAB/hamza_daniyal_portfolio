import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ServicesList from "@/components/services/ServicesList";
import Process from "@/components/services/Process";
import Parallax from "@/components/motion/Parallax";
import ScrubWords from "@/components/motion/ScrubWords";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Creative web & 3D, full-stack Next.js and Laravel platforms, headless Shopify commerce and custom WordPress engineering — by senior full-stack developer Hamza Daniyal.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        id="services-title"
        label="(Services) — Creative Engineering"
        lines={["Built to", "be felt,", "made to last"]}
        aside={
          <p className="max-w-[12rem] text-right text-micro uppercase leading-relaxed tracking-[0.18em]">
            Taking on a small number of engagements each quarter
          </p>
        }
        intro={
          <p>
            I partner with brands, studios and product teams that care about the details — designing the system, writing the
            code and tuning the motion myself, so nothing gets lost in hand-off.
          </p>
        }
      />

      <ServicesList />

      <section aria-label="Approach" className="relative overflow-hidden px-4 py-24 md:px-10 md:py-40">
        <Parallax speed={-36} axis="x" className="pointer-events-none absolute left-0 top-0 select-none" aria-hidden>
          <span className="text-outline whitespace-nowrap font-display text-[clamp(6rem,20vw,22rem)] uppercase leading-none">
            Approach · Approach
          </span>
        </Parallax>
        <ScrubWords
          className="relative font-display text-big uppercase text-ink md:ml-[16vw] md:max-w-[70vw]"
          text="One engineer from *first sketch to final deploy* — fewer meetings, sharper decisions, faster sites."
        />
      </section>

      <Process />

      <section aria-labelledby="services-cta" className="relative px-4 py-32 md:px-10 md:py-44">
        <p className="text-micro uppercase tracking-[0.2em] text-vermilion">(03) — Next step</p>
        <h2 id="services-cta" className="mt-6 font-display text-huge uppercase text-ink">
          Have a brief?
          <br />
          <Link href="/contact" data-cursor="Brief me" className="group inline-flex items-center gap-4 text-vermilion md:ml-[22vw]">
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
