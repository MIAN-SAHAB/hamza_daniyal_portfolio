import Link from "@/components/AppLink";
import { nav, site } from "@/lib/site";
import CurrentYear from "./CurrentYear";
import CopyEmail, { PhoneLink } from "./CopyEmail";
import Magnetic from "./footer/Magnetic";
import StackTicker from "./footer/StackTicker";
import Wordmark from "./footer/Wordmark";
import BackToTop from "./footer/BackToTop";
import { Gamepad, Sparkle, Squiggle } from "./draw/art";

/** Hover fill per platform (brand-adjacent, tuned for the indigo footer). */
const SOCIAL_TONE: Record<string, string> = {
  GitHub: "hover:bg-white hover:text-ink",
  LinkedIn: "hover:bg-[#0A66C2] hover:text-white",
  Twitch: "hover:bg-[#9146FF] hover:text-white",
  Discord: "hover:bg-[#5865F2] hover:text-white",
  Steam: "hover:bg-[#66C0F4] hover:text-ink",
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-28 text-white/70 md:pt-36" aria-labelledby="footer-title">
      {/* colour glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="blob -left-[10vw] top-[6%] h-[40vw] w-[40vw] bg-accent opacity-55" />
        <span className="blob -right-[12vw] top-[40%] h-[36vw] w-[36vw] bg-aqua opacity-35" />
        <span className="blob bottom-[-12vw] left-[30%] h-[30vw] w-[30vw] bg-pink opacity-25" />
      </div>

      {/* undulating top edge */}
      <svg aria-hidden className="absolute inset-x-0 top-0 h-16 w-full text-bone md:h-24" viewBox="0 0 1440 96" preserveAspectRatio="none">
        <path d="M0 0H1440V40C1180 96 980 8 720 44C460 80 260 18 0 64Z" fill="currentColor" />
      </svg>

      <h2 id="footer-title" className="sr-only">
        Contact and site links
      </h2>

      {/* 1 — big invitation + magnetic CTA */}
      <div className="relative grid items-center gap-10 px-4 md:grid-cols-12 md:px-10">
        <div className="md:col-span-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent text-accent" />
            Available for select projects
          </p>
          <p className="mt-6 font-display text-[clamp(2.75rem,7vw,7rem)] uppercase leading-[0.9] text-white">
            Got an idea?
            <br />
            <span className="text-gradient">Let&rsquo;s make it vivid.</span>
          </p>
          <Squiggle strokeWidth={6} start="top 95%" end="top 55%" className="mt-3 w-[min(70%,28rem)] text-lime" />
        </div>
        <div className="flex justify-start md:col-span-4 md:justify-end">
          <div className="p-6">
            <Magnetic>
              <Link
                href="/contact"
                className="group relative flex h-44 w-44 flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent to-aqua text-center text-white shadow-[0_30px_80px_-20px_rgba(122,60,255,0.9)] md:h-52 md:w-52"
              >
                <span className="text-micro uppercase tracking-[0.2em] text-white/80">Start a</span>
                <span className="font-display text-3xl uppercase leading-none md:text-4xl">Project</span>
                <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-lime text-ink transition-transform duration-500 ease-expo group-hover:-rotate-45">
                  →
                </span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* 2 — contact strip */}
      <div className="relative mx-4 mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 md:mx-10 md:grid-cols-3">
        <div className="group bg-ink/80 p-6 backdrop-blur-md transition-colors duration-500 hover:bg-white/[0.06] md:p-8">
          <p className="text-micro uppercase tracking-[0.2em] text-white/50">Write</p>
          <CopyEmail className="mt-3 text-lede text-white" />
        </div>
        <div className="group bg-ink/80 p-6 backdrop-blur-md transition-colors duration-500 hover:bg-white/[0.06] md:p-8">
          <p className="text-micro uppercase tracking-[0.2em] text-white/50">Call</p>
          <p className="mt-3 text-lede text-white">
            <PhoneLink />
          </p>
        </div>
        <div className="group relative bg-ink/80 p-6 backdrop-blur-md transition-colors duration-500 hover:bg-white/[0.06] md:p-8">
          <p className="text-micro uppercase tracking-[0.2em] text-white/50">Based in</p>
          <p className="mt-3 text-lede text-white">{site.location} · working worldwide</p>
          <Sparkle strokeWidth={3} start="top bottom" end="top 70%" className="absolute right-6 top-6 w-8 text-aqua transition-transform duration-700 ease-expo group-hover:rotate-90" />
        </div>
      </div>

      {/* 3 — stack ticker */}
      <div className="relative mt-14">
        <StackTicker />
      </div>

      {/* 4 — index, socials, off-the-clock, back to top */}
      <div className="relative mt-16 grid gap-12 px-4 md:grid-cols-12 md:px-10">
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="mb-5 text-micro uppercase tracking-[0.2em] text-white/50">Index</p>
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li key={n.href}>
                <Link href={n.href} className="group flex items-baseline gap-3 py-1 text-white">
                  <span className="w-6 text-[0.6875rem] text-lime">0{i + 1}</span>
                  <span className="font-display text-2xl uppercase transition-transform duration-500 ease-expo group-hover:translate-x-2 group-hover:text-lime">
                    {n.label}
                  </span>
                  <span aria-hidden className="-translate-x-2 text-lime opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-5">
          <p className="mb-5 text-micro uppercase tracking-[0.2em] text-white/50">Elsewhere</p>
          <ul className="flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent ${SOCIAL_TONE[s.label] ?? "hover:bg-white hover:text-ink"}`}
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-[0.75rem] opacity-60">{s.handle}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:rotate-45">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start justify-between gap-6 md:col-span-4">
          <Link
            href="/gaming"
            className="group relative flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition-colors duration-500 hover:border-pink/60"
          >
            <p className="text-micro uppercase tracking-[0.2em] text-white/50">Off the clock</p>
            <p className="mt-2 font-display text-xl uppercase leading-tight text-white">
              Usually holding <span className="text-pink">an angle</span>
            </p>
            <p className="mt-2 text-sm text-white/60 transition-colors group-hover:text-white">See the gaming page →</p>
            <Gamepad strokeWidth={6} start="top bottom" end="top 75%" className="absolute -bottom-4 -right-4 w-24 text-pink/40 transition-transform duration-700 ease-expo group-hover:-rotate-12 group-hover:scale-110" />
          </Link>
          <BackToTop />
        </div>
      </div>

      {/* 5 — full-name wordmark */}
      <div className="relative mt-16 border-t border-white/10">
        <Wordmark />
      </div>

      {/* 6 — base line */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-6 text-micro uppercase tracking-[0.18em] text-white/50 md:px-10">
        <span>
          © <CurrentYear /> {site.name}
        </span>
        <span>Senior Full-Stack Developer &amp; Creative Technologist</span>
        <span>Designed &amp; engineered in-house</span>
      </div>
    </footer>
  );
}
