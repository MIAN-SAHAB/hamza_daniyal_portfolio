import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Works from "@/components/home/Works";
import TechUniverse from "@/components/home/TechUniverse";
import Impact from "@/components/home/Impact";
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
      <Works />
      <TechUniverse />
      <Impact />
    </main>
  );
}
