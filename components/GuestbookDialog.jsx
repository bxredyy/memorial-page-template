"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useMemorial } from "./MemorialContext";
import { getSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Submission dialog for guestbook entries, tributes, candles and prompt answers.
 * Writes a `pending` row via the anon client (RLS allows public pending inserts);
 * the family approves it from the dashboard before it appears publicly.
 */
export default function GuestbookDialog({
  open,
  onClose,
  type = "guestbook",
  prompt = null,
  promptLabel = null,
}) {
  const m = useMemorial();
  const [form, setForm] = useState({ name: "", relationship: "", email: "", body: "" });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [error, setError] = useState("");

  const isCandle = type === "candle";
  const isGuestbook = type === "guestbook";

  const titles = {
    guestbook: `Sign ${m.name}'s Guest Book`,
    tribute: `Share a Memory of ${m.name}`,
    candle: `Light a Candle for ${m.name}`,
    prompt_answer: promptLabel || "Share Your Answer",
  };

  const reset = () => {
    setForm({ name: "", relationship: "", email: "", body: "" });
    setStatus("idle");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please add your name.");
      return;
    }
    if (!isGuestbook && !isCandle && !form.body.trim()) {
      setError("Please write a short message.");
      return;
    }
    setStatus("saving");
    setError("");

    const supabase = getSupabaseBrowser();
    const { error: insErr } = await supabase.from("memories").insert({
      memorial_id: m.id,
      type,
      status: "pending",
      author_name: form.name.trim(),
      author_email: form.email.trim() || null,
      relationship: form.relationship.trim() || null,
      prompt: prompt,
      body: form.body.trim() || null,
      is_candle: isCandle,
    });

    if (insErr) {
      setStatus("error");
      setError(insErr.message || "Something went wrong. Please try again.");
      return;
    }
    setStatus("done");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {status === "done" ? (
        <div className="px-8 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-5 font-display text-2xl text-ink-900">Thank you</h3>
          <p className="mt-2 text-ink-600 text-[14px] max-w-xs mx-auto leading-relaxed">
            Your {isCandle ? "candle" : "message"} has been shared with {m.name}&rsquo;s
            family and will appear once they&rsquo;ve approved it.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 bg-sage-500 hover:bg-sage-600 text-white text-[12px] uppercase tracking-[0.2em] px-7 py-3 rounded-sm transition"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-8 py-9">
          <h3 className="font-script text-4xl text-sage-600 text-center">
            {titles[type] || titles.guestbook}
          </h3>
          {prompt && (
            <p className="mt-2 text-center text-[13px] text-ink-600 italic">
              &ldquo;{prompt}&rdquo;
            </p>
          )}

          <div className="mt-6 space-y-4">
            <Field label="Your name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="tl-input"
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Your relationship (optional)">
              <input
                type="text"
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="tl-input"
                placeholder="Friend, colleague, neighbour…"
              />
            </Field>
            {!isCandle && (
              <Field label={isGuestbook ? "Message (optional)" : "Your message"} required={!isGuestbook}>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={4}
                  className="tl-input resize-none"
                  placeholder={isGuestbook ? "A few words of comfort…" : "Share your memory here…"}
                />
              </Field>
            )}
            {isCandle && (
              <Field label="A short message (optional)">
                <input
                  type="text"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="tl-input"
                  placeholder="In loving memory…"
                />
              </Field>
            )}
            <Field label="Email (optional, kept private)">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="tl-input"
                placeholder="you@example.com"
              />
            </Field>
          </div>

          {error && <p className="mt-3 text-[13px] text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="mt-6 w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.22em] py-3.5 rounded-sm transition"
          >
            {status === "saving"
              ? "Sending…"
              : isCandle
              ? "Light the Candle"
              : "Share With the Family"}
          </button>
          <p className="mt-3 text-[11px] text-ink-500 text-center">
            Your submission is reviewed by the family before it appears.
          </p>
        </form>
      )}
    </Modal>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-600 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
