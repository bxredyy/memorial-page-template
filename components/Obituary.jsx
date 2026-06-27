"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import MemoriesView from "./MemoriesView";
import EventsView from "./EventsView";
import GuestbookDialog from "./GuestbookDialog";
import SupportDialog from "./SupportDialog";
import { supportOptions } from "./supportOptions";
import { useMemorial } from "./MemorialContext";

export default function Obituary() {
  const m = useMemorial();
  const [active, setActive] = useState("obituary");
  const [expanded, setExpanded] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [supportType, setSupportType] = useState(null); // null | option key

  const memoryCount = m.memories?.length ?? 0;
  const eventCount = m.service_date ? 1 : 0;
  const shortParas = (m.obituary_short || "").split(/\n{2,}/).filter(Boolean);
  const fullParas = (m.obituary_full || "").split(/\n{2,}/).filter(Boolean);

  const tabs = [
    { id: "obituary", label: "Obituary", count: null },
    { id: "memories", label: "Memories", count: memoryCount },
    { id: "events", label: "Events", count: eventCount },
  ];

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
            {shortParas.length > 0 ? (
              shortParas.map((para, i) => (
                <p key={i} className={i === 0 ? "" : "mt-5"}>
                  {i === 0 ? (
                    <>
                      <span className="font-display text-5xl float-left leading-[0.85] mr-2 text-copper-500">
                        {para.charAt(0)}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))
            ) : (
              <p className="text-ink-500 italic text-center">
                The obituary for {m.fullName} will appear here.
              </p>
            )}

            {expanded &&
              fullParas.map((para, i) => (
                <p key={i} className="mt-5">
                  {para}
                </p>
              ))}

            <div className="text-center mt-8 flex items-center justify-center gap-6">
              {fullParas.length > 0 && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="text-[12px] uppercase tracking-[0.25em] text-sage-700 hover:text-sage-800 underline-offset-4 hover:underline"
                >
                  {expanded ? "Read Less" : "Read More"}
                </button>
              )}
              <button
                onClick={() => typeof window !== "undefined" && window.print()}
                className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-sm transition"
              >
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
              Show your love and support to {m.name}&rsquo;s family by adding your
              name to {m.name}&rsquo;s Guest Book.
            </p>
            <button
              onClick={() => setGuestOpen(true)}
              className="mt-5 border border-dashed border-sage-500 text-sage-700 hover:bg-sage-50 text-[12px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-full transition"
            >
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
                  to let {m.name}&rsquo;s family know that
                  <br/>
                  you are thinking of them.
                </p>
                <button
                  onClick={() => setSupportType("flowers")}
                  className="mt-5 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition"
                >
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
                  {m.name}&rsquo;s family during this time.
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
                        onClick={() => setSupportType(opt.key)}
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
              <button onClick={() => setActive("memories")} className="text-left">
                <StatCard icon="heart" label="Memories" count={memoryCount} subtitle="View memories and condolences shared by loved ones" />
              </button>
              <button onClick={() => setActive("events")} className="text-left">
                <StatCard icon="cal" label="Event" count={eventCount} subtitle="View the funeral service details and programme" />
              </button>
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

      <GuestbookDialog
        open={guestOpen}
        onClose={() => setGuestOpen(false)}
        type="guestbook"
      />
      <SupportDialog
        optionKey={supportType}
        options={supportOptions}
        onClose={() => setSupportType(null)}
      />
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

function StatCard({ icon, label, count, subtitle }) {
  return (
    <div className="w-full text-left bg-sage-500 hover:bg-sage-600 transition text-white rounded-lg px-7 py-6 shadow-lg relative cursor-pointer">
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
    </div>
  );
}
