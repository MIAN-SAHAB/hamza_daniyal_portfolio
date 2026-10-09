"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Email address as a real mailto: link, plus a small copy-to-clipboard button
 * for people without a configured mail client.
 */
export default function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <span className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <a href={`mailto:${site.email}`} className="link-underline">
        {site.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title={copied ? "Copied!" : "Copy"}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-current px-2.5 text-[0.6875rem] uppercase tracking-[0.14em] opacity-80 transition-opacity hover:opacity-100"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {copied ? (
            <path d="M5 12l5 5L20 7" />
          ) : (
            <>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </>
          )}
        </svg>
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </span>
  );
}

/** Phone number as a tap-to-call link. */
export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a href={site.phone.href} className={`link-underline ${className}`}>
      {site.phone.display}
    </a>
  );
}
