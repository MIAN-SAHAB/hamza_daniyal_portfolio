/**
 * Single source of truth for all portfolio content.
 * Everything rendered on the site (and in the JSON-LD graph) is read from here.
 */

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hamzadaniyal.com",
  name: "Mian Muhammad Hamza Daniyal",
  shortName: "Hamza Daniyal",
  role: "Senior Full-Stack Developer & Creative Technologist",
  tagline:
    "Senior full-stack developer and creative technologist engineering high-performance web platforms, headless commerce and real-time WebGL experiences.",
  // TODO: replace LinkedIn with the real profile before going live.
  email: "contact@hamzadaniyal.com",
  location: "Pakistan",
  since: 2018,
  socials: [
    { label: "GitHub", handle: "MIAN-SAHAB", href: "https://github.com/MIAN-SAHAB" },
    { label: "LinkedIn", handle: "in/hamzadaniyal", href: "https://www.linkedin.com/in/hamzadaniyal" },
    { label: "Twitch", handle: "tommyvercetti__455", href: "https://www.twitch.tv/tommyvercetti__455" },
    { label: "Discord", handle: "Add me", href: "https://discord.com/users/802958353298227240" },
    { label: "Steam", handle: "IamTommyVercetti", href: "https://steamcommunity.com/id/IamTommyVercetti/" },
  ],
} as const;

/**
 * Games for the /gaming library that Steam can't report on its own — titles
 * played before the account existed, or ones you want listed regardless.
 * Use the Steam store app id (store.steampowered.com/app/<id>/). Hours are optional.
 * With STEAM_API_KEY set, every played game on the account is added automatically.
 */
export const playedGames: { appid: number; name: string; hours?: number }[] = [];

export const steamProfile = {
  vanity: "IamTommyVercetti",
  url: "https://steamcommunity.com/id/IamTommyVercetti/",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Gaming", href: "/gaming" },
  { label: "Contact", href: "/contact" },
] as const;

/** Unsplash CDN helper — royalty-free imagery under the Unsplash License. */
export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  heroWave: unsplash("photo-1558591710-4b4a1ae0f04d"),
  architecture: unsplash("photo-1487958449943-2429e8be8625"),
  towers: unsplash("photo-1511818966892-d7d671e672a2"),
  desk: unsplash("photo-1493934558415-9d19f0b2b4d2"),
  laptopCode: unsplash("photo-1517694712202-14dd9538aa97"),
  codeClose: unsplash("photo-1461749280684-dccba630e2f6"),
  sketch: unsplash("photo-1581291518857-4e27b48ff24e"),
  notebook: unsplash("photo-1517842645767-c639042777db"),
  workspace: unsplash("photo-1498050108023-c5249f4df085"),
  waves: unsplash("photo-1634017839464-5c339ebe3cb4"),
  codeScreen: unsplash("photo-1555066931-4365d14bab8c"),
  product: unsplash("photo-1505740420928-5e560c06d30e"),
} as const;

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  role: string;
  stack: string[];
  image: string;
  imageAlt: string;
  accent: "accent" | "aqua" | "ink";
};

export const projects: Project[] = [
  {
    slug: "touchpoint",
    index: "01",
    title: "TouchPoint",
    kicker: "Digital Revamp",
    summary:
      "A full-scale digital revamp re-architected as a high-performance, interactive web platform — modular content, motion-led storytelling and a front end engineered for speed at every breakpoint.",
    role: "Lead full-stack engineering, front-end architecture, motion system",
    stack: ["Next.js", "TypeScript", "GSAP", "Headless CMS"],
    image: unsplash("photo-1547658719-da2b51169166"),
    imageAlt: "Desktop monitor and tablet displaying responsive interface layouts",
    accent: "accent",
  },
  {
    slug: "beba-yerba",
    index: "02",
    title: "Beba Yerba",
    kicker: "Headless Commerce",
    summary:
      "A custom headless storefront on the Shopify Storefront API with an API-driven store locator and conversion-tuned UI — product storytelling that sells without slowing down.",
    role: "Headless architecture, Storefront API integration, store locator, CRO UI",
    stack: ["Shopify Storefront API", "Next.js", "Tailwind CSS", "Maps API"],
    image: unsplash("photo-1556679343-c7306c1976bc"),
    imageAlt: "Iced yerba mate drink with lime on a dark surface",
    accent: "aqua",
  },
  {
    slug: "3d-configurators",
    index: "03",
    title: "3D Configurators",
    kicker: "Real-time WebGL",
    summary:
      "Real-time product configurators built on Three.js and React Three Fiber — custom lighting rigs, constrained camera controls and bespoke material shaders that respond instantly to every choice.",
    role: "WebGL engineering, shader authoring, scene & performance tuning",
    stack: ["Three.js", "React Three Fiber", "Drei", "GLSL"],
    image: unsplash("photo-1523275335684-37898b6baf30"),
    imageAlt: "Two white smartwatches rendered on a soft grey studio backdrop",
    accent: "ink",
  },
  {
    slug: "haprow",
    index: "04",
    title: "Haprow",
    kicker: "Corporate Platform",
    summary:
      "A corporate digital platform with a bespoke UI system, considered micro-interactions and relentlessly optimised Core Web Vitals — brand precision without the performance tax.",
    role: "UI system engineering, micro-interactions, CWV optimisation",
    stack: ["Laravel", "PHP", "MySQL", "GSAP"],
    image: unsplash("photo-1487958449943-2429e8be8625"),
    imageAlt: "White angular modern architecture against a pale sky",
    accent: "accent",
  },
  {
    slug: "gophygital",
    index: "05",
    title: "GoPhygital",
    kicker: "Client Experience",
    summary:
      "A modern, interactive client experience platform bridging physical and digital touchpoints — fluid interfaces, live states and an architecture built to scale with the business.",
    role: "Full-stack development, interaction design engineering",
    stack: ["React", "Next.js", "Laravel", "REST APIs"],
    image: unsplash("photo-1559028012-481c04fa702d"),
    imageAlt: "Design workstation showing interface mockups on a large display",
    accent: "aqua",
  },
];

export type StackCluster = {
  id: string;
  label: string;
  title: string;
  description: string;
  /** Node anchor in % of the constellation canvas */
  x: number;
  y: number;
  items: { name: string; x: number; y: number }[];
};

export const stackClusters: StackCluster[] = [
  {
    id: "frontend",
    label: "01 — Modern Frontend",
    title: "Interfaces that move with intent",
    description:
      "Type-safe React and Next.js architectures, GSAP-driven motion systems and real-time 3D with Three.js and React Three Fiber.",
    x: 26,
    y: 30,
    items: [
      { name: "Next.js", x: 9, y: 14 },
      { name: "TypeScript", x: 30, y: 9 },
      { name: "React", x: 8, y: 38 },
      { name: "GSAP · ScrollTrigger", x: 38, y: 20 },
      { name: "Three.js / R3F", x: 14, y: 52 },
      { name: "Tailwind CSS", x: 33, y: 44 },
    ],
  },
  {
    id: "backend",
    label: "02 — Backend & Headless",
    title: "Systems that scale quietly",
    description:
      "Laravel and PHP services over MySQL, headless Shopify via the Storefront API and clean, versioned APIs between them.",
    x: 74,
    y: 36,
    items: [
      { name: "Laravel", x: 68, y: 14 },
      { name: "PHP", x: 90, y: 22 },
      { name: "MySQL", x: 92, y: 46 },
      { name: "Shopify Storefront API", x: 74, y: 60 },
    ],
  },
  {
    id: "systems",
    label: "03 — Custom Systems",
    title: "Tools built for the brief",
    description:
      "Custom WordPress platforms and plugin engineering, location services, integrations and performance budgets enforced in code.",
    x: 50,
    y: 74,
    items: [
      { name: "WordPress Engineering", x: 24, y: 84 },
      { name: "Custom Plugins", x: 42, y: 92 },
      { name: "Store Locator APIs", x: 66, y: 88 },
      { name: "Core Web Vitals", x: 82, y: 76 },
    ],
  },
];

export const metrics = [
  { value: 8, suffix: "+", label: "Years shipping production web", note: "Since 2018" },
  { value: 5, suffix: "", label: "Flagship platforms in this folio", note: "Commerce · WebGL · Corporate" },
  { value: 15, suffix: "+", label: "Core technologies, front to back", note: "TS → PHP → GLSL" },
  { value: 100, suffix: "%", label: "Bespoke builds — zero templates", note: "Every pixel argued for" },
];

export const services = [
  {
    index: "01",
    title: "Creative Web & 3D",
    summary:
      "Award-calibre marketing sites and immersive WebGL — scroll-scrubbed narratives, real-time product configurators and shader-driven brand moments.",
    deliverables: ["Scroll-led storytelling", "Three.js / R3F scenes", "Product configurators", "Motion systems"],
    stack: ["GSAP", "Three.js", "React Three Fiber", "Drei", "GLSL"],
    image: images.waves,
  },
  {
    index: "02",
    title: "Full-Stack Next.js & Laravel",
    summary:
      "Production platforms engineered end to end — typed Next.js front ends, Laravel services, MySQL schemas and the CI discipline to keep them fast.",
    deliverables: ["App Router architecture", "Laravel APIs & admin", "Data modelling", "Performance budgets"],
    stack: ["Next.js", "TypeScript", "Laravel", "PHP", "MySQL"],
    image: images.codeScreen,
  },
  {
    index: "03",
    title: "Headless Commerce",
    summary:
      "Shopify Storefront API builds that outrun themes — bespoke PDPs, API-driven store locators and conversion UI tuned against real behaviour.",
    deliverables: ["Storefront API builds", "Custom cart & checkout flows", "Store locators", "CRO-led UI"],
    stack: ["Shopify Storefront API", "Next.js", "Tailwind CSS", "Edge caching"],
    image: images.product,
  },
  {
    index: "04",
    title: "WordPress & Plugin Engineering",
    summary:
      "Custom WordPress done properly — bespoke themes, plugins with real architecture, and headless setups when the editor experience matters.",
    deliverables: ["Custom themes", "Plugin development", "Headless WordPress", "Migrations"],
    stack: ["PHP", "WordPress", "MySQL", "REST / GraphQL"],
    image: images.notebook,
  },
];

export const workflow = [
  { step: "01", title: "Discover", copy: "Interrogate the brief, the audience and the constraints until the real problem is on the table." },
  { step: "02", title: "Architect", copy: "Choose the stack, model the data and set performance budgets before a single component exists." },
  { step: "03", title: "Craft", copy: "Build in tight loops — motion, interaction and accessibility designed and engineered together." },
  { step: "04", title: "Ship & Tune", copy: "Launch behind real metrics, then refine Core Web Vitals and conversion with evidence, not guesses." },
];

export const milestones = [
  { year: "2018", title: "First production code", copy: "Started shipping PHP and custom WordPress builds for real clients — learning that fast and maintainable are the same goal." },
  { year: "2019", title: "Plugin engineering", copy: "Moved from themes to architecture: bespoke WordPress plugins, custom post systems and integrations." },
  { year: "2020", title: "Laravel & MySQL", copy: "Took on full back-end ownership — Laravel services, relational modelling and admin tooling." },
  { year: "2021", title: "React & Next.js", copy: "Rebuilt my front-end practice around React, TypeScript and Next.js with motion as a first-class concern." },
  { year: "2022", title: "Headless commerce", copy: "Decoupled storefronts on the Shopify Storefront API — custom UI, locators and conversion work." },
  { year: "2023", title: "Real-time 3D", copy: "Brought Three.js and React Three Fiber into client work: configurators, lighting rigs and shaders." },
  { year: "2024+", title: "Senior & creative technologist", copy: "Leading platforms like TouchPoint, Haprow and GoPhygital end to end — strategy, systems and craft." },
];

export const principles = [
  { title: "Performance is a feature", copy: "Motion and fidelity are only impressive when the page is fast. Budgets come first." },
  { title: "Systems over pages", copy: "Every build leaves behind tokens, components and conventions the next team can trust." },
  { title: "Craft is the brief", copy: "The last 10% — easing curves, focus states, empty states — is where quality is felt." },
];
