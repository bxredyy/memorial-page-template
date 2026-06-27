"use client";

import { useRef, useState } from "react";
import Reveal from "./Reveal";
import { useMemorial } from "./MemorialContext";
import GuestbookDialog from "./GuestbookDialog";
import SupportDialog from "./SupportDialog";
import { supportOptions } from "./supportOptions";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const promptTemplates = [
  "How did you know [Name]?",
  "What is something interesting about [Name] that others might not know?",
  "In just a few words, how would you describe [Name]?",
  "What made [Name] uniquely, wonderfully themselves?",
  "What is a funny story about [Name]?",
  "What do you want someone reading this 100 years from now to know about [Name]?",
  "How did [Name] make the world a better place?",
  "What was [Name]'s greatest strength?",
  "What is a lesson [Name] taught you that you carry with you today?",
  "What is [Name]'s legacy?",
  "What is something you will always remember about [Name]?",
  "What is a piece of advice [Name] gave you?",
  "What is your favourite memory with [Name]?",
  "How did [Name] show love to the people around them?",
  "What would you want [Name] to know today?",
  "What do you miss most about [Name]?",
  "What song or piece of music reminds you of [Name]?",
  "What was [Name]'s favourite thing to do?",
  "What is a moment with [Name] you wish you could relive?",
  "How would [Name] want to be remembered?",
  "What did [Name] mean to you, in your own words?",
  "Describe the feeling of being in [Name]'s company.",
];

// Build the carousel deck (promo cards interspersed with prompts).
function buildPromptDeck(name) {
  const fill = (s) => s.replace(/\[Name\]/g, name);
  const prompts = promptTemplates.map((t) => ({ type: "prompt", title: fill(t) }));
  const deck = [
    { type: "book" },
    { type: "me" },
    ...prompts.slice(0, 4),
    { type: "candle" },
    ...prompts.slice(4, 8),
    { type: "flowers" },
    ...prompts.slice(8, 12),
    { type: "support" },
    ...prompts.slice(12),
  ];
  return deck;
}

// Map a DB memory row to a presentational card descriptor.
function toCard(row) {
  if (row.is_candle || row.type === "candle") {
    return {
      kind: "candle",
      quote: row.body || "Forever in our hearts.",
      litBy: row.author_name,
      role: row.relationship,
    };
  }
  if (row.type === "prompt_answer" && row.prompt) {
    return {
      kind: "titled",
      title: row.prompt,
      body: row.body,
      author: row.author_name,
      role: row.relationship,
    };
  }
  return {
    kind: "testimonial",
    body: row.body,
    author: row.author_name,
    role: row.relationship,
  };
}

/* ─────────────────────────────── ROOT ─────────────────────────────── */

export default function MemoriesView() {
  const m = useMemorial();
  const name = m.name;

  // Dialog state lifted to the root.
  const [guest, setGuest] = useState(null); // { type, prompt, promptLabel } | null
  const [supportKey, setSupportKey] = useState(null);

  const openGuest = (cfg) => setGuest(cfg);
  const openSupport = (key) => setSupportKey(key);

  const liveCards = (m.memories || []).map(toCard).filter((c) => c.body || c.kind === "candle");

  // Intersperse promo cards once there's enough real content.
  const cards = [...liveCards];
  if (cards.length >= 3) cards.splice(3, 0, { kind: "business-flowers" });
  if (cards.length >= 8) cards.splice(8, 0, { kind: "business-book" });

  return (
    <div className="space-y-20">
      <GuestbookMini compact name={name} onAdd={() => openGuest({ type: "guestbook" })} />
      <PromptCarousel
        name={name}
        onPrompt={(prompt) => openGuest({ type: "prompt_answer", prompt })}
        onMe={() => openGuest({ type: "guestbook" })}
        onCandle={() => openGuest({ type: "candle" })}
        onSupport={openSupport}
      />
      <MemoriesHeader count={liveCards.length} />
      {liveCards.length > 0 ? (
        <MemoriesMasonry cards={cards} name={name} onCandle={() => openGuest({ type: "candle" })} />
      ) : (
        <EmptyMemories name={name} onAdd={() => openGuest({ type: "tribute" })} />
      )}
      {liveCards.length > 0 && <ViewMoreButton onAdd={() => openGuest({ type: "tribute" })} />}
      <GuestbookMini name={name} onAdd={() => openGuest({ type: "guestbook" })} />

      <GuestbookDialog
        open={!!guest}
        onClose={() => setGuest(null)}
        type={guest?.type || "guestbook"}
        prompt={guest?.prompt || null}
        promptLabel={guest?.prompt || null}
      />
      <SupportDialog
        optionKey={supportKey}
        options={supportOptions}
        onClose={() => setSupportKey(null)}
      />
    </div>
  );
}

/* ─────────────────────────── EMPTY STATE ──────────────────────────── */

function EmptyMemories({ name, onAdd }) {
  return (
    <Reveal className="relative">
      <BotanicalBg />
      <div className="relative z-10 text-center py-16">
        <HeartIcon className="mx-auto text-sage-500 w-7 h-7" />
        <p className="mt-4 font-display text-2xl text-ink-900">
          Be the first to share a memory of {name}
        </p>
        <p className="mt-2 text-ink-600 max-w-md mx-auto text-[14px]">
          Every story, photo and message helps the family hold {name} close.
        </p>
        <button
          onClick={onAdd}
          className="mt-6 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.22em] px-8 py-3 rounded-full transition shadow-lg"
        >
          Share a Memory
        </button>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────── GUESTBOOK MINI ───────────────────────── */

function GuestbookMini({ compact = false, name, onAdd }) {
  return (
    <Reveal as="div" className={`text-center ${compact ? "" : "border-t border-sage-200/60 pt-12"}`}>
      <HeartIcon className="mx-auto text-sage-600" />
      <p className="mt-3 text-ink-700 max-w-md mx-auto">
        Show your {compact ? "support" : "love and support"} by adding your name
        to&nbsp;{name}&rsquo;s Guestbook.
      </p>
      <button
        onClick={onAdd}
        className="mt-4 border border-dashed border-sage-500 text-sage-700 hover:bg-sage-50 text-[12px] uppercase tracking-[0.22em] px-7 py-2.5 rounded-full transition"
      >
        Add My Name
      </button>
      {compact && (
        <div className="mt-5 flex items-center justify-center gap-5 text-[12px]">
          <a className="inline-flex items-center gap-2 text-[#1877F2] hover:underline" href="#">
            <FbIcon /> Invite via Facebook
          </a>
          <a className="inline-flex items-center gap-2 text-sage-700 hover:underline" href="#">
            <SmsIcon /> Invite via Text
          </a>
        </div>
      )}
    </Reveal>
  );
}

/* ─────────────────────────── PROMPT CAROUSEL ──────────────────────── */

function PromptCarousel({ name, onPrompt, onMe, onCandle, onSupport }) {
  const trackRef = useRef(null);
  const scroll = (delta) => trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  const deck = buildPromptDeck(name);

  return (
    <Reveal className="relative -mx-6">
      <button
        onClick={() => scroll(-560)}
        aria-label="Scroll prompts left"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={() => scroll(560)}
        aria-label="Scroll prompts right"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:bg-sage-50 transition flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#2F2A24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div ref={trackRef} className="scrollbar-hidden overflow-x-auto scroll-smooth">
        <div className="flex items-stretch gap-5 px-14 py-6 prompt-track">
          {deck.map((p, i) => (
            <PromptCard
              key={i}
              {...p}
              name={name}
              onPrompt={onPrompt}
              onMe={onMe}
              onCandle={onCandle}
              onSupport={onSupport}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function PromptCard({ type, title, name, onPrompt, onMe, onCandle, onSupport }) {
  if (type === "book") {
    return (
      <div className="shrink-0 w-[280px] rounded-md overflow-hidden bg-white shadow-lg flex flex-col border border-cream-200">
        <div className="flex-1 px-6 py-8 text-center flex flex-col items-center justify-center gap-3">
          <BookSpineSvg />
          <p className="font-script text-3xl text-ink-900 leading-tight">
            Remember<br />Forever
          </p>
          <p className="text-[12px] text-ink-600 leading-relaxed">
            Preserve {name}&rsquo;s story in a beautiful printed keepsake book.
          </p>
        </div>
        <button onClick={() => onSupport("book")} className="bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.25em] py-3 transition">
          Build a Book
        </button>
      </div>
    );
  }

  if (type === "flowers") {
    return (
      <div className="shrink-0 w-[280px] rounded-md overflow-hidden bg-white shadow-lg flex flex-col border border-cream-200">
        <div className="flex-1 px-6 py-8 text-center flex flex-col items-center justify-center gap-3">
          <FlowerClusterSvg />
          <p className="font-script text-3xl text-ink-900 leading-tight">
            Flowers can<br />often say it best
          </p>
          <p className="text-[12px] text-ink-600 leading-relaxed">
            Send a beautiful arrangement directly to {name}&rsquo;s family.
          </p>
        </div>
        <button onClick={() => onSupport("flowers")} className="bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.25em] py-3 transition">
          Send Flowers to Family
        </button>
      </div>
    );
  }

  if (type === "candle") {
    return (
      <div className="shrink-0 w-[260px] rounded-md overflow-hidden bg-ink-900 text-white shadow-lg flex flex-col">
        <div className="bg-ink-900 px-4 py-3 text-center border-b border-white/10">
          <p className="text-[11px] uppercase tracking-[0.28em]">Light a Candle</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-ink-800 to-black py-10">
          <CandleSvg />
        </div>
        <button onClick={onCandle} className="bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
          Light a Candle
        </button>
      </div>
    );
  }

  if (type === "support") {
    return (
      <div className="shrink-0 w-[260px] rounded-md overflow-hidden bg-sage-50 shadow-lg flex flex-col">
        <div className="px-5 py-7 text-center flex-1 flex flex-col items-center justify-center">
          <p className="font-display text-[15px] text-ink-900 leading-snug">
            There are many ways to
          </p>
          <p className="font-script text-[26px] text-sage-600 leading-snug mt-1">
            Honour Their Memory
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {["Send Flowers", "Grocery Support", "Meal Support", "Funeral Support"].map((tag) => (
              <span key={tag} className="text-[9.5px] uppercase tracking-[0.18em] text-sage-700 bg-sage-100/80 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => onSupport("flowers")} className="bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
          Show Support Options
        </button>
      </div>
    );
  }

  const isMe = type === "me";
  return (
    <button
      onClick={() => (isMe ? onMe() : onPrompt(title))}
      className="shrink-0 w-[260px] rounded-md overflow-hidden bg-white shadow-lg flex flex-col relative text-left hover:shadow-xl transition group"
    >
      {isMe && (
        <span className="absolute top-2 right-2 bg-sage-500 text-white text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full z-10">
          Me
        </span>
      )}
      {!isMe && (
        <div className="bg-sage-500 text-white px-4 py-3 min-h-[64px] flex items-center">
          <p className="text-[12.5px] leading-snug">{title}</p>
        </div>
      )}
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-[13px] text-ink-500/80 italic text-center leading-relaxed">
          {isMe ? "Share a message or condolence with others…" : "Tap to share your answer…"}
        </p>
      </div>
      <span className="w-full border-t border-sage-100 text-sage-700 group-hover:bg-sage-50 text-[11px] uppercase tracking-[0.22em] py-3 transition flex items-center justify-center gap-2">
        <HeartIcon className="w-3.5 h-3.5" /> Share Your Memory
      </span>
    </button>
  );
}

/* ─────────────────────────── MEMORIES HEADER ──────────────────────── */

function MemoriesHeader({ count }) {
  return (
    <Reveal className="flex items-center justify-center gap-4">
      <FloralDot />
      <p className="text-[11px] uppercase tracking-[0.35em] text-sage-700">
        {count} {count === 1 ? "Memory" : "Memories"} Preserved
      </p>
      <FloralDot />
    </Reveal>
  );
}

/* ─────────────────────────── MEMORIES MASONRY ─────────────────────── */

function MemoriesMasonry({ cards, name, onCandle }) {
  return (
    <Reveal className="relative">
      <BotanicalBg />
      <div className="relative z-10 columns-1 md:columns-2 xl:columns-3 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
        {cards.map((c, i) => (
          <MemoryCard key={i} {...c} name={name} onCandle={onCandle} />
        ))}
      </div>
    </Reveal>
  );
}

function MemoryCard({ kind, title, body, author, role, quote, litBy, name, onCandle }) {
  if (kind === "candle") {
    return (
      <div className="bg-ink-900 text-white rounded-md overflow-hidden shadow-xl">
        <div className="flex items-stretch gap-4 p-5">
          <div className="w-[110px] shrink-0 flex items-center justify-center bg-gradient-to-b from-ink-800 to-black rounded-sm py-6">
            <CandleSvg />
          </div>
          <div className="flex-1 flex flex-col justify-center text-center">
            <p className="font-display italic text-lg leading-snug">&ldquo;{quote}&rdquo;</p>
            <p className="mt-4 text-[12px] tracking-wide text-white/85">
              Candle lit by <span className="font-medium text-white">{litBy}</span>
            </p>
            {role && <p className="text-[11px] italic text-white/70">{role}</p>}
          </div>
        </div>
        <button onClick={onCandle} className="block w-full bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
          Light a Candle for {name}
        </button>
      </div>
    );
  }

  if (kind === "business-flowers") {
    return (
      <div className="rounded-md overflow-hidden bg-white border border-cream-200 shadow-md">
        <div className="px-6 py-7 text-center flex flex-col items-center gap-3">
          <FlowerClusterSvg size={56} />
          <p className="font-script text-3xl text-ink-900">Flowers can often say it best</p>
          <p className="text-[13px] text-ink-600 max-w-xs">
            Send beautiful flowers directly to {name}&rsquo;s family to show your love and support.
          </p>
        </div>
      </div>
    );
  }

  if (kind === "business-book") {
    return (
      <div className="rounded-md overflow-hidden bg-sage-50 border border-sage-200/60 shadow-md">
        <div className="px-6 py-7 text-center flex flex-col items-center gap-3">
          <BookSpineSvg size={56} />
          <p className="font-script text-3xl text-ink-900">Remember Forever</p>
          <p className="text-[13px] text-ink-600 max-w-xs">
            Preserve {name}&rsquo;s story in a beautiful printed keepsake &mdash; a gift that lasts generations.
          </p>
        </div>
      </div>
    );
  }

  if (kind === "testimonial") {
    return (
      <div className="bg-white rounded-md p-5 shadow-md border border-cream-200">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={author} />
          <div>
            <p className="text-[13px] font-medium text-ink-900">{author}</p>
            {role && <p className="text-[11px] italic text-ink-500">{role}</p>}
          </div>
        </div>
        <p className="text-[14px] text-ink-800 leading-relaxed">{body}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-md border border-cream-200 overflow-hidden">
      <div className="bg-sage-500 text-white px-5 py-3">
        <p className="text-[12.5px] leading-snug">{title}</p>
      </div>
      <div className="p-5">
        <p className="text-[14px] text-ink-800 leading-relaxed italic">{body}</p>
        <div className="mt-4 flex items-center gap-3">
          <Avatar name={author} />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-ink-900">{author}</p>
            {role && <p className="text-[11px] italic text-ink-500">{role}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }) {
  const initials = (name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  return (
    <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-[13px] font-medium shrink-0">
      {initials}
    </div>
  );
}

/* ─────────────────────────── VIEW MORE ────────────────────────────── */

function ViewMoreButton({ onAdd }) {
  return (
    <Reveal className="text-center">
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.25em] px-8 py-3 rounded-full transition shadow-lg"
      >
        Share a Memory
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </Reveal>
  );
}

/* ─────────────────────────── BOTANICAL BG ─────────────────────────── */

function BotanicalBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <svg className="absolute -top-4 -left-8 opacity-[0.10]" width="200" height="240" viewBox="0 0 200 240">
        <path d="M50 180 C 20 130, 60 60, 100 90 C 80 40, 140 20, 150 80 C 190 55, 210 130, 165 165 C 140 195, 75 220, 50 180Z" fill="#6B8064" />
        <path d="M15 230 C 0 195, 35 165, 65 185 C 42 150, 85 135, 98 165 C 118 140, 155 158, 142 192 C 130 222, 30 265, 15 230Z" fill="#86997D" transform="rotate(-12 80 200)" />
        <line x1="50" y1="180" x2="50" y2="235" stroke="#6B8064" strokeWidth="1.2" opacity="0.5" />
        <line x1="100" y1="90" x2="50" y2="180" stroke="#6B8064" strokeWidth="0.9" opacity="0.35" />
      </svg>
      <svg className="absolute -top-2 -right-6 opacity-[0.09]" width="150" height="200" viewBox="0 0 150 200">
        <path d="M110 30 C 135 70, 120 120, 85 140 C 105 105, 95 55, 110 30Z" fill="#6B8064" />
        <path d="M70 55 C 95 90, 80 140, 45 160 C 65 125, 55 75, 70 55Z" fill="#86997D" />
        <path d="M40 90 C 65 120, 52 165, 18 182 C 38 150, 28 105, 40 90Z" fill="#9DB096" />
        <line x1="110" y1="30" x2="18" y2="182" stroke="#6B8064" strokeWidth="1" opacity="0.4" />
      </svg>
      <svg className="absolute -bottom-4 -right-8 opacity-[0.10]" width="200" height="240" viewBox="0 0 200 240">
        <path d="M150 60 C 180 110, 140 180, 100 150 C 120 200, 60 220, 50 160 C 10 185, -10 110, 35 75 C 60 45, 125 20, 150 60Z" fill="#6B8064" />
        <line x1="150" y1="60" x2="50" y2="160" stroke="#6B8064" strokeWidth="1.2" opacity="0.4" />
      </svg>
      <svg className="absolute top-1/2 -translate-y-1/2 -left-4 opacity-[0.08]" width="100" height="180" viewBox="0 0 100 180">
        <path d="M70 20 C 90 55, 75 100, 50 118 C 68 88, 58 43, 70 20Z" fill="#6B8064" />
        <path d="M45 50 C 65 82, 50 128, 25 145 C 43 115, 33 70, 45 50Z" fill="#86997D" />
        <line x1="70" y1="20" x2="25" y2="145" stroke="#6B8064" strokeWidth="0.9" opacity="0.35" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────── ICONS ────────────────────────────── */

function HeartIcon({ className = "" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.99 22 12z" />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.5L3 21l1.5-5.4A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  );
}

function CandleSvg() {
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" aria-hidden>
      <defs>
        <radialGradient id="flame-m" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE7A0" />
          <stop offset="60%" stopColor="#F4A634" />
          <stop offset="100%" stopColor="#9F4E0A" />
        </radialGradient>
        <radialGradient id="glow-m" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#FFC36A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFC36A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="28" rx="28" ry="22" fill="url(#glow-m)" />
      <path d="M32 14 C 26 22, 26 30, 32 36 C 38 30, 38 22, 32 14 Z" fill="url(#flame-m)" />
      <rect x="31.2" y="34" width="1.6" height="6" fill="#3a2a14" />
      <rect x="22" y="40" width="20" height="36" rx="2" fill="#E0B879" />
      <path d="M22 40 h20" stroke="#9F7A40" strokeWidth="0.5" />
    </svg>
  );
}

function BookSpineSvg({ size = 48 }) {
  const s = size;
  return (
    <svg width={s} height={Math.round(s * 1.3)} viewBox="0 0 48 62" aria-hidden>
      <rect x="6" y="2" width="36" height="52" rx="2" fill="#2F2A24" />
      <rect x="6" y="2" width="6" height="52" fill="#1a1713" />
      <rect x="8" y="10" width="2" height="36" rx="1" fill="#4a4540" />
      <rect x="14" y="8" width="22" height="2" rx="1" fill="#C9A77C" opacity="0.7" />
      <rect x="14" y="14" width="16" height="1.5" rx="0.75" fill="#C9A77C" opacity="0.4" />
      <rect x="14" y="18" width="20" height="1.5" rx="0.75" fill="#C9A77C" opacity="0.4" />
      <rect x="14" y="22" width="14" height="1.5" rx="0.75" fill="#C9A77C" opacity="0.4" />
      <rect x="6" y="56" width="36" height="4" rx="1" fill="#C9A77C" opacity="0.5" />
    </svg>
  );
}

function FlowerClusterSvg({ size = 48 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="16" r="6" fill="#D4A5A5" opacity="0.9" />
      <circle cx="14" cy="26" r="6" fill="#C9A77C" opacity="0.85" />
      <circle cx="34" cy="26" r="6" fill="#D4A5A5" opacity="0.85" />
      <circle cx="24" cy="32" r="6" fill="#9DB096" opacity="0.8" />
      <path d="M24 44V36" stroke="#6B8064" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 40 C18 38, 16 36, 14 38" stroke="#6B8064" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FloralDot() {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" aria-hidden>
      <circle cx="6" cy="6" r="2" fill="#9DB096" />
      <circle cx="20" cy="6" r="3" fill="#C9A77C" />
      <circle cx="34" cy="6" r="2" fill="#9DB096" />
    </svg>
  );
}
