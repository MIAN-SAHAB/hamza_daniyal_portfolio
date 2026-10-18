import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectsList from "@/components/work/ProjectsList";
import CtaBand from "@/components/CtaBand";
import { BrowserWindow } from "@/components/draw/art";
import { constructMetadata, developerKeywords } from "@/lib/seo-config";
import { projects } from "@/lib/site";

export const metadata: Metadata = constructMetadata({
  title: "Case Studies: Next.js Platforms, 3D WebGL, Laravel & Headless Commerce | Hamza Daniyal",
  description:
    "Explore production platforms engineered from scratch: TouchPoint (Next.js/GSAP), Real-Time 3D WebGL Configurators, Haprow (Laravel & Core Web Vitals), GoPhygital, and Headless Shopify Storefronts.",
  path: "/work",
  keywords: [
    ...developerKeywords.core,
    "Next.js case studies",
    "Three.js 3D configurator case study",
    "Headless Shopify case study",
    "Laravel case study",
    ...projects.map((p) => p.title),
  ],
});

export default function WorkPage() {
  return (
    <main id="main">
      <PageHero
        id="work-title"
        label="Work"
        heading="Case Studies: Next.js Platforms, Real-Time 3D WebGL Configurators, Laravel & Headless Shopify Commerce"
        lines={["Things I've", "shipped", "& obsessed over"]}
        accentLine={1}
        tone="aqua"
        art={<BrowserWindow mode="intro" delay={0.5} duration={2.4} strokeWidth={4} className="w-full" />}
        aside={
          <span className="rounded-full bg-pink px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-white">
            {String(projects.length).padStart(2, "0")} case studies
          </span>
        }
        intro={
          <p>
            Headless commerce, real-time WebGL, corporate platforms and client experiences — each one engineered from a blank
            file, with performance budgets set before the first component.
          </p>
        }
      />

      <ProjectsList />

      <CtaBand
        id="work-cta"
        eyebrow="Your project, next"
        title={
          <>
            Got something
            <br />
            worth obsessing over?
          </>
        }
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/services", label: "See services" }}
      />
    </main>
  );
}
