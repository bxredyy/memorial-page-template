"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "obituary", label: "Obituary" },
  { id: "memories", label: "Memories" },
  { id: "events", label: "Events" },
];

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 border-b transition-all duration-500 ease-out ${
        scrolled
          ? "h-16 bg-cream-100/90 backdrop-blur-md border-sage-200/60 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.18)]"
          : "h-14 bg-sage-400/95 backdrop-blur-sm border-sage-500/30"
      }`}
    >
      <div className="h-full max-w-[1500px] mx-auto px-8 flex items-center justify-between">
        {/* Left: brand initial only after scroll */}
        <div
          className={`font-script text-2xl text-copper-500 transition-all duration-500 ${
            scrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          N
        </div>

        {/* Center: nav appears on scroll */}
        <nav
          aria-label="Memorial sections"
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-700 ease-out ${
            scrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-5 py-2 text-[12px] uppercase tracking-[0.25em] text-ink-800 hover:text-sage-700 transition-colors relative group"
              style={{ transitionDelay: scrolled ? `${i * 60}ms` : "0ms" }}
            >
              <span className="relative">
                {item.label}
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-sage-500 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </a>
          ))}
        </nav>

        {/* Right: Submit Login persists in both states */}
        <a
          href="#"
          className={`text-[11px] uppercase tracking-[0.22em] transition-colors duration-500 ${
            scrolled
              ? "text-ink-700 hover:text-ink-900"
              : "text-white/90 hover:text-white"
          }`}
        >
          Submit Login
        </a>
      </div>
    </header>
  );
}
