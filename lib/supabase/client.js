"use client";

import { createBrowserClient } from "@supabase/ssr";

let browserClient;

/** Singleton Supabase client for use in Client Components (anon key + RLS). */
export function getSupabaseBrowser() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return browserClient;
}
