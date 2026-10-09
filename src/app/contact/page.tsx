import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmail from "@/components/CopyEmail";
import Parallax from "@/components/motion/Parallax";
import { pageMetadata } from "@/lib/seo";
import { Envelope, PaperPlane } from "@/components/draw/art";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Hamza Daniyal — senior full-stack developer & creative technologist based in Pakistan, working worldwide. Creative web, WebGL, Next.js, Laravel and headless commerce.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        id="contact-title"
        label="Contact"
        lines={["Let's make", "it happen"]}
        accentLine={1}
        tone="lime"
        art={<Envelope mode="intro" delay={0.5} duration={2} strokeWidth={6} className="w-full text-ink" />}
        aside={
          <p className="flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-ink">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent text-accent" />
            Available for select projects
          </p>
        }
        intro={<p>Tell me what you&rsquo;re building. The best briefs are short, honest about constraints and a little ambitious.</p>}
      />

      <section aria-labelledby="brief-title" className="relative px-4 pb-32 pt-10 md:px-10 md:pb-48">
        <PaperPlane
          strokeWidth={3}
          start="top 75%"
          end="bottom 70%"
          className="pointer-events-none absolute right-[2vw] top-[-6%] hidden w-[38vw] text-accent/50 md:block"
        />
        <div className="grid gap-20 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="brief-title" className="mb-12 text-micro uppercase tracking-[0.2em] text-accent">
              (01) — The brief
            </h2>
            <ContactForm />
          </div>

          <aside aria-label="Direct contact" className="space-y-16 md:col-span-4 md:col-start-9 md:pt-24">
            <div>
              <p className="mb-3 text-micro uppercase tracking-[0.2em]">Prefer email?</p>
              <CopyEmail className="text-lede text-ink" />
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-accent to-aqua p-6 text-white shadow-[0_30px_60px_-30px_rgba(122,60,255,0.7)]">
              <p className="text-micro uppercase tracking-[0.2em] text-white/80">Based in {site.location}</p>
              <p className="mt-3 font-display text-[clamp(1.5rem,2.2vw,2.25rem)] uppercase leading-none">Working worldwide</p>
              <p className="mt-3 text-sm text-white/85">Remote-first, async-friendly — replies within one working day.</p>
            </div>

            <nav aria-label="Social channels">
              <p className="mb-4 text-micro uppercase tracking-[0.2em]">Channels</p>
              <ul className="border-t border-ink/15">
                {site.socials.map((s) => (
                  <li key={s.label} className="border-b border-ink/15">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between py-4 text-ink"
                    >
                      <span className="font-display text-[clamp(1.25rem,1.8vw,1.75rem)] uppercase transition-transform duration-500 ease-expo group-hover:translate-x-2">
                        {s.label}
                      </span>
                      <span className="text-sm text-graphite transition-colors group-hover:text-accent">
                        {s.handle} <span aria-hidden>↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>

        <Parallax speed={20} rotate={-8} className="pointer-events-none absolute -bottom-10 right-[8vw] hidden md:block" aria-hidden>
          <span className="inline-block rotate-6 bg-ink px-3 py-1.5 text-micro uppercase tracking-[0.18em] text-white">
            Response &lt; 24h
          </span>
        </Parallax>
      </section>
    </main>
  );
}
