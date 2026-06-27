"use client";

import { createContext, useContext, useMemo } from "react";
import {
  shortName,
  formatLongDate,
  year,
  ageBetween,
} from "@/lib/format";

const MemorialContext = createContext(null);

/**
 * Wraps the page with the server-fetched memorial and exposes derived,
 * formatted fields the client components need. This lets the existing
 * components read live data via useMemorial() instead of hardcoded copy.
 */
export function MemorialProvider({ memorial, children }) {
  const value = useMemo(() => {
    const name = shortName(memorial) || "[Name]";
    return {
      ...memorial,
      name,
      fullName: memorial?.full_name || "Name of Deceased",
      birthDateLong: formatLongDate(memorial?.date_of_birth),
      deathDateLong: formatLongDate(memorial?.date_of_death),
      birthYear: year(memorial?.date_of_birth),
      deathYear: year(memorial?.date_of_death),
      age: ageBetween(memorial?.date_of_birth, memorial?.date_of_death),
      memories: memorial?.memories ?? [],
      photos: memorial?.photos ?? [],
    };
  }, [memorial]);

  return (
    <MemorialContext.Provider value={value}>
      {children}
    </MemorialContext.Provider>
  );
}

export function useMemorial() {
  const ctx = useContext(MemorialContext);
  if (!ctx) {
    // Allow components to render in isolation (e.g. Storybook) with safe defaults.
    return {
      id: null,
      name: "[Name]",
      fullName: "Name of Deceased",
      memories: [],
      photos: [],
    };
  }
  return ctx;
}
