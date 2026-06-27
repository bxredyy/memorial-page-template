import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// Exchanges the magic-link code for a session, then redirects to the dashboard.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/dashboard?error=auth`);
}
