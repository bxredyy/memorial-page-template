"use client";

import Reveal from "./Reveal";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const bearers = {
  casket: ["[Pallbearer Name]", "[Pallbearer Name]", "[Pallbearer Name]", "[Pallbearer Name]"],
  honorary: ["[Honorary Pallbearer]", "[Honorary Pallbearer]", "[Honorary Pallbearer]"],
  flower: ["[Flower Bearer]", "[Flower Bearer]", "[Flower Bearer]"],
};

const orderOfService = [
  { role: "Opening Prayer", person: "[Officiant Name]" },
  { role: "Life Sketch", person: "[Speaker Name]" },
  { role: "Musical Number", person: "[Vocalist Name]", note: "“[Song Title]” — [Artist Name]" },
  { role: "Speaker", person: "[Speaker Name]" },
  { role: "Speaker", person: "[Speaker Name]" },
  { role: "Closing Prayer", person: "[Officiant Name]" },
  { role: "Concluding Remarks", person: "[Speaker Name]" },
];

const leftPortraits = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=14",
  "https://i.pravatar.cc/120?img=32",
  "https://i.pravatar.cc/120?img=45",
];

const rightPortraits = [
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=55",
  "https://i.pravatar.cc/120?img=39",
  "https://i.pravatar.cc/120?img=58",
];

/* ─────────────────────────────── ROOT ─────────────────────────────── */

export default function EventsView() {
  return (
    <div className="pt-10 pb-10">

      {/* ── Two-column program grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-16">
        <Reveal>
          <BearersColumn />
        </Reveal>
        <Reveal delay={110}>
          <OrderOfServiceColumn />
        </Reveal>
      </div>

      {/* ── Divider ── */}
      <Reveal className="divider-line my-14" />

      {/* ── Service info + video ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 items-center">
        <Reveal>
          <ServiceInfo />
        </Reveal>
        <Reveal delay={100}>
          <ServiceVideo />
        </Reveal>
      </div>

    </div>
  );
}

/* ─────────────────────────── BEARERS COLUMN ───────────────────────── */

function BearersColumn() {
  return (
    <div className="text-center">
      <BookIllustration portraits={leftPortraits} />
      <div className="divider-line mt-7 mb-7" />
      <BearerGroup title="Casket-Bearers" names={bearers.casket} />
      <BearerGroup title="Honorary Casket Bearers" names={bearers.honorary} className="mt-7" />
      <BearerGroup title="Flower Bearers" names={bearers.flower} className="mt-7" />
    </div>
  );
}

function BearerGroup({ title, names, className = "" }) {
  return (
    <div className={className}>
      <p className="font-display text-[13px] uppercase tracking-[0.26em] text-ink-900 underline underline-offset-4 decoration-ink-400/70">
        {title}
      </p>
      <p className="mt-2 font-display text-[13px] uppercase tracking-[0.18em] text-ink-700">
        {names.join(" • ")}
      </p>
    </div>
  );
}

/* ─────────────────────── ORDER OF SERVICE COLUMN ──────────────────── */

function OrderOfServiceColumn() {
  return (
    <div className="text-center">
      <BookIllustration portraits={rightPortraits} />
      <div className="divider-line mt-7 mb-7" />
      <div className="space-y-4">
        {orderOfService.map((item, i) => (
          <div key={i}>
            <p className="font-display text-[15px] text-ink-800 leading-snug">
              <span className="text-[12.5px] uppercase tracking-[0.18em] text-ink-600">
                {item.role}:
              </span>
              {"  "}
              {item.person}
            </p>
            {item.note && (
              <p className="font-display text-[13px] italic text-ink-500 mt-0.5 leading-snug">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── BOOK ILLUSTRATION ─────────────────────── */

function BookIllustration({ portraits }) {
  return (
    <div className="relative w-[280px] h-[144px] mx-auto">
      {/* Open book SVG */}
      <svg
        width="210"
        height="108"
        viewBox="0 0 210 108"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        {/* Left page */}
        <path
          d="M6 10 C 44 6, 100 6, 100 14 L 100 96 C 100 102, 44 102, 6 98 Z"
          fill="none"
          stroke="#ccc9c2"
          strokeWidth="1.2"
        />
        {/* Right page */}
        <path
          d="M110 14 C 110 6, 166 6, 204 10 L 204 98 C 166 102, 110 102, 110 96 Z"
          fill="none"
          stroke="#ccc9c2"
          strokeWidth="1.2"
        />
        {/* Spine curve */}
        <path
          d="M100 10 C 102 54, 108 54, 110 96"
          stroke="#bfbcb5"
          strokeWidth="1.4"
          fill="none"
        />
        {/* Text lines — left page */}
        {[30, 44, 58, 72, 86].map((y) => (
          <line key={y} x1="20" y1={y} x2="86" y2={y} stroke="#dbd9d4" strokeWidth="1.3" />
        ))}
        {/* Text lines — right page */}
        {[30, 44, 58, 72, 86].map((y) => (
          <line key={y} x1="124" y1={y} x2="190" y2={y} stroke="#dbd9d4" strokeWidth="1.3" />
        ))}
      </svg>

      {/* Portrait circles — top row */}
      <img
        src={portraits[0]}
        alt=""
        className="absolute w-11 h-11 rounded-full object-cover border-[2.5px] border-white shadow-md"
        style={{ top: "2px", left: "18px" }}
      />
      <img
        src={portraits[1]}
        alt=""
        className="absolute w-11 h-11 rounded-full object-cover border-[2.5px] border-white shadow-md"
        style={{ top: "2px", right: "18px" }}
      />
      {/* Portrait circles — bottom row */}
      <img
        src={portraits[2]}
        alt=""
        className="absolute w-11 h-11 rounded-full object-cover border-[2.5px] border-white shadow-md"
        style={{ bottom: "2px", left: "36px" }}
      />
      <img
        src={portraits[3]}
        alt=""
        className="absolute w-11 h-11 rounded-full object-cover border-[2.5px] border-white shadow-md"
        style={{ bottom: "2px", right: "36px" }}
      />
    </div>
  );
}

/* ─────────────────────────── SERVICE INFO ──────────────────────────── */

function ServiceInfo() {
  return (
    <div>
      {/* Live stream badge */}
      <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 border border-sage-300/50 text-[10.5px] uppercase tracking-[0.22em] px-4 py-1.5 rounded-full">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        Live Stream Enabled
      </div>

      {/* Script heading */}
      <h2 className="mt-4 font-script leading-none text-ink-900" style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}>
        Funeral Service for [Name of Deceased]
      </h2>

      {/* Date & time */}
      <p className="mt-4 font-display text-[15px] tracking-[0.07em] text-ink-700">
        Sat, Dec 4th, 2021
      </p>
      <p className="mt-0.5 font-display text-[15px] tracking-[0.07em] text-ink-700">
        11:00 &ndash; 12:00am SAST
      </p>

      {/* CTA buttons */}
      <div className="mt-6 flex gap-3 flex-wrap">
        <button className="inline-flex items-center gap-2 border border-ink-300/70 text-ink-800 hover:bg-cream-200 text-[10.5px] uppercase tracking-[0.22em] px-5 py-2.5 rounded-sm transition">
          <SupportIcon /> Show Support
        </button>
        <button className="inline-flex items-center gap-2 border border-ink-300/70 text-ink-800 hover:bg-cream-200 text-[10.5px] uppercase tracking-[0.22em] px-5 py-2.5 rounded-sm transition">
          <FlowerIcon /> Send Flowers
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── SERVICE VIDEO ─────────────────────────── */

function ServiceVideo() {
  return (
    <div className="relative rounded-sm overflow-hidden shadow-xl" style={{ aspectRatio: "16 / 9" }}>
      <div className="flex h-full">
        <img
          src="https://picsum.photos/seed/ev-chapel/320/480"
          alt=""
          className="w-1/3 h-full object-cover"
        />
        <img
          src="https://picsum.photos/seed/ev-garden/320/480"
          alt=""
          className="w-1/3 h-full object-cover"
        />
        <img
          src="https://picsum.photos/seed/ev-gather/320/480"
          alt=""
          className="w-1/3 h-full object-cover"
        />
      </div>
      {/* Subtle overlay for play button visibility */}
      <div className="absolute inset-0 bg-black/20" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="w-[70px] h-[70px] rounded-full bg-ink-900/80 hover:bg-ink-900 flex items-center justify-center transition shadow-2xl"
          aria-label="Play funeral service livestream"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── ICONS ────────────────────────────── */

function SupportIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="2.5" fill="currentColor" />
      <circle cx="7.5" cy="12.5" r="2.5" fill="currentColor" opacity="0.75" />
      <circle cx="16.5" cy="12.5" r="2.5" fill="currentColor" opacity="0.75" />
      <circle cx="12" cy="16" r="2.5" fill="currentColor" opacity="0.75" />
      <path d="M12 20V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
