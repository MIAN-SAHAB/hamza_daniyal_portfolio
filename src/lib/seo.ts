import type { Metadata } from "next";
import { projects, site, stackClusters } from "./site";

/** Per-route metadata with consistent OpenGraph + Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — ${site.shortName}`,
      description,
      siteName: site.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.shortName}`,
      description,
    },
  };
}

const skills = Array.from(new Set(stackClusters.flatMap((c) => c.items.map((i) => i.name)).concat(["JavaScript", "Drei", "PHP"])));

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.shortName,
      jobTitle: "Senior Full-Stack Developer",
      description: site.tagline,
      url: site.url,
      email: `mailto:${site.email}`,
      telephone: site.phone.e164,
      sameAs: site.socials.map((s) => s.href),
      knowsAbout: skills,
      hasOccupation: {
        "@type": "Occupation",
        name: "Senior Full-Stack Developer & Creative Technologist",
        occupationLocation: { "@type": "Country", name: site.location },
        skills: skills.join(", "),
      },
      address: { "@type": "PostalAddress", addressCountry: "PK" },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: `${site.name} — ${site.role}`,
      inLanguage: "en",
      mainEntity: { "@id": `${site.url}/#person` },
      hasPart: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        genre: p.kicker,
        abstract: p.summary,
        keywords: p.stack.join(", "),
        image: p.image,
        creator: { "@id": `${site.url}/#person` },
        url: `${site.url}/#${p.slug}`,
      })),
    },
  ],
};
