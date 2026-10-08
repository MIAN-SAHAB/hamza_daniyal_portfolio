"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";
import LocalTime from "./LocalTime";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 160 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay on navigation and on Escape.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        menuRef.current,
        { clipPath: "circle(0% at 100% 0%)" },
        { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" },
      );
      gsap.from("[data-menu-item]", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.25 });
    },
    { dependencies: [open], scope: menuRef },
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.startsWith("/#") && pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[120] -translate-y-24 bg-ink px-4 py-2 text-sm text-white focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-expo ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 py-4 text-ink transition-colors duration-500 md:px-10 md:py-5 ${
            scrolled && !open ? "bg-bone/80 backdrop-blur-md" : ""
          }`}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-8 text-[0.8125rem] uppercase tracking-[0.14em]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-underline relative py-1 aria-[current=page]:text-vermilion"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="flex items-center gap-2 border-l border-ink/15 pl-8 text-micro uppercase tracking-[0.18em] text-graphite">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-vermilion text-vermilion" />
              <LocalTime />
            </span>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            data-cursor={open ? "Close" : "Menu"}
            className="relative z-10 flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.14em] md:hidden"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-4 pb-8 pt-28 md:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <Link
                    data-menu-item
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 font-display text-huge uppercase text-ink"
                  >
                    <span className="font-sans text-micro tracking-[0.2em] text-vermilion">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-end justify-between text-sm">
            <a href={`mailto:${site.email}`} className="link-underline text-ink">
              {site.email}
            </a>
            <span className="text-micro uppercase tracking-[0.18em]">
              <LocalTime />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
