"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

/** Click-to-copy email with a rolling label swap. Falls back to mailto if the clipboard is blocked. */
export default function CopyEmail({ className = "" }: { className?: string }) {
  const root = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const { contextSafe } = useGSAP({ scope: root });

  const roll = contextSafe(() => {
    gsap.fromTo("[data-roll]", { yPercent: 0 }, { yPercent: -100, duration: 0.6, ease: "expo.inOut" });
  });
  const unroll = contextSafe(() => {
    gsap.to("[data-roll]", { yPercent: 0, duration: 0.6, ease: "expo.inOut" });
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      roll();
      setTimeout(() => {
        unroll();
        setCopied(false);
      }, 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <button
      ref={root}
      type="button"
      onClick={copy}
      aria-label={`Copy email address ${site.email}`}
      className={`group relative inline-flex items-center gap-3 text-left ${className}`}
    >
      <span className="relative block h-[1.3em] overflow-hidden">
        <span data-roll className="block">
          <span className="block h-[1.3em] link-underline">{site.email}</span>
          <span className="block h-[1.3em] text-accent">Copied to clipboard ✓</span>
        </span>
      </span>
      <span
        aria-hidden
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs transition-transform duration-500 ease-expo group-hover:rotate-45"
      >
        ↗
      </span>
      <span role="status" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
