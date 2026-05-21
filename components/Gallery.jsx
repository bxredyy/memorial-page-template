"use client";

import { useRef } from "react";
import Reveal from "./Reveal";

// Sizes: lg = 300x400, md = 220x280, sm = 180x230, wide = 320x220
// Tone: bw (full grayscale), warm (vintage only), mute (low contrast)
// Frame: true = polaroid, false = naked photo
const photos = [
  { src: "https://picsum.photos/seed/evelyn-1/520/680",  size: "md",   tilt: -3, drop: 28, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-2/520/700",  size: "lg",   tilt:  2, drop: 70, tone: "warm", frame: true  },
  { src: "https://picsum.photos/seed/evelyn-3/440/560",  size: "sm",   tilt: -2, drop: 14, tone: "bw",   frame: false },
  { src: "https://picsum.photos/seed/evelyn-4/640/440",  size: "wide", tilt:  1, drop: 90, tone: "mute", frame: true  },
  { src: "https://picsum.photos/seed/evelyn-5/460/640",  size: "md",   tilt: -3, drop: 42, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-6/420/560",  size: "sm",   tilt:  4, drop: 18, tone: "warm", frame: true  },
  { src: "https://picsum.photos/seed/evelyn-7/520/700",  size: "lg",   tilt: -1, drop: 60, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-8/440/560",  size: "sm",   tilt:  2, drop: 22, tone: "mute", frame: false },
  { src: "https://picsum.photos/seed/evelyn-9/640/440",  size: "wide", tilt: -2, drop: 80, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-10/460/620", size: "md",   tilt:  1, drop: 30, tone: "warm", frame: true  },
  { src: "https://picsum.photos/seed/evelyn-11/440/580", size: "sm",   tilt: -3, drop: 12, tone: "bw",   frame: false },
  { src: "https://picsum.photos/seed/evelyn-12/520/700", size: "lg",   tilt:  2, drop: 66, tone: "bw",   frame: true  },
  { src: "https://picsum.photos/seed/evelyn-13/440/580", size: "md",   tilt: -1, drop: 36, tone: "warm", frame: true  },
  { src: "https://picsum.photos/seed/evelyn-14/420/560", size: "sm",   tilt:  3, drop: 20, tone: "mute", frame: true  },
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

  const scrollBy = (delta) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="memories" className="relative min-h-screen flex flex-col justify-center bg-cream-100 pt-10 pb-20 scroll-mt-20">
      <Reveal as="header" className="text-center mb-12 px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-sage-600">
          A life in photographs
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink-900">
          Moments of [Name]
        </h2>
        <p className="mt-3 text-ink-700 max-w-xl mx-auto text-[15px]">
          Scroll through cherished memories — each photo a small chapter of the
          life she shared with us.
        </p>
      </Reveal>

      <div className="relative">
        {/* Hanging rail */}
        <div className="absolute left-0 right-0 top-[40px] h-px bg-gradient-to-r from-transparent via-ink-900/25 to-transparent" />

        {/* Nav arrows */}
        <button
          onClick={() => scrollBy(-600)}
          aria-label="Scroll left"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scrollBy(600)}
          aria-label="Scroll right"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="scrollbar-hidden overflow-x-auto scroll-smooth"
        >
          <div className="flex items-start gap-10 px-16 pt-16 pb-10 min-h-[600px]">
            <ContributionCard />

            {photos.map((p, i) => (
              <Photo key={i} {...p} index={i} />
            ))}

            <ShareCard />
          </div>
        </div>
      </div>

      <p className="text-center mt-8 text-[12px] text-ink-500">
        <a href="#" className="underline-offset-4 hover:underline">
          Turn [Name]'s Photo Book Into a Book
        </a>
        <br />
        <span className="text-[11px] tracking-wide">
          Save treasured memories preserved by [DEMO BRAND NAME]
        </span>
      </p>
    </section>
  );
}

function Photo({ src, size, tilt, drop, tone, frame, index }) {
  const { w, h } = SIZE_MAP[size];
  const toneCls = TONE_CLASS[tone];

  if (!frame) {
    // Naked photograph — no polaroid frame, soft shadow only
    return (
      <div
        className="pin relative shrink-0"
        style={{
          marginTop: `${drop}px`,
          transform: `rotate(${tilt}deg)`,
          zIndex: index,
        }}
      >
        <div className="shadow-polaroid hover:rotate-0 hover:scale-105 transition-transform duration-500">
          <img
            src={src}
            alt={`Memory ${index + 1}`}
            style={{ width: w, height: h }}
            className={`object-cover ${toneCls}`}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="pin relative shrink-0"
      style={{
        marginTop: `${drop}px`,
        transform: `rotate(${tilt}deg)`,
        zIndex: index,
      }}
    >
      <div className="bg-white p-3 pb-10 shadow-polaroid hover:scale-105 hover:rotate-0 transition-transform duration-500">
        <img
          src={src}
          alt={`Memory ${index + 1}`}
          style={{ width: w, height: h }}
          className={`object-cover ${toneCls}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}

function ContributionCard() {
  return (
    <div className="pin relative shrink-0" style={{ marginTop: "32px" }}>
      <button className="bg-sage-500 hover:bg-sage-600 text-white p-3 pb-10 shadow-polaroid transition group">
        <div className="w-[200px] h-[260px] flex flex-col items-center justify-center gap-4 border border-white/40 rounded-sm">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center px-4">
            <p className="font-display text-lg leading-snug">Upload Photos<br/>of [Name]</p>
          </div>
        </div>
      </button>
    </div>
  );
}

function ShareCard() {
  return (
    <div className="pin relative shrink-0" style={{ marginTop: "48px" }}>
      <div className="bg-white p-5 pb-8 shadow-polaroid w-[300px]">
        <div className="w-full aspect-square bg-gradient-to-br from-cream-200 to-sage-100 rounded-sm flex flex-col items-center justify-center px-5 text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-sage-600 mb-3">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-display text-xl text-ink-900 leading-tight">
            Share Your Photos<br/>of [Name]
          </p>
          <p className="mt-2 text-[12px] text-ink-700 leading-relaxed">
            Add a moment to their story. Every photograph helps the family remember the person they loved.
          </p>
          <button className="mt-4 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.18em] px-5 py-2 rounded-sm transition">
            Contribute
          </button>
        </div>
      </div>
    </div>
  );
}
