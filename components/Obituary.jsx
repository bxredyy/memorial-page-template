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
              ame of Deceased, devoted wife, mother, and grandmother passed away
              peacefully on Wednesday, December 1, 2021. [Name] was born on July
              12, 1929 in Sarasota, Florida to Alonzo and Nell Bishop. She was
              the first of three children.
            </p>
            <p className="mt-5">
              She met her future husband, William, then a private in the U.S. Army
              stationed at Fort Carson, Colo, on a blind date. She married her
              sweetheart on November 21, 1953. They had lived in Florence, Colo.,
              Glendale, Ariz., and Farmington, N.M., before finally returning to
              Sarasota, F.L in 1969. She took great joy in pulling together and
              keeping a lovely home for her family. [Name] insisted on teaching
              all of her children to cook and her family recipes are cherished
              heirlooms.
            </p>

            {expanded && (
              <>
                <p className="mt-5">
                  She was a member of Christ's Church and enjoyed several
                  callings during her life. Her best memories always involved
                  being surrounded by her family — the noise of grandchildren in
                  the kitchen, the smell of bread on Saturday mornings, the
                  porch light kept on for late arrivals.
                </p>
                <p className="mt-5">
                  [Name] is survived by her four children, eleven grandchildren,
                  and six great-grandchildren. The family asks that in lieu of
                  flowers, donations be made to her church or planted as living
                  memorials in her name.
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
              Show your love and support to [Name]'s family by adding your name
              to [Name]'s Guest Book.
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
                  Sympathy flowers are a simple way
                  <br/>
                  to let [Name]'s loved ones know that
                  <br/>
                  you are thinking about them.
                </p>
                <button className="mt-5 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition">
                  Send Flowers To Family
                </button>
              </div>
            </div>
          </Reveal>

          {/* Trees panel */}
          <Reveal className="mt-12 relative">
            <div className="bg-sage-50/60 rounded-xl py-12 px-8 text-center relative overflow-hidden">
              <TreesArt side="left" />
              <TreesArt side="right" />
              <div className="relative z-10 max-w-md mx-auto">
                <p className="font-display text-2xl text-ink-900">
                  Plant a memorial tree in [Name]'s memory
                  <br/>
                  with one of our reforestation projects.
                </p>
                <button className="mt-5 bg-sage-600 hover:bg-sage-700 text-white text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition">
                  Plant a Tree
                </button>
                <div className="mt-6 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.18em] text-ink-700">
                  <span>Arbor Day Foundation</span>
                  <span className="text-sage-300">·</span>
                  <span>Plant-it 2020</span>
                  <span className="text-sage-300">·</span>
                  <span>OneTreePlanted</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stat cards */}
          <div id="events" className="scroll-mt-24">
            <Reveal className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard icon="heart" label="Memories" count={12} subtitle="Click here to view memories & condolences" />
              <StatCard icon="cal" label="Event" count={1} subtitle="Click here to view events & services for [Name]" />
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

function TreesArt({ side }) {
  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      className={`absolute top-1/2 -translate-y-1/2 opacity-80 ${
        side === "left" ? "-left-6" : "-right-6 scale-x-[-1]"
      }`}
    >
      <path d="M30 130l20-50 20 50z" fill="#6B8064" />
      <path d="M30 110l20-50 20 50z" fill="#86997D" />
      <path d="M30 90l20-50 20 50z" fill="#A9B999" />
      <rect x="46" y="130" width="8" height="20" fill="#6B5742" />

      <path d="M90 130l16-40 16 40z" fill="#6B8064" />
      <path d="M90 115l16-40 16 40z" fill="#86997D" />
      <rect x="103" y="130" width="6" height="16" fill="#6B5742" />

      <path d="M135 130l22-60 22 60z" fill="#556650" />
      <path d="M135 105l22-60 22 60z" fill="#6B8064" />
      <path d="M135 80l22-60 22 60z" fill="#86997D" />
      <rect x="154" y="130" width="8" height="22" fill="#6B5742" />
    </svg>
  );
}

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
