import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Works from "@/components/home/Works";
import TechUniverse from "@/components/home/TechUniverse";
import Impact from "@/components/home/Impact";
import CtaBand from "@/components/CtaBand";
import { allDeveloperKeywords, constructMetadata } from "@/lib/seo-config";

export const metadata: Metadata = constructMetadata({
  title: "Senior Full-Stack Next.js, Headless Shopify & 3D WebGL Developer | Hamza Daniyal",
  description:
    "Hire Mian Muhammad Hamza Daniyal — Senior Full-Stack Developer & Creative Technologist (8+ yrs). Engineering fast Next.js platforms, Headless Shopify storefronts, Three.js 3D configurators, and Laravel systems.",
  path: "/",
  type: "profile",
  keywords: allDeveloperKeywords,
});

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <CtaBand
        id="cta-about"
        tone="lime"
        eyebrow="Like how I think?"
        title={
          <>
            There&rsquo;s more
            <br />
            to the story.
          </>
        }
        primary={{ href: "/about", label: "Read my story" }}
        secondary={{ href: "/contact", label: "Start a project" }}
      />
      <Works />
      <TechUniverse />
      <CtaBand
        id="cta-services"
        eyebrow="Front to back, one engineer"
        title={
          <>
            Need this stack
            <br />
            on your team?
          </>
        }
        primary={{ href: "/contact", label: "Hire me" }}
        secondary={{ href: "/services", label: "Explore services" }}
      />
      <Impact />
    </main>
  );
}
