import Reveal from "./Reveal";

const keepsakes = [
  { label: null, img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80", price: "$78" },
  { label: null, img: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80", price: "$92" },
  { label: null, img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80", price: "$110" },
  { label: "Show Support", img: null, accent: "sage" },
  { label: "Send Flowers", img: null, accent: "rose" },
];

export default function RememberBook() {
  return (
    <section className="relative min-h-screen bg-cream-100 py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal as="h2" className="font-script text-5xl md:text-6xl text-sage-600">
          [Name]’s Remember Book
        </Reveal>

        {/* Book mockup */}
        <Reveal delay={120} className="mt-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-3 bg-ink-900/15 blur-2xl rounded-lg" />
            <div className="relative w-[340px] aspect-[5/4] bg-ink-900 rounded-md overflow-hidden shadow-2xl border border-ink-700/40">
              <img
                src="https://picsum.photos/seed/evelyn-book/700/560"
                alt="[Name]'s memorial book cover"
                className="w-full h-full object-cover opacity-90 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <p className="font-script text-3xl text-copper-400">[Name]</p>
                <p className="text-[11px] tracking-[0.3em] mt-1 text-white/80">
                  1929 — 2021
                </p>
              </div>
              {/* Spine */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/70 to-transparent" />
            </div>
          </div>
        </Reveal>

        <h3 className="mt-10 font-display text-3xl text-ink-900">
          Preserve a Lifetime of Memories with Just a Few Clicks
        </h3>
        <p className="mt-4 text-ink-700 max-w-2xl mx-auto leading-relaxed">
          This book includes heartfelt photos and memories that [Name]’s loved
          ones shared on this page. Professionally arranged and enhanced into a
          stunning printed keepsake.
        </p>
        <p className="mt-2 text-[12px] text-ink-500 italic">
          No extra cost. Just relax, approve, and print your perfect keepsake.
        </p>

        <button className="mt-6 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.22em] px-8 py-3 rounded-sm transition shadow-lg">
          View [Name]’s Book
        </button>
        <p className="mt-3 text-[11px] text-ink-500 italic">
          Preview for free
        </p>

        {/* Keepsake cards */}
        <Reveal className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-5">
          {keepsakes.map((k, i) => (
            <KeepsakeCard key={i} {...k} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function KeepsakeCard({ label, img, accent, price }) {
  if (img) {
    return (
      <button className="group relative rounded-lg overflow-hidden bg-cream-200 aspect-[4/5] shadow hover:shadow-xl transition">
        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left">
          <p className="text-white text-[11px] uppercase tracking-[0.18em]">Tap to view card</p>
          <p className="text-white font-display text-lg">{price}</p>
        </div>
      </button>
    );
  }
  const bg = accent === "sage" ? "bg-sage-100" : "bg-rose-50";
  return (
    <button className={`group rounded-lg ${bg} aspect-[4/5] shadow hover:shadow-xl transition flex flex-col items-center justify-center p-4`}>
      {accent === "sage" ? (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-sage-700">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-rose-400">
          <circle cx="12" cy="8" r="3" fill="currentColor" />
          <circle cx="7" cy="13" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="17" cy="13" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="16" r="3" fill="currentColor" />
          <path d="M12 22V19" stroke="#6B8064" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      <p className="mt-3 font-script text-2xl text-ink-900">{label}</p>
      <p className="mt-1 text-[11px] text-ink-700 px-3">
        {accent === "sage"
          ? "Show meaningful support for [Name]’s family during this time."
          : "Click to send beautiful flowers directly to [Name]’s family."}
      </p>
    </button>
  );
}
