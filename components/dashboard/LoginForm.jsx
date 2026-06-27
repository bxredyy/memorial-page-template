"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError("");
    const supabase = getSupabaseBrowser();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) {
      setStatus("error");
      setError(err.message);
    } else {
      setStatus("sent");
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-8 py-10">
        <h1 className="font-script text-5xl text-sage-600 text-center">Family Login</h1>
        <p className="mt-3 text-center text-ink-600 text-[14px]">
          Manage your loved one&rsquo;s memorial page — approve messages, photos,
          and tributes.
        </p>

        {status === "sent" ? (
          <div className="mt-8 text-center">
            <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-4 font-display text-xl text-ink-900">Check your email</p>
            <p className="mt-2 text-[14px] text-ink-600">
              We sent a secure sign-in link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-600 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="tl-input"
              placeholder="you@example.com"
            />
            {error && <p className="mt-3 text-[13px] text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-5 w-full bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.22em] py-3.5 rounded-sm transition"
            >
              {status === "sending" ? "Sending…" : "Send Sign-In Link"}
            </button>
            <p className="mt-4 text-[12px] text-ink-500 text-center">
              No account yet? Signing in creates one automatically.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
