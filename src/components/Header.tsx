"use client";

import Link from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import MenuOverlay, { MenuButton } from "./MenuOverlay";
import Spotlight, { SpotlightButton } from "./Spotlight";

const DARK_HERO_ROUTES = ["/gaming"];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Routes whose hero sits on a dark stage get a light header until you scroll.
  const darkHero = DARK_HERO_ROUTES.includes(usePathname());

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-expo ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div
          className={`flex items-center justify-between gap-3 px-4 py-4 transition-colors duration-500 md:px-10 md:py-5 ${
            scrolled ? "bg-bone/75 text-ink backdrop-blur-md" : darkHero ? "text-white" : "text-ink"
          }`}
        >
          <Logo />
          <div className="flex items-center gap-2 md:gap-3">
            <SpotlightButton />
            <Link
              href="/contact"
              className="hidden rounded-full bg-gradient-to-r from-accent to-aqua px-5 py-2.5 text-[0.8125rem] uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_-14px_rgba(122,60,255,0.9)] transition-transform duration-500 ease-expo hover:-translate-y-0.5 md:inline-block"
            >
              Let&rsquo;s talk
            </Link>
            <MenuButton />
          </div>
        </div>
      </header>

      <MenuOverlay />
      <Spotlight />
    </>
  );
}
