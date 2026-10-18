import { developerKeywords } from "./seo-config";

/**
 * Long-form content for the /services/[slug] silo pages. The short card copy
 * (title, summary, deliverables, stack, image) lives with `services` in site.ts;
 * this file adds the depth each landing page needs to rank on its own.
 */

export type ServicePage = {
  slug: string;
  /** Visible hero lines (display type). */
  lines: string[];
  /** Keyword-rich semantic heading, read by crawlers and screen readers. */
  heading: string;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  lede: string;
  architecture: { title: string; copy: string }[];
  deliverables: string[];
  performance: { metric: string; target: string; note: string }[];
  /** Project slugs from site.ts `projects`. */
  caseStudies: string[];
  faqs: { q: string; a: string }[];
};

const cwv = [
  { metric: "LCP", target: "< 2.5s", note: "Largest Contentful Paint at the 75th percentile on mobile" },
  { metric: "INP", target: "< 200ms", note: "Interaction to Next Paint — every tap and click answers fast" },
  { metric: "CLS", target: "< 0.1", note: "No layout shift from fonts, images or late-loading UI" },
];

export const servicePages: ServicePage[] = [
  {
    slug: "headless-shopify-development",
    lines: ["Headless", "Shopify,", "no theme limits"],
    heading: "Headless Shopify Storefront API Development with Next.js",
    metaTitle: "Headless Shopify Storefront API Developer — Next.js Headless Commerce | Hamza Daniyal",
    metaDescription:
      "Hire a senior headless Shopify developer. Custom Shopify Storefront API storefronts on Next.js, API-driven store locators and conversion-tuned UI — built for speed, not theme bottlenecks.",
    keywords: [...developerKeywords.headless, "Hire Next.js Developer", "Senior Full-Stack Developer"],
    lede: "Your catalogue, cart and content served through the Shopify Storefront API — rendered by a Next.js front end that you fully own. Shopify keeps doing what it's best at (checkout, inventory, payments); everything the customer sees is bespoke, fast and built to convert.",
    architecture: [
      {
        title: "Storefront API data layer",
        copy: "Typed GraphQL queries against the Shopify Storefront API, cached per route with tag-based revalidation so price and stock changes land in seconds without rebuilding the site.",
      },
      {
        title: "Next.js App Router front end",
        copy: "Server Components render product and collection pages as static HTML at the edge; only the cart, variant pickers and filters hydrate on the client.",
      },
      {
        title: "Custom API store locator",
        copy: "A location service backed by a maps API — geocoded search, distance sorting and stockist filters — rendered as crawlable pages, not a locked iframe.",
      },
      {
        title: "Conversion-tuned UI",
        copy: "Product storytelling, sticky add-to-cart, and cart drawers designed around real behaviour, then measured and iterated after launch.",
      },
    ],
    deliverables: [
      "Shopify Storefront API integration (GraphQL)",
      "Next.js headless storefront — PDP, PLP, search & cart",
      "Custom cart drawer & Shopify checkout hand-off",
      "API-driven store locator with maps & geocoding",
      "CRO-led UI components and A/B-ready layouts",
      "SEO foundations: structured data, sitemaps, canonicals",
    ],
    performance: cwv,
    caseStudies: ["headless-commerce", "touchpoint"],
    faqs: [
      {
        q: "Why go headless instead of using a Shopify theme?",
        a: "Themes are fast to start but hard to bend. A headless storefront gives you complete control over design, performance and content structure, while Shopify still handles checkout, payments and inventory. It suits brands whose product story or speed targets outgrow what a theme can do.",
      },
      {
        q: "Do I keep Shopify checkout and my existing apps?",
        a: "Yes. Customers hand off to Shopify's secure checkout, so payments, discounts and order management stay exactly as they are. Apps that work through the Admin or Storefront APIs keep working; theme-only apps are replaced with lighter custom components where needed.",
      },
      {
        q: "How long does a headless Shopify build take?",
        a: "Most storefronts land in 6–12 weeks depending on catalogue complexity, integrations and content migration. You get a staged preview from the first sprint, so progress is visible long before launch.",
      },
      {
        q: "Can my team still edit content without a developer?",
        a: "Yes. Content is managed in Shopify metafields or a headless CMS of your choice, with page sections modelled so editors can compose layouts without touching code.",
      },
    ],
  },
  {
    slug: "threejs-webgl-3d-configurators",
    lines: ["Real-time 3D", "that sells", "the product"],
    heading: "Three.js, React Three Fiber & WebGL 3D Product Configurator Development",
    metaTitle: "Three.js & React Three Fiber 3D Configurator Developer — WebGL & GSAP | Hamza Daniyal",
    metaDescription:
      "Real-time 3D product configurators and immersive WebGL experiences built with Three.js, React Three Fiber, Drei, custom GLSL shaders and GSAP ScrollTrigger — engineered to run smoothly on real devices.",
    keywords: [...developerKeywords.webgl, "Hire Next.js Developer", "Creative Technologist"],
    lede: "Interactive 3D that loads fast and responds instantly — product configurators where every material, colour and option updates in real time, and scroll-driven WebGL narratives that make a brand feel tangible.",
    architecture: [
      {
        title: "React Three Fiber scene graph",
        copy: "Scenes composed declaratively with React Three Fiber and Drei, so 3D state lives alongside the rest of your React app and options map cleanly to product data.",
      },
      {
        title: "Custom GLSL shaders & lighting rigs",
        copy: "Bespoke material shaders and baked or real-time lighting tuned per product, so finishes read correctly without heavy post-processing.",
      },
      {
        title: "Asset pipeline & budgets",
        copy: "glTF models compressed with Draco/Meshopt, KTX2 textures and lazy-loaded scenes, with frame-time budgets checked on mid-range phones — not just a desktop GPU.",
      },
      {
        title: "GSAP ScrollTrigger choreography",
        copy: "Camera moves, reveals and scroll-scrubbed timelines driven by GSAP, synchronised with the DOM so 3D and page content move as one.",
      },
    ],
    deliverables: [
      "Real-time 3D product configurator",
      "Three.js / React Three Fiber / Drei scenes",
      "Custom GLSL material & post shaders",
      "Constrained camera controls & hotspots",
      "GSAP ScrollTrigger 3D storytelling",
      "glTF asset optimisation pipeline",
    ],
    performance: [
      { metric: "FPS", target: "60fps", note: "Target frame rate on modern devices, with adaptive quality on low-end hardware" },
      { metric: "LCP", target: "< 2.5s", note: "Page content paints before the 3D scene finishes streaming in" },
      { metric: "Fallback", target: "100%", note: "Every configurator ships a static, accessible fallback when WebGL is unavailable" },
    ],
    caseStudies: ["3d-configurators", "touchpoint"],
    faqs: [
      {
        q: "Will a 3D configurator slow my site down?",
        a: "Not when it's engineered with budgets. Models are compressed, scenes load after the critical page content, and quality adapts to the device. The rest of the page stays fast while the 3D streams in.",
      },
      {
        q: "What do you need from us to start?",
        a: "Ideally CAD or existing 3D models of the product and a list of configurable options. If you don't have 3D assets yet, I can work with a 3D artist or advise on what to commission.",
      },
      {
        q: "Can the configurator connect to our cart or pricing?",
        a: "Yes. Selected options map to product variants or SKUs, so the configurator can push straight to a Shopify cart, a quote form or your own pricing API.",
      },
      {
        q: "Does it work on mobile?",
        a: "Yes — mobile is a first-class target. Touch controls, reduced texture sizes and frame-rate monitoring are built in from the start rather than patched in at the end.",
      },
    ],
  },
  {
    slug: "nextjs-laravel-full-stack-development",
    lines: ["Full-stack,", "front to", "back end"],
    heading: "Full-Stack Next.js, TypeScript & Laravel Development",
    metaTitle: "Hire a Senior Next.js & Laravel Full-Stack Developer — TypeScript, MySQL | Hamza Daniyal",
    metaDescription:
      "Senior full-stack development with Next.js App Router, TypeScript, Laravel APIs and MySQL architecture — production platforms engineered end to end with Core Web Vitals optimisation built in.",
    keywords: [...developerKeywords.fullStack, ...developerKeywords.core],
    lede: "Production platforms engineered end to end by one senior engineer — typed Next.js front ends, Laravel services and MySQL schemas designed together, so nothing gets lost between front end and back end.",
    architecture: [
      {
        title: "Next.js App Router",
        copy: "Server Components, streaming and route-level caching keep pages fast by default; client JavaScript is reserved for the interactions that need it.",
      },
      {
        title: "Laravel API layer",
        copy: "Versioned REST APIs, queues, scheduled jobs and admin tooling in Laravel, with authentication and validation handled at the boundary.",
      },
      {
        title: "MySQL data architecture",
        copy: "Relational schemas modelled for the queries you actually run, with indexing, migrations and seed data kept in version control.",
      },
      {
        title: "Core Web Vitals discipline",
        copy: "Performance budgets enforced in CI, image and font strategies set up front, and field data monitored after launch.",
      },
    ],
    deliverables: [
      "Next.js App Router architecture (TypeScript)",
      "Laravel REST APIs, queues & admin panels",
      "MySQL schema design & migrations",
      "Authentication, roles & permissions",
      "Core Web Vitals optimisation",
      "CI/CD, monitoring & handover docs",
    ],
    performance: cwv,
    caseStudies: ["touchpoint", "haprow", "gophygital"],
    faqs: [
      {
        q: "Why one full-stack engineer instead of separate front-end and back-end teams?",
        a: "Fewer hand-offs means fewer gaps. When the same person designs the API and the UI that consumes it, data shapes, caching and error states line up from day one — and decisions happen faster.",
      },
      {
        q: "Can you work on an existing Next.js or Laravel codebase?",
        a: "Yes. I regularly join existing projects to add features, untangle performance problems or migrate older stacks (for example Pages Router to App Router, or legacy PHP to Laravel).",
      },
      {
        q: "Do you work remotely with international teams?",
        a: "Yes — remote-first and async-friendly, working with clients worldwide. Communication runs through your tools (Slack, Linear, Jira, GitHub) with regular written updates.",
      },
      {
        q: "What happens after launch?",
        a: "Every project ends with documentation and a handover. Ongoing support, feature retainers and performance monitoring are available if you want them.",
      },
    ],
  },
  {
    slug: "wordpress-plugin-engineering",
    lines: ["WordPress,", "engineered", "properly"],
    heading: "Custom WordPress Plugin Engineering, Bespoke Themes & Headless WordPress",
    metaTitle: "Custom WordPress Plugin Engineer — Bespoke Themes & Headless WordPress | Hamza Daniyal",
    metaDescription:
      "Custom PHP WordPress plugin engineering, bespoke themes and headless WordPress with GraphQL or REST — clean architecture, secure code and an editor experience your team will actually enjoy.",
    keywords: [...developerKeywords.wordpress, "Senior Full-Stack Developer", "PHP Developer"],
    lede: "WordPress with real software architecture — custom plugins built like products, themes without page-builder bloat, and headless setups that pair the WordPress editor with a modern Next.js front end.",
    architecture: [
      {
        title: "Plugin architecture",
        copy: "Namespaced, autoloaded PHP with clear separation between domain logic, admin UI and WordPress hooks — testable and safe to extend.",
      },
      {
        title: "Bespoke block themes",
        copy: "Custom themes and Gutenberg blocks built from your design system, so editors compose pages from approved components without breaking layouts.",
      },
      {
        title: "Headless WordPress",
        copy: "WordPress as a content API via WPGraphQL or the REST API, feeding a Next.js front end with preview, revalidation and structured SEO data.",
      },
      {
        title: "Security & maintenance",
        copy: "Escaped output, nonces, capability checks and sanitised input as standard, plus an update strategy that keeps core and plugins current.",
      },
    ],
    deliverables: [
      "Custom PHP WordPress plugins",
      "Bespoke themes & Gutenberg blocks",
      "Headless WordPress (WPGraphQL / REST)",
      "Custom post types, fields & integrations",
      "Migrations from page builders or legacy CMSs",
      "Performance & security hardening",
    ],
    performance: cwv,
    caseStudies: ["haprow", "gophygital"],
    faqs: [
      {
        q: "Should we build a custom plugin or use an existing one?",
        a: "If a well-maintained plugin does 90% of what you need, use it. A custom plugin makes sense when your workflow is unique, when you'd otherwise stack several heavy plugins, or when you need an integration nobody has built.",
      },
      {
        q: "Can you move us off a page builder?",
        a: "Yes. I rebuild page-builder layouts as native blocks or theme templates, migrate the content and keep URLs intact so search rankings carry over.",
      },
      {
        q: "When does headless WordPress make sense?",
        a: "When your editors love WordPress but the front end needs to be faster, more interactive or shared with other channels. The editor stays familiar; the site gets the performance of Next.js.",
      },
      {
        q: "Will the plugin be maintainable by another developer?",
        a: "Yes. Code follows WordPress coding standards, is documented, and is handed over in your repository so any competent PHP developer can pick it up.",
      },
    ],
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);
