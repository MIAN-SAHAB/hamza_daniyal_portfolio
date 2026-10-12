/** Google Analytics 4 measurement ID (Google tag). */
export const GA_ID = "G-20KYWGG9EH";

/**
 * Inline gtag stub, placed first in <head>: defines `dataLayer`/`gtag` and
 * queues the page view immediately (a few bytes, no network). Anything queued
 * here — or sent later with `gtag(...)` — is replayed once gtag.js arrives.
 */
export const gtagBootScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`;
