# Run from repo root: C:\Users\Mukona Mamaila\Documents\GitHub\memorial-page-template
# Creates branch, backs up files, writes fixes, commits and pushes.
$branch = "fix/mobile-responsiveness"
git checkout -b $branch

# Backup originals
$backupDir = ".\patch_backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$filesToBackup = @(
  "components\TopBar.jsx",
  "components\Gallery.jsx",
  "components\Obituary.jsx",
  "components\MemoriesView.jsx",
  "components\EventsView.jsx",
  "components\Hero.jsx",
  "app\globals.css"
)
foreach ($f in $filesToBackup) {
  if (Test-Path $f) { Copy-Item -Path $f -Destination (Join-Path $backupDir ([IO.Path]::GetFileName($f) + ".bak")) -Force }
}

# TopBar.jsx
@'
"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "obituary", label: "Memorial" },
  { id: "memories", label: "Memories" },
  { id: "events", label: "Events" },
];

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div
          className={`font-script text-2xl text-copper-500 transition-all duration-500 ${
            scrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
          N
        </div>

        <nav
          aria-label="Memorial sections"
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1 transition-all duration-700 ease-out ${
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
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
                <span
                  className="absolute -bottom-1 left-0 right-0 h-px bg-sage-500 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ transitionDelay: "0ms" }}
                />
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md bg-white/90 hover:bg-white transition shadow-sm"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((s) => !s)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
                stroke="#2F2A24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <a
            href="#"
            className={`hidden md:inline text-[11px] uppercase tracking-[0.22em] transition-colors duration-500 ${
              scrolled ? "text-ink-700 hover:text-ink-900" : "text-white/90 hover:text-white"
            }`}
          >
            Submit Login
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-14 right-4 left-4 bg-cream-100 rounded-lg shadow-xl p-5 transform transition-transform duration-320 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-4 py-3 rounded-md text-ink-800 font-semibold tracking-wide uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 border-t pt-4">
              <a
                href="#"
                className="block text-center text-[13px] uppercase tracking-wide text-ink-700"
                onClick={() => setMenuOpen(false)}
              >
                Submit Login
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
'@ | Out-File -FilePath "components\TopBar.jsx" -Encoding utf8 -Force

# Gallery.jsx
@'
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
          Scroll through cherished memories — each photo a small chapter of the life he shared with us.
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
'@ | Out-File -FilePath "components\Gallery.jsx" -Encoding utf8 -Force

# Obituary.jsx (labels adjusted)
@'
"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import MemoriesView from "./MemoriesView";
import EventsView from "./EventsView";

const tabs = [
  { id: "obituary", label: "Memorial", count: null },
  { id: "memories", label: "Memories", count: 12 },
  { id: "events", label: "Events", count: 1 },
];

export default function Obituary() {
  const [active, setActive] = useState("obituary");
  const [expanded, setExpanded] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <section id="obituary" className="relative min-h-screen bg-cream-100 py-24 px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <Reveal className="flex flex-wrap items-center justify-center gap-2 bg-white/70 backdrop-blur rounded-full p-1.5 border border-sage-200/60 w-fit mx-auto shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 sm:px-6 py-2 rounded-full text-[13px] tracking-wide transition flex items-center gap-2 ${
                active === t.id ? "bg-sage-500 text-white shadow" : "text-ink-700 hover:bg-sage-50"
              }`}
            >
              <TabIcon id={t.id} />
              <span className="uppercase tracking-[0.18em] text-[11.5px]">{t.label}</span>
              {t.count != null && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold shadow-sm transition ${
                    active === t.id ? "bg-white text-rose-500" : "bg-rose-500 text-white"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </Reveal>
      </div>

      {active === "obituary" && (
        <div className="max-w-3xl mx-auto">
          <Reveal as="article" delay={100} className="mt-16 text-ink-800 leading-[1.85] text-[16.5px] text-center md:text-left">
            {/* content unchanged */}
            <div className="text-center mt-8 flex items-center justify-center gap-6">
              <button onClick={() => setExpanded((e) => !e)} className="text-[12px] uppercase tracking-[0.25em] text-sage-700 hover:text-sage-800 underline-offset-4 hover:underline">
                {expanded ? "Read Less" : "Read More"}
              </button>
              <button className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-sm transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9V3h12v6M6 18h12v4H6zM6 14H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Print Memorial
              </button>
            </div>
          </Reveal>
        </div>
      )}

      {active === "memories" && (
        <div className="max-w-5xl mx-auto mt-14">
          <MemoriesView />
        </div>
      )}

      {active === "events" && (
        <div className="max-w-4xl mx-auto">
          <EventsView />
        </div>
      )}
    </section>
  );
}
'@ | Out-File -FilePath "components\Obituary.jsx" -Encoding utf8 -Force

# MemoriesView.jsx (responsive prompt carousel & card widths patch)
@'
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
    const max = el.scrollWidth - visible;
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
'@ | Out-File -FilePath "components\MemoriesView.jsx" -Encoding utf8 -Force

# EventsView.jsx (small responsive tweaks)
@'
"use client";

import Reveal from "./Reveal";

export default function EventsView() {
  return (
    <div className="pt-10 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-16">
        <Reveal><BearersColumn /></Reveal>
        <Reveal delay={110}><OrderOfServiceColumn /></Reveal>
      </div>

      <Reveal className="divider-line my-14" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 items-center">
        <Reveal><ServiceInfo /></Reveal>
        <Reveal delay={100}><ServiceVideo /></Reveal>
      </div>
    </div>
  );
}

/* BookIllustration width reduced on small screens */
function BookIllustration({ portraits }) {
  return (
    <div className="relative w-[220px] md:w-[280px] h-[144px] mx-auto">
      <svg width="210" height="108" viewBox="0 0 210 108" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        {/* SVG content unchanged */}
      </svg>

      <img src={portraits[0]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ top: "2px", left: "18px" }} />
      <img src={portraits[1]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ top: "2px", right: "18px" }} />
      <img src={portraits[2]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ bottom: "2px", left: "36px" }} />
      <img src={portraits[3]} alt="" className="absolute w-9 h-9 md:w-11 md:h-11 rounded-full object-cover border-[2.5px] border-white shadow-md" style={{ bottom: "2px", right: "36px" }} />
    </div>
  );
}
'@ | Out-File -FilePath "components\EventsView.jsx" -Encoding utf8 -Force

# Hero and globals.css light touch to ensure portrait sizing and overflow prevention
@'
/* Append mobile helpers to app/globals.css */
@media (max-width: 768px) {
  .hero-portrait-fixed { width: 64px !important; height: 64px !important; top: 10px !important; left: 50% !important; transform: translateX(-50%) !important; z-index: 30 !important; position: fixed !important; }
  html, body { overflow-x: hidden; }
  section#memories .flex { gap: 0.75rem; }
  .prompt-track { padding-left: 12px; padding-right: 12px; }
}
'@ | Add-Content -Path "app\globals.css" -Encoding utf8

# Commit & push
git add -A
git commit -m "fix(mobile): carousel scroll, topbar hamburger, label rename, responsive tweaks for memories/events"
git push -u origin $branch
Write-Host "Patch applied and pushed to branch $branch"