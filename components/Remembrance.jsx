"use client";

import Reveal from "./Reveal";
import { useMemorial } from "./MemorialContext";

export default function Remembrance() {
  const m = useMemorial();
  // Use up to 5 real photos in the fan; fall back to the design placeholders.
  const realPhotos = (m.photos || []).slice(0, 5).map((p) => p.url).filter(Boolean);
  const fan = fanLayout.map((layout, i) => ({
    ...layout,
    src: realPhotos[i] || `https://picsum.photos/seed/fan-${i + 1}/320/400`,
  }));

  return (
    <section className="relative min-h-[90vh] bg-cream-100 py-20 px-6 flex flex-col items-center">
      <Reveal className="text-[11px] uppercase tracking-[0.4em] text-sage-600">
        In Remembrance Of
      </Reveal>
      <Reveal as="h2" delay={120} className="mt-3 font-script text-6xl md:text-7xl text-copper-500">
        {m.fullName}
      </Reveal>

      {/* Fanned photos */}
      <Reveal delay={240} className="relative mt-12 h-[280px] w-full max-w-3xl flex items-center justify-center">
        {fan.map((p, i) => (
          <FanPhoto key={i} {...p} />
        ))}
      </Reveal>

      <Reveal delay={400} className="mt-auto pt-20 text-center">
        <p className="text-[12px] uppercase tracking-[0.3em] text-ink-500">
          This page is preserved by [DEMO BRAND NAME]
        </p>
        <button className="mt-6 inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.22em] px-7 py-3 rounded-full transition shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>
          </svg>
          Share Memories
        </button>
      </Reveal>
    </section>
  );
}

const fanLayout = [
  { rotate: -18, x: -240, z: 1, scale: 0.9 },
  { rotate: -9,  x: -130, z: 2, scale: 0.95 },
  { rotate: 0,   x: 0,    z: 4, scale: 1.05 },
  { rotate: 9,   x: 130,  z: 2, scale: 0.95 },
  { rotate: 18,  x: 240,  z: 1, scale: 0.9 },
];

function FanPhoto({ src, rotate, x, z, scale }) {
  return (
    <div
      className="absolute bg-white p-2 pb-6 shadow-polaroid transition-transform duration-500 hover:scale-110"
      style={{
        transform: `translateX(${x}px) rotate(${rotate}deg) scale(${scale})`,
        zIndex: z,
      }}
    >
      <img src={src} alt="" className="w-[160px] h-[200px] object-cover vintage grayscale" />
    </div>
  );
}
