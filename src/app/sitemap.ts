import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo-config";
import { projects, services } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
  url: absoluteUrl(path),
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1.0, "weekly"),
    entry("/services", 0.9),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.9)),
    entry("/work", 0.85),
    ...projects.map((p) => entry(`/work/${p.slug}`, 0.85)),
    entry("/gaming", 0.85, "weekly"),
    entry("/about", 0.8),
    entry("/contact", 0.8),
  ];
}
