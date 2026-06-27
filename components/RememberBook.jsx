"use client";

import Reveal from "./Reveal";
import { useMemorial } from "./MemorialContext";

export default function RememberBook() {
  const m = useMemorial();
  const years = [m.birthYear, m.deathYear].filter(Boolean).join(" — ");
  const cover = m.photos?.[0]?.url || m.hero_image_url || "https://picsum.photos/seed/memorial-book/700/560";

  return (
    <section className="relative min-h-screen bg-cream-100 py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal as="h2" className="font-script text-5xl md:text-6xl text-sage-600">
          {m.name}&rsquo;s Remember Book
        </Reveal>

        {/* Book mockup */}
        <Reveal delay={120} className="mt-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-3 bg-ink-900/15 blur-2xl rounded-lg" />
            <div className="relative w-[340px] aspect-[5/4] bg-ink-900 rounded-md overflow-hidden shadow-2xl border border-ink-700/40">
              <img
                src={cover}
                alt={`${m.name}'s memorial book cover`}
                className="w-full h-full object-cover opacity-90 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <p className="font-script text-3xl text-copper-400">{m.name}</p>
                {years && (
                  <p className="text-[11px] tracking-[0.3em] mt-1 text-white/80">
                    {years}
                  </p>
                )}
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
          This book includes heartfelt photos and memories that {m.name}&rsquo;s loved
          ones shared on this page. Professionally arranged and enhanced into a
          stunning printed keepsake.
        </p>
        <p className="mt-2 text-[12px] text-ink-500 italic">
          No extra cost. Just relax, approve, and print your perfect keepsake.
        </p>

        <button className="mt-6 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.22em] px-8 py-3 rounded-sm transition shadow-lg">
          View {m.name}&rsquo;s Book
        </button>
        <p className="mt-3 text-[11px] text-ink-500 italic">
          Preview for free
        </p>
      </div>
    </section>
  );
}
