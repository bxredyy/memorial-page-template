"use client";

import { useRef, useState } from "react";
import Reveal from "./Reveal";

/* The file keeps the existing data arrays. This patch reduces prompt card widths on mobile
   and makes the carousel scrolling robust by computing a delta from the container width. */

export default function MemoriesView() {
  return (
    <div className="space-y-20">
      <GuestbookMini compact />
      <PromptCarousel />
      <MemoriesHeader count={12} />
      <MemoriesMasonry />
      <ViewMoreButton />
      <GuestbookMini />
    </div>
  );
}

function PromptCarousel() {
  const trackRef = useRef(null);

  const scrollByDelta = (mult = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const visible = el.clientWidth || window.innerWidth;
    const delta = Math.round(visible * 0.75) * mult;
    const max = Math.max(el.scrollWidth - visible, 0);
    const target = Math.min(Math.max(el.scrollLeft + delta, 0), max);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <Reveal className="relative -mx-6 md:-mx-14">
      <button onClick={() => scrollByDelta(-1)} aria-label="Scroll prompts left" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button onClick={() => scrollByDelta(1)} aria-label="Scroll prompts right" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div ref={trackRef} className="scrollbar-hidden overflow-x-auto scroll-smooth">
        <div className="flex items-stretch gap-5 px-6 md:px-14 py-6">
          {prompts.map((p, i) => <PromptCard key={i} {...p} />)}
        </div>
      </div>
    </Reveal>
  );
}

/* PromptCard widths adjusted: mobile w-[240px] / md:w-[260-280px] to avoid overflow */
