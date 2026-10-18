import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "@/components/AppLink";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { Cart, CodeBrackets, Plug, WireCube } from "@/components/draw/art";
import { constructMetadata } from "@/lib/seo-config";
import { serviceGraph } from "@/lib/schema";
import { getServicePage, servicePages } from "@/lib/service-pages";
import { projects, services } from "@/lib/site";

const ART = {
  "threejs-webgl-3d-configurators": WireCube,
  "nextjs-laravel-full-stack-development": CodeBrackets,
  "headless-shopify-development": Cart,
  "wordpress-plugin-engineering": Plug,
} as const;

const TONES = ["aqua", "violet", "lime", "violet"] as const;

// Every valid slug is prerendered by generateStaticParams and internal links are
// full document loads (see AppLink), so the dynamic-param shell may block.
export const instant = false;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

function load(slug: string) {
  const page = getServicePage(slug);
  const card = services.find((s) => s.slug === slug);
  return page && card ? { page, card } : null;
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = load(slug);
  if (!data) return {};
  return constructMetadata({
    title: data.page.metaTitle,
    description: data.page.metaDescription,
    path: `/services/${slug}`,
    keywords: data.page.keywords,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const data = load(slug);
  if (!data) notFound();
  const { page, card } = data;
  const i = services.indexOf(card);
  const Art = ART[slug as keyof typeof ART] ?? CodeBrackets;
  const related = page.caseStudies.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const others = services.filter((s) => s.slug !== slug);

  return (
    <main id="main">
      <JsonLd id="ld-service" data={serviceGraph(page, card.title)} />
      <PageHero
        id={`${slug}-title`}
        label={card.title}
        heading={page.heading}
        lines={page.lines}
        accentLine={1}
        tone={TONES[i % TONES.length]}
        art={<Art mode="intro" delay={0.5} duration={2.4} strokeWidth={4} className="w-full" />}
        aside={
          <Breadcrumbs
            trail={[
              { name: "Services", href: "/services" },
              { name: card.title, href: `/services/${slug}` },
            ]}
          />
        }
        intro={<p>{page.lede}</p>}
      />

      {/* (01) Architecture */}
      <section aria-labelledby="architecture-title" className="relative px-4 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(01) — Architecture overview</p>
            <h2 id="architecture-title" className="mt-6 font-display text-big uppercase text-ink">
              How it&rsquo;s
              <br />
              <span className="md:pl-[3vw]">engineered</span>
            </h2>
          </div>
          <ol className="grid gap-x-10 gap-y-12 border-t border-ink/15 pt-10 sm:grid-cols-2 md:col-span-8">
            {page.architecture.map((a, n) => (
              <li key={a.title}>
                <p className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-none text-ink/10">0{n + 1}</p>
                <h3 className="-mt-3 font-display text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-none text-ink">{a.title}</h3>
                <p className="mt-3 leading-relaxed">{a.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* (02) Deliverables */}
      <section aria-labelledby="deliverables-title" className="relative overflow-hidden bg-sky px-4 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(02) — Deliverables</p>
            <h2 id="deliverables-title" className="mt-6 font-display text-big uppercase text-ink">
              What you
              <br />
              <span className="md:pl-[3vw]">get</span>
            </h2>
            <p className="mt-8 max-w-sm text-micro uppercase leading-loose tracking-[0.18em]">{card.stack.join(" / ")}</p>
            <div className="relative mt-10 hidden aspect-[4/5] w-[min(100%,20rem)] overflow-hidden rounded-[2rem] bg-mist md:block">
              <Image src={card.image} alt="" fill sizes="20rem" className="object-cover" />
            </div>
          </div>
          <ul className="border-t border-ink/15 md:col-span-6 md:col-start-7">
            {page.deliverables.map((d) => (
              <li key={d} className="flex gap-4 border-b border-ink/15 py-5 text-lede text-ink">
                <span aria-hidden className="text-accent">
                  +
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* (03) Performance */}
      <section aria-labelledby="performance-title" className="relative px-4 py-24 md:px-10 md:py-36">
        <p className="text-micro uppercase tracking-[0.2em] text-accent">(03) — Performance commitments</p>
        <h2 id="performance-title" className="mt-6 font-display text-big uppercase text-ink">
          Fast is <span className="text-gradient">the baseline</span>
        </h2>
        <dl className="mt-14 grid gap-6 md:grid-cols-3">
          {page.performance.map((m) => (
            <div key={m.metric} className="rounded-[2rem] bg-gradient-to-br from-accent to-aqua p-8 text-white shadow-[0_30px_60px_-30px_rgba(122,60,255,0.7)]">
              <dt className="text-micro uppercase tracking-[0.2em] text-white/80">{m.metric}</dt>
              <dd className="mt-4 font-display text-[clamp(2.5rem,4.4vw,4.5rem)] uppercase leading-none">{m.target}</dd>
              <dd className="mt-4 text-sm text-white/85">{m.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* (04) Case studies */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="relative bg-paper px-4 py-24 md:px-10 md:py-36">
          <p className="text-micro uppercase tracking-[0.2em] text-accent">(04) — Proof</p>
          <h2 id="related-title" className="mt-6 font-display text-big uppercase text-ink">
            Related case studies
          </h2>
          <ul className="mt-14 grid gap-10 md:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-mist">
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 768px) 45vw, 92vw"
                      className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-6 flex items-center gap-3 text-micro uppercase tracking-[0.2em]">
                    <span className="rounded-full bg-ink px-2.5 py-1 text-white">{p.index}</span>
                    <span className="text-accent">{p.kicker}</span>
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.5rem)] uppercase leading-[0.9] text-ink">
                    <span className="link-underline">{p.title}</span>
                  </h3>
                  <p className="mt-3 max-w-lg leading-relaxed">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* (05) FAQ */}
      <section aria-labelledby="faq-title" className="relative px-4 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(05) — Buyer FAQ</p>
            <h2 id="faq-title" className="mt-6 font-display text-big uppercase text-ink">
              Good
              <br />
              <span className="md:pl-[3vw]">questions</span>
            </h2>
          </div>
          <div className="border-t border-ink/15 md:col-span-8">
            {page.faqs.map((f) => (
              <details key={f.q} className="group border-b border-ink/15">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lede text-ink">{f.q}</h3>
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-transform duration-500 ease-expo group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other services — internal silo links */}
      <nav aria-label="Other services" className="px-4 pb-8 md:px-10">
        <p className="mb-4 text-micro uppercase tracking-[0.2em]">More services</p>
        <ul className="border-t border-ink/15">
          {others.map((s) => (
            <li key={s.slug} className="border-b border-ink/15">
              <Link href={`/services/${s.slug}`} className="group flex items-baseline justify-between gap-6 py-5 text-ink">
                <span className="font-display text-[clamp(1.5rem,2.6vw,2.5rem)] uppercase leading-none transition-transform duration-500 ease-expo group-hover:translate-x-2">
                  {s.title}
                </span>
                <span aria-hidden className="text-accent transition-transform duration-500 ease-expo group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CtaBand
        id="service-cta"
        eyebrow={`${card.title} — let's talk`}
        title={
          <>
            Have a brief
            <br />
            for this?
          </>
        }
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: "/services", label: "All services" }}
      />
    </main>
  );
}
