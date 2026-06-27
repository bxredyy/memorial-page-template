"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default function NewMemorialForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();
  const [f, setF] = useState({
    full_name: "",
    display_name: "",
    slug: "",
    date_of_birth: "",
    date_of_death: "",
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onName = (e) => {
    const full_name = e.target.value;
    setF((prev) => ({
      ...prev,
      full_name,
      slug: slugEdited ? prev.slug : slugify(full_name),
    }));
  };

  const create = async (e) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.slug.trim()) {
      setError("Please add a name.");
      return;
    }
    setStatus("saving");
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/dashboard");
      return;
    }

    const { data, error: err } = await supabase
      .from("memorials")
      .insert({
        owner_id: user.id,
        slug: f.slug.trim(),
        status: "draft",
        full_name: f.full_name.trim(),
        display_name: f.display_name.trim() || null,
        date_of_birth: f.date_of_birth || null,
        date_of_death: f.date_of_death || null,
      })
      .select()
      .single();

    if (err) {
      setStatus("error");
      setError(
        err.code === "23505"
          ? "That web address is already taken — try another."
          : err.message
      );
      return;
    }
    router.push(`/dashboard/${data.id}`);
  };

  return (
    <form onSubmit={create} className="mt-8 bg-white rounded-xl shadow-sm p-6 space-y-5">
      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">
          Full name <span className="text-rose-500">*</span>
        </span>
        <input className="tl-input" value={f.full_name} onChange={onName} placeholder="John Doe" />
      </label>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">
          Short name (used in copy)
        </span>
        <input
          className="tl-input"
          value={f.display_name}
          onChange={(e) => setF({ ...f, display_name: e.target.value })}
          placeholder="John"
        />
      </label>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">
          Page web address <span className="text-rose-500">*</span>
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[13px] text-ink-400">/</span>
          <input
            className="tl-input"
            value={f.slug}
            onChange={(e) => {
              setSlugEdited(true);
              setF({ ...f, slug: slugify(e.target.value) });
            }}
            placeholder="john-doe"
          />
        </div>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">Date of birth</span>
          <input type="date" className="tl-input" value={f.date_of_birth} onChange={(e) => setF({ ...f, date_of_birth: e.target.value })} />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">Date of passing</span>
          <input type="date" className="tl-input" value={f.date_of_death} onChange={(e) => setF({ ...f, date_of_death: e.target.value })} />
        </label>
      </div>

      {error && <p className="text-[13px] text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.2em] px-7 py-3 rounded-sm transition"
      >
        {status === "saving" ? "Creating…" : "Create Memorial"}
      </button>
    </form>
  );
}
