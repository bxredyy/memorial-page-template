"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  threshold = 0.15,
  once = true,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
