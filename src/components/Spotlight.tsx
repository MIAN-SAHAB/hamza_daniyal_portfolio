"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { closeOverlay, lockScroll, openOverlay, useOverlay } from "@/lib/ui";
import { nav, projects, services, site } from "@/lib/site";

type Item = {
  id: string;
  group: "Pages" | "Projects" | "Services" | "Actions" | "Socials";
  label: string;
  hint: string;
  keywords?: string;
  run: () => void | Promise<void>;
};

/** Full document navigation, matching AppLink. */
const go = (href: string) => window.location.assign(href);

const PAGE_HINTS: Record<string, string> = {
  "/": "Start here",
  "/work": "Selected case studies",
  "/services": "What I build",
  "/about": "Journey since 2018",
  "/gaming": "Off the clock, on the server",
  "/contact": "Start a project",
};

const ITEMS: Item[] = [
  ...nav.map((n) => ({
    id: `page-${n.href}`,
    group: "Pages" as const,
    label: n.label,
    hint: PAGE_HINTS[n.href] ?? "",
    run: () => go(n.href),
  })),
  ...projects.map((p) => ({
    id: `project-${p.slug}`,
    group: "Projects" as const,
    label: p.title,
    hint: p.kicker,
    keywords: p.stack.join(" "),
    run: () => go(`/work#${p.slug}`),
  })),
  ...services.map((s) => ({
    id: `service-${s.index}`,
    group: "Services" as const,
    label: s.title,
    hint: s.stack.slice(0, 3).join(" · "),
    keywords: s.deliverables.join(" "),
    run: () => go("/services"),
  })),
  {
    id: "action-email",
    group: "Actions",
    label: "Copy email address",
    hint: site.email,
    keywords: "mail contact hire",
    run: async () => {
      await navigator.clipboard?.writeText(site.email).catch(() => undefined);
    },
  },
  { id: "action-mail", group: "Actions", label: "Send an email", hint: site.email, keywords: "mail contact", run: () => go(`mailto:${site.email}`) },
  { id: "action-call", group: "Actions", label: "Call me", hint: site.phone.display, keywords: "phone call number", run: () => go(site.phone.href) },
  { id: "action-brief", group: "Actions", label: "Start a project", hint: "Send a brief", keywords: "hire contact", run: () => go("/contact") },
  ...site.socials.map((s) => ({
    id: `social-${s.label}`,
    group: "Socials" as const,
    label: `Open ${s.label}`,
    hint: s.handle,
    run: () => void window.open(s.href, "_blank", "noopener,noreferrer"),
  })),
];

function score(item: Item, q: string) {
  if (!q) return 1;
  const hay = `${item.label} ${item.hint} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.every((t) => hay.includes(t))) return 0;
  return item.label.toLowerCase().startsWith(terms[0]) ? 2 : 1;
}

/** ⌘K / Ctrl+K command palette for pages, projects, services and quick actions. */
export default function Spotlight() {
  const overlay = useOverlay();
  const open = overlay === "spotlight";
  const listId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);

  // Keep the grouped order; within a group, prefix matches float to the top.
  const results = useMemo(() => {
    const order = ["Pages", "Projects", "Services", "Actions", "Socials"];
    return ITEMS.map((i) => ({ i, s: score(i, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => order.indexOf(a.i.group) - order.indexOf(b.i.group) || b.s - a.s)
      .map((r) => r.i);
  }, [query]);

  // Global shortcuts: ⌘K / Ctrl+K toggles, "/" opens when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openOverlay(open ? "none" : "spotlight");
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openOverlay("spotlight");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    lockScroll(open);
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(panel.current, { y: -24, scale: 0.96, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" });
      gsap.fromTo("[data-backdrop]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    },
    { dependencies: [open] },
  );

  if (!open) return null;

  const close = () => {
    setQuery("");
    setActive(0);
    closeOverlay();
  };

  const run = async (item: Item | undefined) => {
    if (!item) return;
    await item.run();
    if (item.id === "action-email") {
      setFlash("Email copied ✓");
      setTimeout(() => setFlash(null), 1400);
      return;
    }
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Spotlight search">
      <div data-backdrop className="absolute inset-0 bg-[#160b33]/55 backdrop-blur-md" onClick={close} />

      <div
        ref={panel}
        className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_50px_120px_-30px_rgba(27,20,70,0.6)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20 L16.5 16.5" />
          </svg>
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, projects, services…"
            className="flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-graphite/60 focus-visible:outline-none"
          />
          <kbd className="rounded-md border border-ink/15 px-2 py-0.5 text-[0.6875rem] text-graphite">ESC</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-10 text-center text-graphite">No matches — try &ldquo;commerce&rdquo; or &ldquo;3D&rdquo;.</li>}
          {results.map((item, idx) => {
            const header = idx === 0 || results[idx - 1].group !== item.group ? item.group : null;
            const selected = idx === active;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-micro uppercase tracking-[0.2em] text-graphite">{header}</p>}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  onMouseMove={() => setActive(idx)}
                  onClick={() => run(item)}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors ${
                    selected ? "bg-gradient-to-r from-accent to-aqua text-white" : "text-ink"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className={`truncate text-sm ${selected ? "text-white/85" : "text-graphite"}`}>{item.hint}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3 text-[0.75rem] text-graphite">
          <span>
            <kbd className="font-sans">↑↓</kbd> navigate · <kbd className="font-sans">↵</kbd> open
          </span>
          <span role="status" className="text-accent">
            {flash ?? "⌘K anywhere"}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Header trigger. */
export function SpotlightButton() {
  return (
    <button
      type="button"
      onClick={() => openOverlay("spotlight")}
      aria-label="Open search (Ctrl or Command + K)"
      className="flex items-center gap-3 rounded-full border border-ink/15 bg-white/70 py-2 pl-3 pr-2 text-[0.8125rem] text-graphite backdrop-blur-md transition-colors hover:border-accent hover:text-ink"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20 L16.5 16.5" />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="rounded-md bg-ink/5 px-1.5 py-0.5 font-sans text-[0.6875rem]">⌘K</kbd>
    </button>
  );
}
