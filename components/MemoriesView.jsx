"use client";

import { useRef, useState } from "react";
import Reveal from "./Reveal";

/* ─────────────────────────────── DATA ─────────────────────────────── */

const prompts = [
  { type: "book" },
  { type: "me", placeholder: "Share a message or condolence with others..." },
  { type: "prompt", title: "How did you know [Name]?" },
  { type: "prompt", title: "What is something interesting about [Name] that others might not know?" },
  { type: "prompt", title: "In just a few words, how would you describe [Name]?" },
  { type: "prompt", title: "What made [Name] uniquely, wonderfully themselves?" },
  { type: "candle" },
  { type: "prompt", title: "What is a funny story about [Name]?" },
  { type: "prompt", title: "What do you want someone reading this 100 years from now to know about [Name]?" },
  { type: "prompt", title: "How did [Name] make the world a better place?" },
  { type: "prompt", title: "What was [Name]'s greatest strength?" },
  { type: "prompt", title: "What is a lesson [Name] taught you that you carry with you today?" },
  { type: "flowers" },
  { type: "prompt", title: "What is [Name]'s legacy?" },
  { type: "prompt", title: "What is something you will always remember about [Name]?" },
  { type: "prompt", title: "What is a piece of advice [Name] gave you?" },
  { type: "prompt", title: "What is your favourite memory with [Name]?" },
  { type: "prompt", title: "How did [Name] show love to the people around her?" },
  { type: "support" },
  { type: "prompt", title: "What would you want [Name] to know today?" },
  { type: "prompt", title: "What do you miss most about [Name]?" },
  { type: "prompt", title: "What song or piece of music reminds you of [Name]?" },
  { type: "prompt", title: "What was [Name]'s favourite thing to do?" },
  { type: "prompt", title: "What is a moment with [Name] you wish you could relive?" },
  { type: "prompt", title: "How would [Name] want to be remembered?" },
  { type: "prompt", title: "What did [Name] mean to you, in your own words?" },
  { type: "prompt", title: "Describe the feeling of being in [Name]'s company." },
  { type: "prompt", title: "What is something [Name] would have said right now, if she could?" },
];

const memories = [
  {
    kind: "titled",
    title: "What does John want someone reading this 100 years from now to know about [Name]?",
    body: "I will always cherish the fond memories I have of my grandma. I’ll keep her in my heart and mind forever. She’ll never be forgotten.",
    author: "John Baker",
    role: "[Name]’s Grandson",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    kind: "testimonial",
    body: "[Name] was a dear friend. We grew up on the same street as kids and we have remained friends ever since.",
    author: "William Clark",
    role: "[Name]’s Friend",
    avatar: "https://i.pravatar.cc/120?img=14",
  },
  {
    kind: "titled",
    title: "What is a funny story about [Name]?",
    body: "Grandma Eve loved animals. Every time we got a new pet we’d name it after a song or artist. We’d welcome it into our home by gathering in the living room and playing the music.",
    author: "John Baker",
    role: "[Name]’s Grandson",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    kind: "testimonial",
    body: "I will always cherish the fond memories I have of my grandma. I’ll keep her in my heart and mind forever. She’ll never be forgotten.",
    author: "John Baker",
    role: "[Name]’s Grandson",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    kind: "testimonial",
    body: "When I think of [Name] I think of the joy she brought to this world. It was so easy and pleasant to be in her company. She cared about everyone around her.",
    author: "Tara Nelson",
    role: "[Name]’s Friend",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    kind: "candle",
    quote: "Her smile and loving nature will be missed.",
    litBy: "Ella Baker-Thompson",
    role: "[Name]’s Daughter",
  },
  { kind: "business-flowers" },
  {
    kind: "titled",
    title: "What is a funny story about [Name]?",
    body: "“I can’t tell the difference between a rose and a dandelion. So when it came time to fix up my garden one spring, I had no clue which plants to keep and which ones to remove. Until, that is, [Name] gave me this handy tip: ‘Pull them all up. If it comes back, it’s a weed.’”",
    author: "Tara Nelson",
    role: "[Name]’s Friend",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    kind: "titled",
    title: "How did Tara know [Name]?",
    body: "“[Name] and I grew up together. I knew her through Junior High and High School and we remained close. She was a beautiful person and I miss her dearly.”",
    author: "Tara Nelson",
    role: "[Name]’s Friend",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    kind: "testimonial",
    body: "Some of our greatest blessings are knowing warm and gentle people. I count having [Name] as a friend and being pulled into her family as one of the greatest moments of my life. I never took it for granted. I felt lucky each time there was an opportunity to spend time…",
    author: "Tara Nelson",
    role: "[Name]’s Friend",
    avatar: "https://i.pravatar.cc/120?img=47",
    truncated: true,
  },
  {
    kind: "titled",
    title: "What is a funny story about [Name]?",
    body: "“Mom had a small decorative windmill in her yard. A storm broke one of the blades, causing the windmill to shake violently. Dad announced that he would ‘take care of it’ and rebalanced the windmill by snapping off the opposing blade. Watching him, Mom remarked, ‘I hope I…’”",
    author: "Ella Baker-Thompson",
    role: "[Name]’s Daughter",
    avatar: "https://i.pravatar.cc/120?img=45",
    truncated: true,
  },
  {
    kind: "testimonial",
    body: "[Name] had a way of making you feel completely at home. Her kitchen always smelled of something baking, and she had time for anyone who knocked on her door. That was just who she was — open, warm, generous.",
    author: "Margaret Owens",
    role: "[Name]’s Neighbour",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
  {
    kind: "titled",
    title: "How did [Name] make the world a better place?",
    body: "“She was always the first to show up when someone needed help. Moving furniture, dropping off meals, sitting quietly with someone in grief. She didn’t talk about doing good — she just did it.”",
    author: "David Chen",
    role: "[Name]’s Colleague",
    avatar: "https://i.pravatar.cc/120?img=55",
  },
  { kind: "business-book" },
  {
    kind: "testimonial",
    body: "She taught me how to make her famous lemon cake when I was eight years old. I still make it every birthday. I’ll be making it for the rest of my life.",
    author: "Sarah Mitchell",
    role: "[Name]’s Granddaughter",
    avatar: "https://i.pravatar.cc/120?img=39",
  },
  {
    kind: "candle",
    quote: "A light that will never truly go out.",
    litBy: "James Baker",
    role: "[Name]’s Son",
  },
  {
    kind: "titled",
    title: "What is [Name]’s legacy?",
    body: "“She raised a family, built a community, and touched more lives than she ever knew. Her legacy is not just the family she left behind — it’s every person who was kinder for having known her.”",
    author: "Ella Baker-Thompson",
    role: "[Name]’s Daughter",
    avatar: "https://i.pravatar.cc/120?img=45",
  },
];

/* ─────────────────────────────── ROOT ─────────────────────────────── */

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

/* ─────────────────────────── GUESTBOOK MINI ───────────────────────── */

function GuestbookMini({ compact = false }) {
  return (
    <Reveal as="div" className={`text-center ${compact ? "" : "border-t border-sage-200/60 pt-12"}`}>
      <HeartIcon className="mx-auto text-sage-600" />
      <p className="mt-3 text-ink-700 max-w-md mx-auto">
        Show your {compact ? "support" : "love and support"} by adding your name
        to&nbsp;[Name]&rsquo;s Guestbook.
      </p>
      <button className="mt-4 border border-dashed border-sage-500 text-sage-700 hover:bg-sage-50 text-[12px] uppercase tracking-[0.22em] px-7 py-2.5 rounded-full transition">
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

function PromptCarousel() {
  const trackRef = useRef(null);
  const scroll = (delta) => trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });

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
        <div className="flex items-stretch gap-5 px-14 py-6">
          {prompts.map((p, i) => (
            <PromptCard key={i} {...p} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function PromptCard({ type, title, placeholder }) {
  const [val, setVal] = useState("");

  if (type === "book") {
    return (
      <div className="shrink-0 w-[280px] rounded-md overflow-hidden bg-white shadow-lg flex flex-col border border-cream-200">
        <div className="flex-1 px-6 py-8 text-center flex flex-col items-center justify-center gap-3">
          <BookSpineSvg />
          <p className="font-script text-3xl text-ink-900 leading-tight">
            Remember<br />Forever
          </p>
          <p className="text-[12px] text-ink-600 leading-relaxed">
            Preserve [Name]&rsquo;s story in a beautiful printed keepsake book.
          </p>
        </div>
        <button className="bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.25em] py-3 transition">
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
            Send a beautiful arrangement directly to [Name]&rsquo;s family.
          </p>
        </div>
        <button className="bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.25em] py-3 transition">
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
        <button className="bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
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
        <button className="bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
          Show Support Options
        </button>
      </div>
    );
  }

  const isMe = type === "me";
  return (
    <div className="shrink-0 w-[260px] rounded-md overflow-hidden bg-white shadow-lg flex flex-col relative">
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
      <div className="flex-1 p-4">
        <textarea
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={isMe ? placeholder : "Share your memory here…"}
          className="w-full h-[150px] resize-none text-[13px] text-ink-800 placeholder:text-ink-500/70 bg-transparent outline-none leading-relaxed"
        />
      </div>
      <button className="w-full border-t border-sage-100 text-sage-700 hover:bg-sage-50 text-[11px] uppercase tracking-[0.22em] py-3 transition flex items-center justify-center gap-2">
        <HeartIcon className="w-3.5 h-3.5" /> Click to Save
      </button>
    </div>
  );
}

/* ─────────────────────────── MEMORIES HEADER ──────────────────────── */

function MemoriesHeader({ count }) {
  return (
    <Reveal className="flex items-center justify-center gap-4">
      <FloralDot />
      <p className="text-[11px] uppercase tracking-[0.35em] text-sage-700">
        {count} Memories Preserved
      </p>
      <FloralDot />
    </Reveal>
  );
}

/* ─────────────────────────── MEMORIES MASONRY ─────────────────────── */

function MemoriesMasonry() {
  return (
    <Reveal className="relative">
      <BotanicalBg />
      <div className="relative z-10 columns-1 md:columns-2 xl:columns-3 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
        {memories.map((m, i) => (
          <MemoryCard key={i} {...m} />
        ))}
      </div>
    </Reveal>
  );
}

function MemoryCard({ kind, title, body, author, role, avatar, quote, litBy, truncated }) {
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
            <p className="text-[11px] italic text-white/70">{role}</p>
          </div>
        </div>
        <button className="block w-full bg-sage-600 hover:bg-sage-700 text-white text-[11px] uppercase tracking-[0.22em] py-3 transition">
          Light a Candle for [Name]
        </button>
      </div>
    );
  }

  if (kind === "business-flowers") {
    return (
      <div className="rounded-md overflow-hidden bg-white border border-cream-200 shadow-md">
        <div className="px-6 py-7 text-center flex flex-col items-center gap-3">
          <FlowerClusterSvg size={56} />
          <p className="font-script text-3xl text-ink-900">
            Flowers can often say it best
          </p>
          <p className="text-[13px] text-ink-600 max-w-xs">
            Send beautiful flowers directly to [Name]&rsquo;s family to show your love and support.
          </p>
          <button className="mt-1 bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.22em] px-6 py-2.5 rounded-sm transition shadow">
            Send Flowers to Family
          </button>
        </div>
      </div>
    );
  }

  if (kind === "business-book") {
    return (
      <div className="rounded-md overflow-hidden bg-sage-50 border border-sage-200/60 shadow-md">
        <div className="px-6 py-7 text-center flex flex-col items-center gap-3">
          <BookSpineSvg size={56} />
          <p className="font-script text-3xl text-ink-900">
            Remember Forever
          </p>
          <p className="text-[13px] text-ink-600 max-w-xs">
            Preserve [Name]&rsquo;s story in a beautiful printed keepsake — a gift that lasts generations.
          </p>
          <button className="mt-1 bg-sage-500 hover:bg-sage-600 text-white text-[11px] uppercase tracking-[0.22em] px-6 py-2.5 rounded-sm transition shadow">
            Build a Remember Book
          </button>
        </div>
      </div>
    );
  }

  if (kind === "testimonial") {
    return (
      <div className="bg-white rounded-md p-5 shadow-md border border-cream-200">
        <div className="flex items-center gap-3 mb-3">
          <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-[13px] font-medium text-ink-900">{author}</p>
            <p className="text-[11px] italic text-ink-500">{role}</p>
          </div>
        </div>
        <p className="text-[14px] text-ink-800 leading-relaxed">
          {body}
          {truncated && (
            <button className="block mt-3 text-[11px] uppercase tracking-[0.22em] text-sage-700 hover:underline">
              Read More ▾
            </button>
          )}
        </p>
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
        {truncated && (
          <button className="mt-3 text-[11px] uppercase tracking-[0.22em] text-sage-700 hover:underline flex items-center gap-1">
            Read More <span aria-hidden>▾</span>
          </button>
        )}
        <div className="mt-4 flex items-center gap-3">
          <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-ink-900">{author}</p>
            <p className="text-[11px] italic text-ink-500">{role}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end px-5 pb-5 -mt-2">
        <button className="bg-copper-500 hover:bg-copper-600 text-white text-[11px] uppercase tracking-[0.22em] px-4 py-2 rounded-full shadow flex items-center gap-1.5 transition">
          <PlusIconSm className="w-3 h-3" /> Share Your Answer
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── VIEW MORE ────────────────────────────── */

function ViewMoreButton() {
  return (
    <Reveal className="text-center">
      <button className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.25em] px-8 py-3 rounded-full transition shadow-lg">
        Click to View More Memories
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </Reveal>
  );
}

/* ─────────────────────────── BOTANICAL BG ─────────────────────────── */

function BotanicalBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Top-left leaf cluster */}
      <svg className="absolute -top-4 -left-8 opacity-[0.10]" width="200" height="240" viewBox="0 0 200 240">
        <path d="M50 180 C 20 130, 60 60, 100 90 C 80 40, 140 20, 150 80 C 190 55, 210 130, 165 165 C 140 195, 75 220, 50 180Z" fill="#6B8064" />
        <path d="M15 230 C 0 195, 35 165, 65 185 C 42 150, 85 135, 98 165 C 118 140, 155 158, 142 192 C 130 222, 30 265, 15 230Z" fill="#86997D" transform="rotate(-12 80 200)" />
        <line x1="50" y1="180" x2="50" y2="235" stroke="#6B8064" strokeWidth="1.2" opacity="0.5" />
        <line x1="100" y1="90" x2="50" y2="180" stroke="#6B8064" strokeWidth="0.9" opacity="0.35" />
      </svg>

      {/* Top-right sprig */}
      <svg className="absolute -top-2 -right-6 opacity-[0.09]" width="150" height="200" viewBox="0 0 150 200">
        <path d="M110 30 C 135 70, 120 120, 85 140 C 105 105, 95 55, 110 30Z" fill="#6B8064" />
        <path d="M70 55 C 95 90, 80 140, 45 160 C 65 125, 55 75, 70 55Z" fill="#86997D" />
        <path d="M40 90 C 65 120, 52 165, 18 182 C 38 150, 28 105, 40 90Z" fill="#9DB096" />
        <line x1="110" y1="30" x2="18" y2="182" stroke="#6B8064" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Bottom-right cluster */}
      <svg className="absolute -bottom-4 -right-8 opacity-[0.10]" width="200" height="240" viewBox="0 0 200 240">
        <path d="M150 60 C 180 110, 140 180, 100 150 C 120 200, 60 220, 50 160 C 10 185, -10 110, 35 75 C 60 45, 125 20, 150 60Z" fill="#6B8064" />
        <line x1="150" y1="60" x2="50" y2="160" stroke="#6B8064" strokeWidth="1.2" opacity="0.4" />
      </svg>

      {/* Mid-left sprig */}
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

function PlusIconSm({ className = "" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function TreeSvg({ className = "" }) {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" className={className} aria-hidden>
      <path d="M20 50l14-30 14 30z" fill="#6B8064" />
      <path d="M20 40l14-30 14 30z" fill="#86997D" />
      <path d="M20 30l14-30 14 30z" fill="#A9B999" />
      <rect x="32" y="50" width="6" height="8" fill="#6B5742" />
      <path d="M52 52l10-18 10 18z" fill="#6B8064" />
      <rect x="60" y="52" width="4" height="6" fill="#6B5742" />
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
