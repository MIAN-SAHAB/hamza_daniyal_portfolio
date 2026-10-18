import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "@/components/AppLink";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { Bolt, BrowserWindow, Cart, Orbits, WireCube } from "@/components/draw/art";
import { constructMetadata, developerKeywords } from "@/lib/seo-config";
import { caseStudyGraph } from "@/lib/schema";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { projects, services } from "@/lib/site";

const ART = {
  touchpoint: BrowserWindow,
  "headless-commerce": Cart,
  "3d-configurators": WireCube,
  haprow: Bolt,
  gophygital: Orbits,
} as const;

const TONES = { accent: "violet", aqua: "aqua", ink: "lime" } as const;

// Every valid slug is prerendered by generateStaticParams and internal links are
// full document loads (see AppLink), so the dynamic-param shell may block.
export const instant = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

function load(slug: string) {
  const study = getCaseStudy(slug);
  const project = projects.find((p) => p.slug === slug);
  return study && project ? { study, project } : null;
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = load(slug);
  if (!data) return {};
  return constructMetadata({
    title: data.study.metaTitle,
    description: data.study.metaDescription,
    path: `/work/${slug}`,
    type: "article",
    keywords: [...data.study.keywords, ...data.project.stack, ...developerKeywords.core],
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const data = load(slug);
  if (!data) notFound();
  const { study, project } = data;
  const Art = ART[slug as keyof typeof ART] ?? BrowserWindow;
  const service = services.find((s) => s.slug === study.service)!;
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];

  return (
    <main id="main">
      <JsonLd id="ld-case-study" data={caseStudyGraph(study)} />
      <PageHero
        id={`${slug}-title`}
        label={project.kicker}
        heading={study.heading}
        lines={study.lines}
        accentLine={1}
        tone={TONES[project.accent]}
        art={<Art mode="intro" delay={0.5} duration={2.4} strokeWidth={4} className="w-full" />}
        aside={
          <Breadcrumbs
            trail={[
              { name: "Work", href: "/work" },
              { name: project.title, href: `/work/${slug}` },
            ]}
          />
        }
        intro={<p>{project.summary}</p>}
      />

      <div className="px-4 md:px-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-mist">
          <Image src={project.image} alt={project.imageAlt} fill sizes="(min-width: 768px) 92vw, 100vw" className="object-cover" />
        </div>
      </div>

      {/* (01) Brief */}
      <section aria-labelledby="brief-title" className="relative px-4 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(01) — The engineering brief</p>
            <h2 id="brief-title" className="mt-6 font-display text-big uppercase text-ink">
              The
              <br />
              <span className="md:pl-[3vw]">problem</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="text-statement text-ink">{study.brief}</p>
            {study.note && <p className="mt-8 max-w-xl border-l-2 border-accent pl-4 text-sm leading-relaxed">{study.note}</p>}
            <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-ink/10 pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-micro uppercase tracking-[0.2em]">Role</dt>
                <dd className="mt-2 text-ink">{project.role}</dd>
              </div>
              <div>
                <dt className="text-micro uppercase tracking-[0.2em]">Discipline</dt>
                <dd className="mt-2 text-ink">
                  <Link href={`/services/${service.slug}`} className="link-underline">
                    {service.title}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* (02) Architecture */}
      <section aria-labelledby="architecture-title" className="relative overflow-hidden bg-sky px-4 py-24 md:px-10 md:py-36">
        <p className="text-micro uppercase tracking-[0.2em] text-accent">(02) — System architecture</p>
        <h2 id="architecture-title" className="mt-6 font-display text-big uppercase text-ink">
          How it&rsquo;s <span className="text-gradient">built</span>
        </h2>
        <ol className="mt-14 grid gap-x-10 gap-y-12 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {study.architecture.map((a, n) => (
            <li key={a.title}>
              <p className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-none text-ink/10">0{n + 1}</p>
              <h3 className="-mt-3 font-display text-[clamp(1.4rem,2vw,1.85rem)] uppercase leading-none text-ink">{a.title}</h3>
              <p className="mt-3 leading-relaxed">{a.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* (03) Challenges */}
      <section aria-labelledby="challenges-title" className="relative px-4 py-24 md:px-10 md:py-36">
        <p className="text-micro uppercase tracking-[0.2em] text-accent">(03) — Key technical challenges solved</p>
        <h2 id="challenges-title" className="mt-6 font-display text-big uppercase text-ink">
          Hard parts,
          <br />
          <span className="md:pl-[3vw]">handled</span>
        </h2>
        <ul className="mt-14 border-t border-ink/15">
          {study.challenges.map((c) => (
            <li key={c.problem} className="grid gap-4 border-b border-ink/15 py-8 md:grid-cols-12 md:gap-10">
              <h3 className="font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-none text-ink md:col-span-5">{c.problem}</h3>
              <p className="leading-relaxed md:col-span-6 md:col-start-7">{c.solution}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* (04) Stack */}
      <section aria-labelledby="stack-title" className="relative bg-paper px-4 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="text-micro uppercase tracking-[0.2em] text-accent">(04) — Tech stack</p>
            <h2 id="stack-title" className="mt-6 font-display text-big uppercase text-ink">
              The toolkit
            </h2>
          </div>
          <ul className="flex flex-wrap gap-3 md:col-span-7">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/work/${next.slug}`}
          className="group mt-20 flex items-baseline justify-between gap-6 border-t border-ink/15 pt-8 text-ink"
        >
          <span>
            <span className="block text-micro uppercase tracking-[0.2em]">Next case study</span>
            <span className="mt-3 block font-display text-[clamp(2rem,4vw,4rem)] uppercase leading-[0.9] transition-transform duration-500 ease-expo group-hover:translate-x-2">
              {next.title}
            </span>
          </span>
          <span aria-hidden className="text-2xl text-accent transition-transform duration-500 ease-expo group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>

      <CtaBand
        id="case-study-cta"
        eyebrow={`Need ${service.title.toLowerCase()}?`}
        title={
          <>
            Build something
            <br />
            like this.
          </>
        }
        primary={{ href: "/contact", label: "Start a project" }}
        secondary={{ href: `/services/${service.slug}`, label: `${service.title} service` }}
      />
    </main>
  );
}
