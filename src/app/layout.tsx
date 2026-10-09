import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/seo";
import { introBootScript } from "@/lib/intro-boot";

const nevera = localFont({
  src: "../../public/assets/fonts/Nevera-Regular.otf",
  variable: "--font-nevera",
  weight: "400",
  display: "swap",
});

const haas = localFont({
  src: "../../public/assets/fonts/neuehaasgrot.otf",
  variable: "--font-haas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.tagline,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Hamza Daniyal",
    "Senior Full-Stack Developer",
    "Creative Technologist",
    "Next.js developer",
    "Three.js",
    "React Three Fiber",
    "GSAP",
    "Laravel",
    "Headless Shopify",
    "WordPress plugin development",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F4FF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nevera.variable} ${haas.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-svh">
        <Preloader />
        <Header />
        {children}
        <Footer />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
