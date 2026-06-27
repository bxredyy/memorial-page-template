"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { useMemorial } from "./MemorialContext";

export default function Hero() {
  const m = useMemorial();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Map scroll 0 → 320 into opacity 1 → 0 and translateY 0 → -28
  const t = Math.min(scrollY / 320, 1);
  const portraitStyle = {
    opacity: 1 - t,
    transform: `translate(-50%, ${-t * 28}px) scale(${1 - t * 0.08})`,
    transition: "opacity 120ms linear, transform 120ms linear",
    willChange: "opacity, transform",
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-20 pb-16 bg-cream-100">
      {/* Avatar — ABOVE the fixed nav, fades on scroll */}
      <div
        className="fixed left-1/2 top-2 z-[60]"
        style={portraitStyle}
        aria-hidden={t > 0.95}
      >
        <div className="w-[88px] h-[88px] rounded-full ring-4 ring-cream-100 overflow-hidden shadow-xl bg-cream-200">
          <img
            src={m.portrait_image_url || "/images/hero-portrait.jpg"}
            alt={`Portrait of ${m.fullName}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Stage: hero photo with feathered edges */}
      <Reveal className="relative w-full max-w-[920px] mx-auto px-6 mt-12">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 45%, transparent 78%)",
            maskImage:
              "radial-gradient(ellipse at center, black 45%, transparent 78%)",
          }}
        >
          <img
            src={m.hero_image_url || "/images/hero-bg.jpg"}
            alt={m.fullName}
            className="w-full h-full object-cover object-top hero-drift"
          />
        </div>

        {/* Name + dates layered over bottom of hero image */}
        <div className="relative -mt-20 text-center">
          <h1
            className="font-script text-[clamp(72px,9vw,140px)] leading-none text-copper-500"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}
          >
            {m.fullName}
          </h1>

          <Reveal delay={150} className="mt-6 flex items-center justify-center gap-6 text-ink-700">
            <span className="font-display text-2xl tracking-[0.18em]">{m.birthYear || "—"}</span>
            <FloralDots />
            <span className="font-display text-2xl tracking-[0.18em]">{m.deathYear || "—"}</span>
          </Reveal>

          {(m.birthDateLong || m.deathDateLong) && (
            <Reveal delay={300} as="p" className="mt-6 text-[15px] md:text-base text-ink-700 leading-relaxed max-w-xl mx-auto">
              {m.name} was born on {m.birthDateLong} and passed away on
              <br />
              {m.deathDateLong}
              {m.age != null && ` at the age of ${m.age}`}
            </Reveal>
          )}
        </div>
      </Reveal>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-ink-500">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="mt-1 text-[10px] uppercase tracking-[0.3em]">Scroll Down</span>
      </div>
    </section>
  );
}

function FloralDots() {
  return (
    <svg width="64" height="20" viewBox="0 0 64 20" fill="none" aria-hidden="true">
      <circle cx="14" cy="10" r="2.5" fill="#9DB096" />
      <circle cx="24" cy="10" r="1.8" fill="#C9A77C" />
      <circle cx="32" cy="10" r="3" fill="#86997D" />
      <circle cx="40" cy="10" r="1.8" fill="#C9A77C" />
      <circle cx="50" cy="10" r="2.5" fill="#9DB096" />
    </svg>
  );
}
