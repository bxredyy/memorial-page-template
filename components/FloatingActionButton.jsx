"use client";

import { useEffect, useState } from "react";
import { useMemorial } from "./MemorialContext";
import GuestbookDialog from "./GuestbookDialog";
import SupportDialog from "./SupportDialog";
import PhotoUploadDialog from "./PhotoUploadDialog";
import { supportOptions } from "./supportOptions";

export default function FloatingActionButton() {
  const m = useMemorial();
  const [open, setOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [supportKey, setSupportKey] = useState(null);
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `In memory of ${m.fullName}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Memorial link copied to clipboard.");
    }
  };

  const run = (fn) => () => {
    setOpen(false);
    fn();
  };

  const actions = [
    { label: "Send Flowers", icon: <FlowerIcon />, onClick: run(() => setSupportKey("flowers")) },
    { label: "Send Grocery Support", icon: <GroceryIcon />, onClick: run(() => setSupportKey("grocery")) },
    { label: `Sign ${m.name}'s Guestbook`, icon: <GuestbookIcon />, onClick: run(() => setGuestOpen(true)) },
    { label: `Add Photos of ${m.name}`, icon: <BookIcon />, onClick: run(() => setPhotoOpen(true)) },
    { label: "Share this Memorial", icon: <ShareIcon />, onClick: run(share) },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* FAB + action stack */}
      <div className="fixed bottom-8 right-6 z-[91] flex flex-col items-end gap-3">
        {/* Action items */}
        <div className="flex flex-col items-end gap-3">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={`flex items-center gap-3 transition-all duration-300 ${
                open
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10 pointer-events-none"
              }`}
              style={{
                transitionDelay: open
                  ? `${i * 55}ms`
                  : `${(actions.length - 1 - i) * 35}ms`,
              }}
            >
              <span className="bg-white text-ink-900 text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap font-medium">
                {a.label}
              </span>
              <span className="w-12 h-12 rounded-full bg-sage-600 hover:bg-sage-700 shadow-xl flex items-center justify-center text-white shrink-0 cursor-pointer transition">
                {a.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Main FAB button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-sage-700 hover:bg-sage-800 text-white shadow-2xl flex items-center justify-center transition-colors duration-200"
          aria-label={open ? "Close actions" : "Open memorial actions"}
        >
          <span
            className="transition-transform duration-300"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <PlusIcon />
          </span>
        </button>
      </div>

      <GuestbookDialog open={guestOpen} onClose={() => setGuestOpen(false)} type="guestbook" />
      <SupportDialog optionKey={supportKey} options={supportOptions} onClose={() => setSupportKey(null)} />
      <PhotoUploadDialog open={photoOpen} onClose={() => setPhotoOpen(false)} />
    </>
  );
}

function FlowerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3" fill="white" />
      <circle cx="7" cy="13" r="3" fill="white" opacity="0.85" />
      <circle cx="17" cy="13" r="3" fill="white" opacity="0.85" />
      <circle cx="12" cy="17" r="3" fill="white" opacity="0.85" />
      <path d="M12 22V20" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GroceryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10a4 4 0 0 1-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GuestbookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="1.6" />
      <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="1.6" />
      <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="1.6" />
      <path
        d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
