import Reveal from "./Reveal";

const shareIcons = [
  { label: "QR Code", color: "bg-ink-900", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3zM18 18h3v3h-3z" fill="currentColor"/></svg>
  )},
  { label: "Facebook", color: "bg-[#1877F2]", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.99 22 12z"/></svg>
  )},
  { label: "Twitter", color: "bg-[#1DA1F2]", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8a8.5 8.5 0 0 1-2.36.65 4.07 4.07 0 0 0 1.81-2.27 8.2 8.2 0 0 1-2.6 1A4.1 4.1 0 0 0 11.85 9 11.65 11.65 0 0 1 3 4.6a4.1 4.1 0 0 0 1.27 5.49A4 4 0 0 1 2.4 9.6v.05a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.85.07 4.1 4.1 0 0 0 3.83 2.85A8.24 8.24 0 0 1 2 18.28 11.62 11.62 0 0 0 8.29 20c7.55 0 11.68-6.25 11.68-11.67v-.53A8.2 8.2 0 0 0 22 5.8z"/></svg>
  )},
  { label: "WhatsApp", color: "bg-[#25D366]", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-1s-.5-.1-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.3 5.2 4.6.7.3 1.3.5 1.8.6.7.2 1.4.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.3 8.3 0 1 1 7.1 4z"/></svg>
  )},
  { label: "LinkedIn", color: "bg-[#0A66C2]", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.2 8.4h3.5V21H3.2V8.4zm5.6 0h3.4v1.7h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7V21h-3.5v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H8.8V8.4z"/></svg>
  )},
  { label: "Email", color: "bg-[#E04B4B]", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.8"/><path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.8"/></svg>
  )},
  { label: "SMS", color: "bg-sage-500", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.5L3 21l1.5-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg>
  )},
  { label: "Share", color: "bg-copper-500", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 6l-4-4-4 4M12 2v14M5 12v8h14v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )},
  { label: "Copy Link", color: "bg-ink-700", svg: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  )},
];

export default function Livestream() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-24 bg-cream-100">
      {/* Share icons row */}
      <Reveal className="flex items-center gap-3 md:gap-4 flex-wrap justify-center text-white">
        {shareIcons.map((s) => (
          <button
            key={s.label}
            aria-label={s.label}
            className={`${s.color} w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:-translate-y-0.5 transition-transform`}
          >
            {s.svg}
          </button>
        ))}
      </Reveal>

      {/* Floral divider */}
      <Reveal delay={120} className="mt-14 flex items-center w-full max-w-3xl px-6">
        <div className="flex-1 divider-line" />
        <FloralCluster />
        <div className="flex-1 divider-line" />
      </Reveal>

      {/* Service banner */}
      <Reveal delay={200} className="mt-10 text-center">
        <div className="inline-block bg-sage-500 text-white px-10 py-4 rounded-sm shadow-lg">
          <p className="font-display text-xl md:text-2xl tracking-wide">
            Funeral Service for Name of Deceased
          </p>
          <p className="text-xs md:text-sm tracking-[0.18em] mt-1 text-cream-100/90">
            SAT, 6 SEP 2025 · 11:00 – 12:00 SAST
          </p>
        </div>
      </Reveal>

      {/* Video player */}
      <Reveal delay={280} className="mt-8 w-full max-w-3xl px-6">
        <div className="relative aspect-video rounded-md overflow-hidden shadow-2xl bg-ink-900 group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80&auto=format&fit=crop"
            alt="Funeral service video preview"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black/55 backdrop-blur flex items-center justify-center ring-2 ring-white/70 group-hover:scale-110 transition">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FloralCluster() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" className="mx-4" fill="none">
      <path d="M20 20c8-6 16-6 24 0" stroke="#9DB096" strokeWidth="1.2" />
      <path d="M76 20c8 6 16 6 24 0" stroke="#9DB096" strokeWidth="1.2" />
      <circle cx="60" cy="20" r="4" fill="#E9DFC7" stroke="#C9A77C" />
      <circle cx="50" cy="14" r="2.5" fill="#9DB096" />
      <circle cx="70" cy="26" r="2.5" fill="#9DB096" />
      <circle cx="68" cy="14" r="2" fill="#C9A77C" />
      <circle cx="52" cy="26" r="2" fill="#C9A77C" />
    </svg>
  );
}
