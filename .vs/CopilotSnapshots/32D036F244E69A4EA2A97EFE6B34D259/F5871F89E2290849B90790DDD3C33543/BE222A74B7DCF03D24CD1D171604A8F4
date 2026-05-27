"use client";

import { useRef } from "react";
import Reveal from "./Reveal";

const photos = [
  { src: "https://picsum.photos/seed/evelyn-1/520/680",  size: "md",   tilt: -3, drop: 28, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-2/520/700",  size: "lg",   tilt:  2, drop: 70, tone: "warm", frame: true  },
// ... rest unchanged ...
];

const SIZE_MAP = {
  lg:   { w: 300, h: 400 },
  md:   { w: 220, h: 280 },
  sm:   { w: 180, h: 230 },
  wide: { w: 320, h: 220 },
};

const TONE_CLASS = {
  bw:   "grayscale",
  warm: "vintage",
  mute: "grayscale opacity-80",
};

export default function Gallery() {
  const trackRef = useRef(null);

  const scrollNext = () => {
    const el = trackRef.current;
    if (!el) return;
    const visible = el.clientWidth || window.innerWidth;
    const delta = Math.round(visible * 0.75);
    const maxScroll = el.scrollWidth - visible;
    const target = Math.min(el.scrollLeft + delta, maxScroll);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollPrev = () => {
    const el = trackRef.current;
    if (!el) return;
    const visible = el.clientWidth || window.innerWidth;
    const delta = Math.round(visible * 0.75);
    const target = Math.max(el.scrollLeft - delta, 0);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section id="memories" className="relative min-h-screen flex flex-col justify-center bg-cream-100 pt-10 pb-20 scroll-mt-20">
      <Reveal as="header" className="text-center mb-12 px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">A life in photographs</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink-900">Moments of [Name]</h2>
        <p className="mt-3 text-ink-700 max-w-xl mx-auto text-[15px]">
          Scroll through cherished memories â€” each photo a small chapter of the life he shared with us.
        </p>
      </Reveal>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[40px] h-px bg-gradient-to-r from-transparent via-ink-900/25 to-transparent" />

        <button
          onClick={scrollPrev}
          aria-label="Scroll left"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          aria-label="Scroll right"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div ref={trackRef} className="scrollbar-hidden overflow-x-auto scroll-smooth" >
          <div className="flex items-start gap-10 px-6 md:px-16 pt-16 pb-10 md:min-h-[600px]">
            <ContributionCard />
            {photos.map((p, i) => (
              <Photo key={i} {...p} index={i} />
            ))}
            <ShareCard />
          </div>
        </div>
      </div>

      <p className="text-center mt-8 text-[12px] text-ink-500">
        <a href="#" className="underline-offset-4 hover:underline">Turn [Name]'s Photo Book Into a Book</a>
        <br />
        <span className="text-[11px] tracking-wide">Save treasured memories preserved by [DEMO BRAND NAME]</span>
      </p>
    </section>
  );
}
