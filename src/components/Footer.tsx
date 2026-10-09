import Link from "@/components/AppLink";
import { nav, site } from "@/lib/site";
import CurrentYear from "./CurrentYear";
import CopyEmail, { PhoneLink } from "./CopyEmail";
import Parallax from "./motion/Parallax";
import { Sparkle, Squiggle } from "./draw/art";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-ink pt-32 text-white/70 md:pt-44"
      aria-labelledby="footer-title"
    >
      {/* colour glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="blob -left-[10vw] top-[10%] h-[40vw] w-[40vw] bg-accent opacity-60" />
        <span className="blob -right-[12vw] bottom-[-10vw] h-[44vw] w-[44vw] bg-aqua opacity-45" />
      </div>

      {/* undulating top edge */}
      <svg aria-hidden className="absolute inset-x-0 top-0 h-16 w-full text-bone md:h-24" viewBox="0 0 1440 96" preserveAspectRatio="none">
        <path d="M0 0H1440V40C1180 96 980 8 720 44C460 80 260 18 0 64Z" fill="currentColor" />
      </svg>

      <div className="relative px-4 md:px-10">
        <h2 id="footer-title" className="sr-only">
          Contact and site links
        </h2>

        <div className="grid gap-14 md:grid-cols-12">
          <div className="relative md:col-span-5 md:col-start-1">
            <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">
              Have a project in mind?
            </p>
            <p className="mt-6 max-w-md font-display text-big uppercase text-white">
              Let&rsquo;s make it <span className="text-gradient">vivid.</span>
            </p>
            <Squiggle strokeWidth={6} start="top 95%" end="top 55%" className="mt-2 w-64 text-lime" />
            <div className="mt-8">
              <CopyEmail className="text-lede text-white" />
              <p className="mt-3 text-lede text-white/85">
                <PhoneLink />
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-8 md:pt-16">
            <p className="mb-4 text-micro uppercase tracking-[0.2em]">Index</p>
            <ul className="space-y-2 text-white">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative md:col-span-3 md:pt-28">
            <Sparkle strokeWidth={4} start="top bottom" end="top 60%" className="absolute -top-4 right-4 w-12 text-aqua" />
            <p className="mb-4 text-micro uppercase tracking-[0.2em]">Elsewhere</p>
            <ul className="space-y-2 text-white">
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

        <div className="mt-20 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-6 text-micro uppercase tracking-[0.18em]">
          <span>
            © <CurrentYear /> {site.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-lime text-lime" />
            Based in {site.location} · Working worldwide
          </span>
          <span>Designed &amp; engineered in-house</span>
        </div>
      </div>

      {/* oversized wordmark bleeding off the page edge */}
      <Parallax speed={-10} className="pointer-events-none relative mt-6 select-none" aria-hidden>
        <p className="text-gradient -mb-[0.18em] -ml-[0.04em] whitespace-nowrap font-display text-[11.3vw] uppercase leading-[0.8]">
          Hamza.Daniyal
        </p>
      </Parallax>
    </footer>
  );
}
