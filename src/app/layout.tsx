import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { allDeveloperKeywords, BASE_URL } from "@/lib/seo-config";
import { globalGraph } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { introBootScript } from "@/lib/intro-boot";
import GoogleTag from "@/components/GoogleTag";
import { gtagBootScript } from "@/lib/gtag";

// Only production builds report to Google Analytics (keeps `next dev` traffic out).
const analytics = process.env.NODE_ENV === "production";

const nevera = localFont({
  src: "../../public/assets/fonts/Nevera-Regular.woff2",
  variable: "--font-nevera",
  weight: "400",
  display: "swap",
});

const haas = localFont({
  src: "../../public/assets/fonts/neuehaasgrot.woff2",
  variable: "--font-haas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.tagline,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: allDeveloperKeywords,
  // No site-wide canonical: every route sets its own via constructMetadata().
  openGraph: {
    type: "profile",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    locale: "en_US",
    firstName: "Hamza",
    lastName: "Daniyal",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F4FF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nevera.variable} ${haas.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) — stub first in <head>; gtag.js itself is loaded late by <GoogleTag /> */}
        {analytics && <script dangerouslySetInnerHTML={{ __html: gtagBootScript }} />}
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <noscript>
          <style>{`[data-hero]{visibility:visible!important;animation:none!important}[data-preloader]{display:none!important}`}</style>
        </noscript>
        <JsonLd id="ld-global" data={globalGraph()} />
      </head>
      <body className="min-h-svh">
        <Preloader />
        <Header />
        {children}
        <Footer />
        <div className="grain" aria-hidden />
        {analytics && <GoogleTag />}
      </body>
    </html>
  );
}
