/**
 * Long-form content for the /work/[slug] case studies. Card-level data
 * (title, kicker, summary, role, stack, image) stays in site.ts `projects`.
 */

export type CaseStudy = {
  slug: string;
  lines: string[];
  heading: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** The service page this project belongs to (site.ts `services[].slug`). */
  service: string;
  brief: string;
  architecture: { title: string; copy: string }[];
  challenges: { problem: string; solution: string }[];
  /** Optional confidentiality note shown under the brief. */
  note?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "touchpoint",
    lines: ["TouchPoint,", "rebuilt", "for speed"],
    heading: "TouchPoint Digital Revamp — Next.js, TypeScript & GSAP Case Study",
    metaTitle: "TouchPoint Case Study — Next.js, TypeScript & GSAP Digital Revamp | Hamza Daniyal",
    metaDescription:
      "How the TouchPoint digital revamp was re-architected as a high-performance interactive platform with Next.js, TypeScript, GSAP motion and a headless CMS.",
    keywords: ["TouchPoint", "Next.js case study", "GSAP website", "Headless CMS", "TypeScript"],
    service: "nextjs-laravel-full-stack-development",
    brief:
      "TouchPoint needed a complete digital revamp: a platform that told its story with motion and interactivity, stayed fast on every device, and let the team publish content without developer involvement.",
    architecture: [
      { title: "Next.js App Router", copy: "Statically rendered routes with streaming for dynamic sections, keeping the critical path lean." },
      { title: "Headless CMS content model", copy: "Modular content blocks that editors compose into pages, rendered by typed React components." },
      { title: "GSAP motion system", copy: "A shared library of timelines, easings and ScrollTrigger patterns so every animation feels part of one language." },
      { title: "Responsive front-end architecture", copy: "Layout tokens and fluid type that hold the design together from small phones to wide desktop screens." },
    ],
    challenges: [
      {
        problem: "Rich motion without hurting Core Web Vitals.",
        solution: "Animations start only after the content has painted, use transforms and opacity exclusively, and respect reduced-motion preferences.",
      },
      {
        problem: "Editors needed flexibility without breaking the design.",
        solution: "A constrained block model: each block exposes only the options the design allows, so any combination still looks intentional.",
      },
      {
        problem: "Consistent behaviour across a wide range of breakpoints.",
        solution: "Fluid clamp-based type and spacing tokens replaced one-off breakpoint overrides.",
      },
    ],
  },
  {
    slug: "headless-commerce",
    lines: ["Headless", "commerce,", "no bottlenecks"],
    heading: "Headless Commerce Architecture — Shopify Storefront API & Next.js Case Study",
    metaTitle: "Headless Commerce Architecture — Shopify Storefront API & Next.js Case Study | Hamza Daniyal",
    metaDescription:
      "An NDA-safe look at a custom headless storefront built on the Shopify Storefront API, Next.js and Tailwind CSS — with an API-driven store locator and conversion-tuned UI.",
    keywords: ["Headless Shopify case study", "Shopify Storefront API", "Next.js headless commerce", "store locator API", "CRO"],
    service: "headless-shopify-development",
    brief:
      "A consumer brand needed product storytelling that a Shopify theme couldn't deliver: richer layouts, a fast store locator for retail stockists, and a storefront tuned for conversion — without giving up Shopify's checkout.",
    note: "Delivered under NDA — client name, branding and visuals are withheld. The architecture and engineering decisions below are shared with permission-safe detail.",
    architecture: [
      { title: "Shopify Storefront API", copy: "Products, collections, variants and cart handled through typed GraphQL queries with route-level caching." },
      { title: "Next.js + TypeScript front end", copy: "Server-rendered product and collection pages; only cart, variant selection and filters hydrate on the client." },
      { title: "API-driven store locator", copy: "Geocoded search over stockist data with distance sorting and map rendering via a maps API." },
      { title: "Tailwind CSS design system", copy: "Tokenised components that let new campaign pages ship quickly while staying on brand." },
    ],
    challenges: [
      {
        problem: "Theme constraints limited the product story.",
        solution: "Decoupled the front end entirely, so layouts are built from bespoke components while Shopify remains the commerce engine.",
      },
      {
        problem: "Store locator data needed to be fast and searchable.",
        solution: "Stockist data is served from an API with geocoded lookups and cached results, rendered as crawlable HTML rather than an embedded widget.",
      },
      {
        problem: "Keeping cart state reliable across a decoupled stack.",
        solution: "A single cart service wraps the Storefront API cart mutations, with optimistic UI and a clean hand-off to Shopify checkout.",
      },
    ],
  },
  {
    slug: "3d-configurators",
    lines: ["Real-time", "3D, every", "option live"],
    heading: "Real-Time WebGL 3D Product Configurators — Three.js & React Three Fiber Case Study",
    metaTitle: "3D Product Configurator Case Study — Three.js, React Three Fiber & GLSL | Hamza Daniyal",
    metaDescription:
      "Real-time WebGL product configurators built with Three.js, React Three Fiber, Drei and custom GLSL shaders — lighting rigs, constrained cameras and instant material updates.",
    keywords: ["3D product configurator", "Three.js case study", "React Three Fiber", "GLSL shaders", "WebGL"],
    service: "threejs-webgl-3d-configurators",
    brief:
      "Products with many finishes and options needed a way to be explored online in real time — every choice reflected instantly, on desktop and mobile, without long loading screens.",
    architecture: [
      { title: "React Three Fiber + Drei", copy: "Declarative scenes where configurator state maps directly onto meshes, materials and cameras." },
      { title: "Custom GLSL materials", copy: "Bespoke shaders for finishes that standard materials couldn't reproduce convincingly." },
      { title: "Lighting rigs", copy: "Per-product studio lighting with environment maps so materials read accurately from every angle." },
      { title: "Constrained camera controls", copy: "Orbit limits and preset views keep the product framed and the experience easy on touch screens." },
    ],
    challenges: [
      {
        problem: "Instant feedback when options change.",
        solution: "Materials and textures are preloaded per option group and swapped in place, so changes don't trigger scene reloads.",
      },
      {
        problem: "Smooth performance on mid-range phones.",
        solution: "Compressed geometry and textures, adaptive pixel ratio and on-demand rendering that only draws frames when something changes.",
      },
      {
        problem: "Making 3D accessible and resilient.",
        solution: "All options are standard form controls outside the canvas, with a static image fallback when WebGL isn't available.",
      },
    ],
  },
  {
    slug: "haprow",
    lines: ["Haprow,", "precise", "and fast"],
    heading: "Haprow Corporate Platform — Laravel, PHP, MySQL & Core Web Vitals Case Study",
    metaTitle: "Haprow Case Study — Laravel, PHP, MySQL & Core Web Vitals Optimisation | Hamza Daniyal",
    metaDescription:
      "The Haprow corporate platform: a bespoke UI system on Laravel, PHP and MySQL with GSAP micro-interactions and relentlessly optimised Core Web Vitals.",
    keywords: ["Haprow", "Laravel case study", "Core Web Vitals optimisation", "PHP MySQL platform", "GSAP micro-interactions"],
    service: "nextjs-laravel-full-stack-development",
    brief:
      "Haprow wanted a corporate platform with brand precision — a bespoke UI system and considered micro-interactions — without paying for it in page speed.",
    architecture: [
      { title: "Laravel application", copy: "Server-rendered pages and a Laravel back end with content managed through admin tooling." },
      { title: "MySQL data model", copy: "A relational schema for pages, media and structured content, indexed for the queries the site runs." },
      { title: "Bespoke UI system", copy: "Reusable components and tokens so every page shares the same spacing, type and interaction patterns." },
      { title: "GSAP micro-interactions", copy: "Small, purposeful motion on hover, focus and scroll, loaded only where it's used." },
    ],
    challenges: [
      {
        problem: "Brand-heavy visuals threatened page speed.",
        solution: "Responsive images, preloaded fonts with fallback metrics and deferred scripts kept the critical rendering path short.",
      },
      {
        problem: "Interactions needed to feel premium but stay accessible.",
        solution: "Every micro-interaction has a keyboard and reduced-motion equivalent.",
      },
      {
        problem: "Content updates without developer involvement.",
        solution: "A custom admin built around the content model, so editors update structured fields rather than raw HTML.",
      },
    ],
  },
  {
    slug: "gophygital",
    lines: ["GoPhygital,", "physical", "meets digital"],
    heading: "GoPhygital Interactive Client Experience Platform — React, Next.js & Laravel Case Study",
    metaTitle: "GoPhygital Case Study — React, Next.js, Laravel & REST API Platform | Hamza Daniyal",
    metaDescription:
      "GoPhygital: an interactive client experience platform bridging physical and digital touchpoints, built with React, Next.js, Laravel and REST APIs.",
    keywords: ["GoPhygital", "React Next.js Laravel", "REST API platform", "client experience platform", "full-stack case study"],
    service: "nextjs-laravel-full-stack-development",
    brief:
      "GoPhygital needed a modern client experience platform that connects physical and digital touchpoints — fluid interfaces, live states and an architecture that grows with the business.",
    architecture: [
      { title: "React + Next.js front end", copy: "Interactive interfaces with server-rendered entry points and client-side state for live updates." },
      { title: "Laravel REST APIs", copy: "Versioned endpoints for content, users and experience data, with validation and auth at the boundary." },
      { title: "Live UI states", copy: "Interfaces that reflect changing data without full page reloads, with clear loading and error states." },
      { title: "Scalable structure", copy: "Feature-based modules on both front end and back end so new touchpoints can be added independently." },
    ],
    challenges: [
      {
        problem: "Bridging physical and digital interactions in one experience.",
        solution: "A shared API contract consumed by every touchpoint, so data stays consistent wherever clients interact.",
      },
      {
        problem: "Keeping interfaces fluid as data changes.",
        solution: "Optimistic updates and granular component state avoid jarring reloads.",
      },
      {
        problem: "Growing without rewrites.",
        solution: "Modular architecture and versioned APIs let features ship independently.",
      },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
