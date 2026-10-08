import Link from "next/link";
import { nav, site } from "@/lib/site";
import LocalTime, { CurrentYear } from "./LocalTime";
import CopyEmail from "./CopyEmail";
import Parallax from "./motion/Parallax";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-paper pt-28 text-graphite md:pt-40" aria-labelledby="footer-title">
      {/* undulating top edge */}
      <svg
        aria-hidden
        className="absolute inset-x-0 top-0 h-16 w-full text-bone md:h-24"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
      >
        <path d="M0 0H1440V40C1180 96 980 8 720 44C460 80 260 18 0 64Z" fill="currentColor" />
      </svg>

      <div className="relative px-4 md:px-10">
        <h2 id="footer-title" className="sr-only">
          Contact and site links
        </h2>

        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-1">
            <p className="text-micro uppercase tracking-[0.2em] text-vermilion">Have a project in mind?</p>
            <p className="mt-5 max-w-md font-display text-big uppercase text-ink">Let&rsquo;s make it inevitable.</p>
            <div className="mt-8">
              <CopyEmail className="text-lede text-ink" />
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-8 md:pt-16">
            <p className="mb-4 text-micro uppercase tracking-[0.2em]">Index</p>
            <ul className="space-y-2 text-ink">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 md:pt-28">
            <p className="mb-4 text-micro uppercase tracking-[0.2em]">Elsewhere</p>
            <ul className="space-y-2 text-ink">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {s.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-end justify-between gap-4 border-t border-ink/10 pt-6 text-micro uppercase tracking-[0.18em]">
          <span>
            © <CurrentYear /> {site.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-vermilion text-vermilion" />
            <LocalTime withSeconds /> · {site.location}
          </span>
          <span>Designed &amp; engineered in-house</span>
        </div>
      </div>

      {/* oversized wordmark bleeding off the page edge */}
      <Parallax speed={-10} className="pointer-events-none mt-6 select-none" aria-hidden>
        <p className="-mb-[0.18em] -ml-[0.04em] whitespace-nowrap font-display text-[11.3vw] uppercase leading-[0.8] text-ink">
          Hamza<span className="text-vermilion">.</span>Daniyal
        </p>
      </Parallax>
    </footer>
  );
}
