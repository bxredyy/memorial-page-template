"use client";

import { useEffect, useRef, useState } from "react";
import { timelineData } from "./timeline/timelineData";

export default function LifeTimeline() {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rafRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let engine = null;

    (async () => {
      const { Engine } = await import("./timeline/Engine");
      if (!isMounted || !canvasRef.current || !stickyRef.current) return;

      engine = new Engine(canvasRef.current, stickyRef.current);
      engineRef.current = engine;
      try {
        await engine.init();
      } catch (err) {
        console.error("Timeline engine init failed", err);
        return;
      }
      if (!isMounted) {
        engine.dispose();
        return;
      }
      setIsReady(true);
    })();

    return () => {
      isMounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  // Drive engine progress from native page scroll.
  useEffect(() => {
    if (!isReady) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let lastIndex = -1;

    const tick = () => {
      const engine = engineRef.current;
      if (!engine) return;

      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrollDistance = Math.max(rect.height - viewportHeight, 1);
      // 0 when wrapper top hits viewport top; 1 when wrapper bottom hits viewport bottom.
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      engine.setProgress(progress);

      const idx = engine.getActivePlaneIndex();
      if (idx !== lastIndex) {
        lastIndex = idx;
        setActiveIndex(idx);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady]);

  const active = timelineData[activeIndex] || timelineData[0];
  const isDarkText = activeIndex < 2;

  return (
    <section
      ref={wrapperRef}
      id="life-timeline"
      className="relative bg-cream-100"
      style={{ height: `${timelineData.length * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Top section heading */}
        <div className="absolute top-0 left-0 right-0 pt-10 md:pt-14 px-6 md:px-10 pointer-events-none z-10">
          <div className="text-center">
            <p
              className={`text-[11px] uppercase tracking-[0.4em] transition-colors duration-700 ${
                isDarkText ? "text-ink-700" : "text-white/80"
              }`}
            >
              A Life in Moments
            </p>
            <h2
              className={`mt-3 font-script text-4xl md:text-6xl transition-colors duration-700 ${
                isDarkText ? "text-ink-900" : "text-white"
              }`}
              style={{ textShadow: isDarkText ? "none" : "0 2px 24px rgba(0,0,0,0.25)" }}
            >
              The Life of [Name]
            </h2>
          </div>
        </div>

        {/* Year + caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 md:pb-16 pointer-events-none z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div
              key={`left-${activeIndex}`}
              className={`transition-colors duration-700 ${
                isDarkText ? "text-ink-900" : "text-white"
              }`}
              style={{ animation: "tlFadeUp 700ms ease-out" }}
            >
              <p
                className={`text-[11px] uppercase tracking-[0.32em] mb-2 ${
                  isDarkText ? "text-ink-600" : "text-white/75"
                }`}
              >
                {String(activeIndex + 1).padStart(2, "0")} &nbsp;/&nbsp; {String(timelineData.length).padStart(2, "0")}
              </p>
              <p
                className="font-script text-5xl md:text-7xl leading-none"
                style={{ textShadow: isDarkText ? "none" : "0 2px 24px rgba(0,0,0,0.25)" }}
              >
                {active.year}
              </p>
              <p
                className={`mt-2 text-[12px] uppercase tracking-[0.28em] ${
                  isDarkText ? "text-ink-600" : "text-white/85"
                }`}
              >
                {active.lifePhase}
              </p>
            </div>
            <div
              key={`right-${activeIndex}`}
              className={`md:text-right transition-colors duration-700 ${
                isDarkText ? "text-ink-800" : "text-white/95"
              }`}
              style={{ animation: "tlFadeUp 700ms ease-out 80ms backwards" }}
            >
              <p
                className="font-display text-xl md:text-2xl leading-snug"
                style={{ textShadow: isDarkText ? "none" : "0 2px 18px rgba(0,0,0,0.25)" }}
              >
                {active.caption}
              </p>
              <p
                className={`mt-2 text-[13px] italic leading-relaxed max-w-md md:ml-auto ${
                  isDarkText ? "text-ink-600" : "text-white/80"
                }`}
              >
                {active.description}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {timelineData.map((_, i) => (
              <span
                key={i}
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  isDarkText ? "bg-ink-900" : "bg-white"
                } ${i === activeIndex ? "w-10 opacity-100" : "w-4 opacity-40"}`}
              />
            ))}
          </div>
        </div>

        {/* Loading veil */}
        {!isReady && (
          <div className="absolute inset-0 bg-cream-100 flex items-center justify-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink-500">
              Preparing the journey…
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes tlFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
