import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Works from "@/components/home/Works";
import TechUniverse from "@/components/home/TechUniverse";
import Impact from "@/components/home/Impact";
import CtaBand from "@/components/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.role,
    description: site.tagline,
    path: "/",
  }),
  title: { absolute: `${site.name} — ${site.role}` },
};

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
