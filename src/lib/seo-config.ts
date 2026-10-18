import type { Metadata } from "next";
import { site } from "./site";

/**
 * Centralised SEO engine. Every route builds its metadata through
 * `constructMetadata()` so canonicals, social cards and robots directives stay
 * consistent. Keywords are siloed: developer clusters never leak onto /gaming
 * and gaming clusters never leak onto the B2B pages.
 */

export const BASE_URL = "https://www.hamzadaniyal.com";

/** B2B developer silo — `/`, `/services`, `/work`, `/about`, `/contact` and their children. */
export const developerKeywords = {
  core: [
    "Hamza Daniyal",
    "Mian Muhammad Hamza Daniyal",
    "Senior Full-Stack Developer",
    "Hire Next.js Developer",
    "Creative Technologist",
    "Remote Full-Stack Developer",
  ],
  headless: [
    "Headless Shopify Storefront API Developer",
    "Headless Shopify Developer",
    "Next.js Headless Commerce",
    "Shopify Storefront API",
    "Custom Store Locator API",
    "Conversion Rate Optimisation UI",
  ],
  webgl: [
    "Three.js Developer",
    "React Three Fiber (R3F) Developer",
    "Three.js & React Three Fiber 3D Configurator Developer",
    "3D Product Configurator",
    "WebGL Developer",
    "GLSL Shaders",
    "GSAP Creative Technologist",
    "GSAP ScrollTrigger Developer",
  ],
  fullStack: [
    "Next.js App Router Developer",
    "TypeScript Developer",
    "Laravel & PHP Systems Architect",
    "Laravel API Developer",
    "MySQL Architecture",
    "Core Web Vitals Optimisation",
  ],
  wordpress: [
    "Custom WordPress Plugin Engineer",
    "Custom WordPress Plugin Development",
    "Bespoke WordPress Themes",
    "Headless WordPress GraphQL",
  ],
} as const;

/** Gaming & streaming silo — strictly isolated to `/gaming`. */
export const gamingKeywords = [
  "Tommy Vercetti",
  "tommyvercetti__455",
  "IamTommyVercetti",
  "IamTommyVercetti Steam",
  "Counter-Strike 2 competitive player Pakistan",
  "CS2 competitive player Pakistan",
  "Raptors Esports",
  "Raptors Esports CS2",
  "Tommy Vercetti Twitch",
  "Tommy Vercetti CS2",
  "Twitch streamer Pakistan",
] as const;

export const allDeveloperKeywords = Object.values(developerKeywords).flat();

type MetaInput = {
  /** Full, absolute document title (not run through the layout template). */
  title: string;
  description: string;
  /** Route path, e.g. "/services/headless-shopify-development". */
  path: string;
  keywords?: readonly string[];
  /** Short title for social cards; defaults to `title`. */
  socialTitle?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

export function constructMetadata({
  title,
  description,
  path,
  keywords = developerKeywords.core,
  socialTitle = title,
  type = "website",
  noIndex = false,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    keywords: Array.from(new Set(keywords)),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: socialTitle,
      description,
      siteName: site.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}
