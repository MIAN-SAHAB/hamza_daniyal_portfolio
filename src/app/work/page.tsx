import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectsList from "@/components/work/ProjectsList";
import CtaBand from "@/components/CtaBand";
import { BrowserWindow } from "@/components/draw/art";
import { pageMetadata } from "@/lib/seo";
import { projects } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected work by Hamza Daniyal — TouchPoint, Beba Yerba headless commerce, real-time 3D product configurators, Haprow and GoPhygital.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <main id="main">
      <PageHero
        id="work-title"
        label="Work"
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
