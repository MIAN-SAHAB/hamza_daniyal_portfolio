"use client";

import { useEffect, useState } from "react";
import { Crosshair } from "@/components/draw/art";
import { ScrollTrigger } from "@/lib/gsap";
import { FAQ_TOPICS, type FaqTopic, type GamingFaq } from "@/lib/gaming-faq";

/**
 * Player FAQ: topic chips + live search over a native <details> accordion.
 * Every question and answer is server-rendered — filtering only toggles `hidden`,
 * so crawlers always see the full set (mirrored in the page's FAQPage JSON-LD).
 */
export default function PlayerFaq({ faqs }: { faqs: GamingFaq[] }) {
  const [topic, setTopic] = useState<FaqTopic | "all">("all");
  const [query, setQuery] = useState("");

  // Deep links (/gaming#faq-twitch) open the matching answer.
  useEffect(() => {
    const el = document.getElementById(window.location.hash.slice(1));
    if (el instanceof HTMLDetailsElement) el.open = true;
  }, []);

  const q = query.trim().toLowerCase();
  // Filtering changes the section height — re-measure the scroll-driven sections below.
  useEffect(() => ScrollTrigger.refresh(), [topic, q]);

  const matches = (f: GamingFaq) =>
    (topic === "all" || f.topic === topic) && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q));
  const shown = faqs.filter(matches).length;

  return (
    <section aria-labelledby="faq-title" className="relative overflow-hidden bg-[#160b33] px-4 py-28 text-white md:px-10 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="blob -left-[8vw] top-[10%] h-[34vw] w-[34vw] bg-accent opacity-35" />
        <span className="blob -right-[6vw] bottom-0 h-[28vw] w-[28vw] bg-aqua opacity-20" />
      </div>
      <Crosshair strokeWidth={1.2} start="top 80%" end="top 20%" className="pointer-events-none absolute -right-[4vw] top-[6%] w-[26vw] text-white/10" />

      <div className="relative grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="inline-block rounded-full bg-lime px-3 py-1.5 text-micro uppercase tracking-[0.2em] text-ink">Player FAQ</p>
          <h2 id="faq-title" className="mt-6 font-display text-[clamp(2.25rem,5vw,5rem)] uppercase leading-[0.9]">
            Ask the <span className="text-gradient">lobby</span>
          </h2>
          <p className="mt-6 max-w-sm text-lede text-white/75">
            Everything people ask about Tommy Vercetti — the team, the games, the stream and how to squad up.
          </p>

          <label className="mt-10 block max-w-sm">
            <span className="sr-only">Search questions</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — e.g. Twitch, team, hours"
              className="w-full rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-lime focus:outline-none"
            />
          </label>

          <div role="group" aria-label="Filter by topic" className="mt-5 flex max-w-sm flex-wrap gap-2">
            {FAQ_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={topic === t.id}
                onClick={() => setTopic(t.id)}
                className="h-9 rounded-full border border-white/25 px-4 text-[0.6875rem] uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/60 aria-pressed:border-transparent aria-pressed:bg-lime aria-pressed:text-ink"
              >
                {t.label}
              </button>
            ))}
          </div>

          <p role="status" className="mt-5 text-micro uppercase tracking-[0.2em] text-white/50">
            {shown} of {faqs.length} questions
          </p>
        </div>

        <div className="border-t border-white/15 md:col-span-7 md:col-start-6">
          {faqs.map((f) => (
            <details key={f.id} id={`faq-${f.id}`} name="player-faq" hidden={!matches(f)} className="group border-b border-white/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lede text-white transition-colors group-hover:text-white/70">{f.q}</h3>
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition-all duration-500 ease-expo group-open:rotate-45 group-open:border-transparent group-open:bg-lime group-open:text-ink"
                >
                  +
                </span>
              </summary>
              <div className="max-w-2xl pb-8">
                <p className="leading-relaxed text-white/75">{f.a}</p>
                {f.link && (
                  <a
                    href={f.link.href}
                    {...(f.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-4 inline-flex items-center gap-2 h-9 rounded-full border border-white/30 px-4 text-[0.6875rem] uppercase tracking-[0.14em] text-white transition-colors hover:border-transparent hover:bg-lime hover:text-ink"
                  >
                    {f.link.label} <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </details>
          ))}
          {shown === 0 && (
            <p className="py-10 text-white/60">
              No questions match that — try another word, or{" "}
              <button type="button" onClick={() => (setQuery(""), setTopic("all"))} className="text-white underline decoration-lime decoration-2 underline-offset-4">
                reset the filters
              </button>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
