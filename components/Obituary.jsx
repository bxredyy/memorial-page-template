"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import MemoriesView from "./MemoriesView";
import EventsView from "./EventsView";

const tabs = [
  { id: "obituary", label: "Obituary", count: null },
  { id: "memories", label: "Memories", count: 12 },
  { id: "events", label: "Events", count: 1 },
];

export default function Obituary() {
  const [active, setActive] = useState("obituary");
  const [expanded, setExpanded] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <section id="obituary" className="relative min-h-screen bg-cream-100 py-24 px-6 scroll-mt-20">

      {/* Tab strip — always narrow/centered */}
      <div className="max-w-3xl mx-auto">
        <Reveal className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur rounded-full p-1.5 border border-sage-200/60 w-fit mx-auto shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-6 py-2 rounded-full text-[13px] tracking-wide transition flex items-center gap-2 ${
                active === t.id
                  ? "bg-sage-500 text-white shadow"
                  : "text-ink-700 hover:bg-sage-50"
              }`}
            >
              <TabIcon id={t.id} />
              <span className="uppercase tracking-[0.18em] text-[11.5px]">{t.label}</span>
              {t.count != null && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold shadow-sm transition ${
                    active === t.id
                      ? "bg-white text-rose-500"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </Reveal>
      </div>

      {/* === SECTION SWITCHER REGION === */}

      {active === "obituary" && (
        <div className="max-w-3xl mx-auto">
          {/* Obituary copy */}
          <Reveal as="article" delay={100} className="mt-16 text-ink-800 leading-[1.85] text-[16.5px] text-center md:text-left">
            <p>
              <span className="font-display text-5xl float-left leading-[0.85] mr-2 text-copper-500">N</span>
              ame of Deceased, devoted husband, father, and son, passed away
              peacefully on Tuesday, 2 September 2025. [Name] was born on
              14&nbsp;March 1977 in Johannesburg to [Father&rsquo;s Name] and
              [Mother&rsquo;s Name]. He was the second of four children,
              growing up in the East Rand with a deep love for community,
              sport, and family.
            </p>
            <p className="mt-5">
              He met the love of his life at a gathering in Pretoria in 1999.
              They were married on 3 April 2004 and built their home in
              [City], where they raised their two children with warmth,
              laughter, and an open door. [Name] took great pride in being
              present — for school mornings, weekend braais, and every
              moment in between. His family recipes and weekend traditions
              are cherished by all who knew him.
            </p>

            {expanded && (
              <>
                <p className="mt-5">
                  He was an active member of his local community and gave
                  his time freely to those around him. His best memories
                  always involved being surrounded by the people he loved —
                  the noise of his children in the house, early mornings
                  with coffee on the stoep, and the cricket season that
                  brought the whole family together.
                </p>
                <p className="mt-5">
                  [Name] is survived by his beloved wife, his two children,
                  his parents, and his three siblings. The family asks that
                  those who wish to show their love consider offering
                  practical support directly — your presence, your prayers,
                  and your kindness mean everything during this time.
                </p>
              </>
            )}

            <div className="text-center mt-8 flex items-center justify-center gap-6">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-[12px] uppercase tracking-[0.25em] text-sage-700 hover:text-sage-800 underline-offset-4 hover:underline"
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
              <button className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-sm transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9V3h12v6M6 18h12v4H6zM6 14H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Print Obituary
              </button>
            </div>
          </Reveal>

          {/* Guest book */}
          <Reveal className="mt-20 text-center">
            <HeartIcon />
            <p className="mt-4 text-ink-700 max-w-md mx-auto">
              Show your love and support to [Name]&rsquo;s family by adding your
              name to [Name]&rsquo;s Guest Book.
            </p>
            <button className="mt-5 border border-dashed border-sage-500 text-sage-700 hover:bg-sage-50 text-[12px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-full transition">
              Add My Name
            </button>
          </Reveal>

          {/* Flowers panel */}
          <Reveal className="mt-24 relative">
            <div className="bg-cream-200/60 rounded-xl py-12 px-8 text-center relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80"
                alt=""
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-44 h-44 object-cover rounded-full opacity-90"
              />
              <img
                src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80"
                alt=""
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-44 h-44 object-cover rounded-full opacity-90"
              />
              <div className="relative z-10 max-w-md mx-auto">
                <p className="font-display text-2xl text-ink-900">
                  A floral tribute is a simple, heartfelt way
                  <br/>
                  to let [Name]&rsquo;s family know that
                  <br/>
                  you are thinking of them.
                </p>
                <button className="mt-5 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition">
                  Send Flowers To Family
                </button>
              </div>
            </div>
          </Reveal>

          {/* Support expander panel */}
          <Reveal className="mt-12">
            <div className="bg-sage-50/60 rounded-xl py-12 px-8 text-center">
              <div className="max-w-lg mx-auto">
                <p className="font-display text-2xl text-ink-900">
                  There are many meaningful ways to support
                  <br />
                  [Name]&rsquo;s family during this time.
                </p>
                <button
                  onClick={() => setShowSupport((s) => !s)}
                  className="mt-5 inline-flex items-center gap-2.5 bg-sage-600 hover:bg-sage-700 text-white text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition"
                >
                  Honour Their Memory
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    style={{
                      transition: "transform 300ms ease",
                      transform: showSupport ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expandable support options */}
                <div
                  style={{
                    maxHeight: showSupport ? "560px" : "0px",
                    opacity: showSupport ? 1 : 0,
                    transform: showSupport ? "translateY(0)" : "translateY(-10px)",
                    overflow: "hidden",
                    transition:
                      "max-height 520ms cubic-bezier(0.22,0.61,0.36,1), opacity 380ms ease-out, transform 380ms ease-out",
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 text-left">
                    {supportOptions.map((opt) => (
                      <button
                        key={opt.key}
                        className="flex items-start gap-3.5 w-full bg-white/70 hover:bg-white rounded-lg px-4 py-4 transition-all group border border-white/70 shadow-sm hover:shadow-md text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center shrink-0 text-sage-700 group-hover:bg-sage-200 transition-colors mt-0.5">
                          {opt.icon}
                        </div>
                        <div>
                          <p className="font-display text-[14.5px] text-ink-900 leading-tight">{opt.title}</p>
                          <p className="text-[11.5px] text-ink-600 mt-0.5 leading-relaxed">{opt.copy}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stat cards */}
          <div id="events" className="scroll-mt-24">
            <Reveal className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard icon="heart" label="Memories" count={12} subtitle="View memories and condolences shared by loved ones" />
              <StatCard icon="cal" label="Event" count={1} subtitle="View the funeral service details and programme" />
            </Reveal>
          </div>
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

function TabIcon({ id }) {
  if (id === "obituary")
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  if (id === "memories")
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
    );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="mx-auto text-sage-600" fill="currentColor">
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
    </svg>
  );
}

/* ─────────────── SOUTH AFRICAN SUPPORT OPTIONS ─────────────── */

const supportOptions = [
  {
    key: "flowers",
    title: "Send Flowers",
    copy: "Send a thoughtful floral tribute to the family.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="7.5" r="2.5" />
        <circle cx="7" cy="12" r="2.5" opacity="0.75" />
        <circle cx="17" cy="12" r="2.5" opacity="0.75" />
        <circle cx="12" cy="16" r="2.5" opacity="0.75" />
        <path d="M12 20v-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    key: "grocery",
    title: "Send Grocery Support",
    copy: "Support the family with groceries during a difficult time.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "meals",
    title: "Meal Support Contribution",
    copy: "Help provide meals for visiting family and loved ones.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 11h18M3 11c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 11c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 19v3M9 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "funeral",
    title: "Funeral Contribution",
    copy: "Assist the family with funeral-related support.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "candle",
    title: "Candle of Remembrance",
    copy: "Light a candle in honour of their memory.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="9" y="13" width="6" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 13V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 5c-1.2 1.8-1 4 0 4 1 0 1.2-2.2 0-4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "prayer",
    title: "Prayer & Support Message",
    copy: "Send words of comfort, prayer and encouragement.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "book",
    title: "Build a Remembrance Book",
    copy: "Preserve photos, memories and tributes in a keepsake book.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "gift",
    title: "Family Tribute Gift",
    copy: "Offer a thoughtful gesture of support and remembrance.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="7" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7v15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7c0 0-3-5 0-5s0 5 0 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7c0 0 3-5 0-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function StatCard({ icon, label, count, subtitle }) {
  return (
    <button className="text-left bg-sage-500 hover:bg-sage-600 transition text-white rounded-lg px-7 py-6 shadow-lg relative">
      <span className="absolute -top-2 -right-2 bg-copper-500 text-white text-[11px] font-semibold rounded-full w-7 h-7 flex items-center justify-center shadow">
        {count}
      </span>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
          {icon === "heart" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="white" strokeWidth="1.6"/><path d="M3 9h18M8 3v4M16 3v4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          )}
        </div>
        <div>
          <p className="font-display text-2xl">{count} {label}{count !== 1 && "s"}</p>
          <p className="text-[12px] opacity-85 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
