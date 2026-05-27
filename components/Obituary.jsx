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
        <Reveal className="flex flex-wrap items-center justify-center gap-2 bg-white/70 backdrop-blur rounded-full p-1.5 border border-sage-200/60 w-full max-w-[980px] mx-auto shadow-sm overflow-x-auto px-3">
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
