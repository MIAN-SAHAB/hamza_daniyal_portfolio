import { projects, services, site, stackClusters } from "./site";
import { BASE_URL, absoluteUrl } from "./seo-config";
import type { ServicePage } from "./service-pages";
import type { CaseStudy } from "./case-studies";

/** Schema.org node builders. Nodes reference each other by stable `@id`s. */

type Node = Record<string, unknown>;

export const ids = {
  person: `${BASE_URL}/#person`,
  website: `${BASE_URL}/#website`,
  business: `${BASE_URL}/#service`,
};

export const developerSameAs = [
  "https://github.com/MIAN-SAHAB",
  "https://www.linkedin.com/in/hamzadaniyal",
  "https://www.twitch.tv/tommyvercetti__455",
  "https://steamcommunity.com/id/IamTommyVercetti",
];

const knowsAbout = Array.from(
  new Set([
    ...stackClusters.flatMap((c) => c.items.map((i) => i.name)),
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Three.js",
    "React Three Fiber",
    "Drei",
    "GLSL",
    "WebGL",
    "GSAP",
    "Laravel",
    "PHP",
    "MySQL",
    "Shopify Storefront API",
    "Headless Commerce",
    "WordPress Plugin Development",
    "Headless WordPress",
    "Core Web Vitals",
    "Tailwind CSS",
  ]),
);

/** Site-wide graph (root layout): Person + ProfessionalService + WebSite. */
export function globalGraph(): Node[] {
  return [
    {
      "@type": "Person",
      "@id": ids.person,
      name: site.name,
      alternateName: [site.shortName, "Tommy Vercetti"],
      givenName: "Hamza",
      familyName: "Daniyal",
      jobTitle: site.role,
      description: site.tagline,
      url: BASE_URL,
      image: `${BASE_URL}/assets/images/Hamza-Daniyal.webp`,
      email: `mailto:${site.email}`,
      telephone: site.phone.e164,
      address: { "@type": "PostalAddress", addressCountry: "PK" },
      knowsAbout,
      sameAs: developerSameAs,
      hasOccupation: {
        "@type": "Occupation",
        name: site.role,
        occupationLocation: { "@type": "Country", name: site.location },
        skills: knowsAbout.join(", "),
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": ids.business,
      name: `${site.shortName} — Full-Stack & Creative Web Engineering`,
      description:
        "Senior full-stack web engineering: headless Shopify storefronts, Three.js / React Three Fiber 3D configurators, Next.js and Laravel platforms and custom WordPress plugins.",
      url: BASE_URL,
      image: `${BASE_URL}/opengraph-image`,
      email: site.email,
      telephone: site.phone.e164,
      address: { "@type": "PostalAddress", addressCountry: "PK" },
      areaServed: "Worldwide",
      founder: { "@id": ids.person },
      employee: { "@id": ids.person },
      knowsAbout,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Web engineering services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      url: BASE_URL,
      name: site.name,
      alternateName: site.shortName,
      inLanguage: "en",
      publisher: { "@id": ids.person },
    },
  ];
}

export function breadcrumbs(trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceGraph(page: ServicePage, title: string): Node[] {
  const url = absoluteUrl(`/services/${page.slug}`);
  return [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.heading,
      serviceType: title,
      description: page.metaDescription,
      url,
      provider: { "@id": ids.person },
      brand: { "@id": ids.business },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${title} deliverables`,
        itemListElement: page.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d } })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbs([
      { name: "Services", path: "/services" },
      { name: title, path: `/services/${page.slug}` },
    ]),
  ];
}

export function caseStudyGraph(study: CaseStudy): Node[] {
  const project = projects.find((p) => p.slug === study.slug)!;
  const url = absoluteUrl(`/work/${study.slug}`);
  return [
    {
      "@type": ["CreativeWork", "TechArticle"],
      "@id": `${url}#article`,
      headline: study.heading,
      name: project.title,
      description: study.metaDescription,
      abstract: project.summary,
      genre: project.kicker,
      keywords: [...project.stack, ...study.keywords].join(", "),
      proficiencyLevel: "Expert",
      image: project.image,
      url,
      inLanguage: "en",
      author: { "@id": ids.person },
      creator: { "@id": ids.person },
      publisher: { "@id": ids.person },
      isPartOf: { "@id": ids.website },
      about: project.stack.map((name) => ({ "@type": "Thing", name })),
    },
    breadcrumbs([
      { name: "Work", path: "/work" },
      { name: project.title, path: `/work/${study.slug}` },
    ]),
  ];
}

/** /gaming: ProfilePage centred on the gaming identity. */
export function gamingGraph({
  persona,
  avatar,
  mainGame,
  games,
  faqs,
}: {
  persona: string;
  avatar: string;
  mainGame?: { name: string; hours: number };
  games: string[];
  faqs: { q: string; a: string }[];
}): Node[] {
  const url = absoluteUrl("/gaming");
  const discord = site.socials.find((s) => s.label === "Discord")!.href;
  return [
    {
      "@type": "ProfilePage",
      "@id": `${url}#profile`,
      url,
      name: "Tommy Vercetti (Hamza Daniyal) — CS2 gaming profile",
      inLanguage: "en",
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": `${url}#gamer` },
    },
    {
      "@type": "Person",
      "@id": `${url}#gamer`,
      name: "Tommy Vercetti",
      alternateName: ["tommyvercetti__455", "IamTommyVercetti", persona, site.shortName, site.name],
      description:
        "Counter-Strike 2 competitive player from Pakistan, playing with Raptors Esports and streaming live on Twitch as tommyvercetti__455.",
      image: avatar,
      url,
      nationality: { "@type": "Country", name: site.location },
      sameAs: [
        "https://www.twitch.tv/tommyvercetti__455",
        "https://steamcommunity.com/id/IamTommyVercetti",
        discord,
      ],
      memberOf: { "@type": "SportsTeam", name: "Raptors Esports", sport: "Esports — Counter-Strike 2" },
      knowsAbout: Array.from(new Set(["Counter-Strike 2", "CS2", "Competitive FPS", "Twitch streaming", ...games])),
      ...(mainGame
        ? {
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/PlayAction",
              name: `Hours played in ${mainGame.name}`,
              userInteractionCount: Math.round(mainGame.hours),
            },
          }
        : {}),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#profile` },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbs([{ name: "Gaming", path: "/gaming" }]),
  ];
}
