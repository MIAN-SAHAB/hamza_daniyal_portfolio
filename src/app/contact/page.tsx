import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import Availability from "@/components/contact/Availability";
import CopyEmail from "@/components/CopyEmail";
import Parallax from "@/components/motion/Parallax";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Hamza Daniyal — senior full-stack developer & creative technologist based in Pakistan (PKT / UTC+5). Creative web, WebGL, Next.js, Laravel and headless commerce.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        id="contact-title"
        label="(Contact) — Say hello"
        lines={["Let's make", "it inevitable"]}
        aside={
          <p className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.75rem] uppercase tracking-[0.14em] text-ink shadow-[0_18px_40px_-18px_rgba(17,17,20,0.35)]">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-vermilion text-vermilion" />
            Available for select projects
          </p>
        }
        intro={<p>Tell me what you&rsquo;re building. The best briefs are short, honest about constraints and a little ambitious.</p>}
      />

      <section aria-labelledby="brief-title" className="relative px-4 pb-32 pt-10 md:px-10 md:pb-48">
        <div className="grid gap-20 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="brief-title" className="mb-12 text-micro uppercase tracking-[0.2em] text-vermilion">
              (01) — The brief
            </h2>
            <ContactForm />
          </div>

          <aside aria-label="Direct contact" className="space-y-16 md:col-span-4 md:col-start-9 md:pt-24">
            <div>
              <p className="mb-3 text-micro uppercase tracking-[0.2em]">Prefer email?</p>
              <CopyEmail className="text-lede text-ink" />
            </div>

            <Availability />

            <nav aria-label="Social channels">
              <p className="mb-4 text-micro uppercase tracking-[0.2em]">Channels</p>
              <ul className="border-t border-ink/15">
                {site.socials.map((s) => (
                  <li key={s.label} className="border-b border-ink/15">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Open"
                      className="group flex items-baseline justify-between py-4 text-ink"
                    >
                      <span className="font-display text-[clamp(1.25rem,1.8vw,1.75rem)] uppercase transition-transform duration-500 ease-expo group-hover:translate-x-2">
                        {s.label}
                      </span>
                      <span className="text-sm text-graphite transition-colors group-hover:text-vermilion">
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
