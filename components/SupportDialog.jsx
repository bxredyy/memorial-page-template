"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useMemorial } from "./MemorialContext";

// Suggested contribution amounts (in ZAR) per support type.
const PRESETS = {
  flowers: [250, 500, 750],
  grocery: [300, 500, 1000],
  meals: [300, 600, 1000],
  funeral: [500, 1000, 2500],
  gift: [250, 500, 1000],
  candle: [0],
  prayer: [0],
  book: [0],
};

export default function SupportDialog({ optionKey, options, onClose }) {
  const m = useMemorial();
  const open = !!optionKey;
  const option = options?.find((o) => o.key === optionKey);

  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  const presets = PRESETS[optionKey] || [250, 500, 1000];
  const monetary = presets.some((p) => p > 0);

  useEffect(() => {
    if (open) {
      setAmount(presets.find((p) => p > 0) ?? null);
      setCustom("");
      setForm({ name: "", email: "", message: "" });
      setStatus("idle");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionKey]);

  const checkout = async () => {
    setStatus("loading");
    setError("");
    const finalAmount = custom ? Math.round(parseFloat(custom)) : amount;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memorialId: m.id,
          slug: m.slug,
          type: optionKey,
          amount: finalAmount,
          buyerName: form.name,
          buyerEmail: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      // Not configured yet — show friendly message.
      setStatus("error");
      setError(data.error || "Online payments are being set up. Please check back soon.");
    } catch {
      setStatus("error");
      setError("Could not start checkout. Please try again.");
    }
  };

  if (!option) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-8 py-9">
        <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto">
          {option.icon}
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink-900 text-center">{option.title}</h3>
        <p className="mt-2 text-center text-[14px] text-ink-600 max-w-sm mx-auto leading-relaxed">
          {option.copy}
        </p>

        {monetary && (
          <>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-ink-600 text-center">
              Choose an amount (ZAR)
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {presets.filter((p) => p > 0).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setAmount(p);
                    setCustom("");
                  }}
                  className={`py-3 rounded-sm text-[14px] font-display transition border ${
                    amount === p && !custom
                      ? "bg-sage-500 text-white border-sage-500"
                      : "bg-white text-ink-800 border-cream-200 hover:border-sage-300"
                  }`}
                >
                  R{p}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="10"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Other amount"
              className="tl-input mt-2.5"
            />
          </>
        )}

        <div className="mt-5 space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="tl-input"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your email (for your receipt)"
            className="tl-input"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={2}
            placeholder="Add a message to the family (optional)"
            className="tl-input resize-none"
          />
        </div>

        {error && (
          <p className="mt-4 text-[13px] text-ink-700 bg-cream-200/70 rounded-md px-4 py-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={checkout}
          disabled={status === "loading"}
          className="mt-5 w-full bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.22em] py-3.5 rounded-sm transition"
        >
          {status === "loading"
            ? "Redirecting…"
            : monetary
            ? "Continue to Secure Checkout"
            : "Continue"}
        </button>
        <p className="mt-3 text-[11px] text-ink-500 text-center">
          Secure payment powered by Stripe. {m.name}&rsquo;s family is notified of every contribution.
        </p>
      </div>
    </Modal>
  );
}
