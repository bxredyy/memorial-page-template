"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const TABS = [
  { id: "approvals", label: "Approvals" },
  { id: "settings", label: "Page Details" },
  { id: "share", label: "Share & Publish" },
];

export default function ManageClient({ memorial }) {
  const [tab, setTab] = useState("approvals");
  const [m, setM] = useState(memorial);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-ink-900">{m.full_name}</h1>
      <p className="text-[13px] text-ink-500 mt-1">
        {m.status === "published" ? "Live" : "Draft"} · /{m.slug}
      </p>

      <div className="mt-6 flex gap-1 bg-white rounded-full p-1.5 w-fit shadow-sm border border-cream-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-full text-[12px] uppercase tracking-[0.16em] transition ${
              tab === t.id ? "bg-sage-600 text-white" : "text-ink-600 hover:bg-sage-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "approvals" && <Approvals memorial={m} />}
        {tab === "settings" && <Settings memorial={m} onSaved={setM} />}
        {tab === "share" && <SharePublish memorial={m} onChange={setM} />}
      </div>
    </main>
  );
}

/* ─────────────────────────── APPROVALS ────────────────────────────── */

function Approvals({ memorial }) {
  const supabase = getSupabaseBrowser();
  const [memories, setMemories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: mem }, { data: ph }] = await Promise.all([
      supabase
        .from("memories")
        .select("*")
        .eq("memorial_id", memorial.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("photos")
        .select("*")
        .eq("memorial_id", memorial.id)
        .order("created_at", { ascending: false }),
    ]);
    setMemories(mem || []);
    setPhotos(
      (ph || []).map((p) => ({
        ...p,
        url: supabase.storage.from("memorial-photos").getPublicUrl(p.storage_path).data.publicUrl,
      }))
    );
    setLoading(false);
  }, [memorial.id, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setMemoryStatus = async (id, status) => {
    await supabase.from("memories").update({ status }).eq("id", id);
    setMemories((arr) => arr.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const removeMemory = async (id) => {
    await supabase.from("memories").delete().eq("id", id);
    setMemories((arr) => arr.filter((x) => x.id !== id));
  };
  const setPhotoStatus = async (id, status) => {
    await supabase.from("photos").update({ status }).eq("id", id);
    setPhotos((arr) => arr.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const removePhoto = async (photo) => {
    await supabase.from("photos").delete().eq("id", photo.id);
    await supabase.storage.from("memorial-photos").remove([photo.storage_path]);
    setPhotos((arr) => arr.filter((x) => x.id !== photo.id));
  };

  if (loading) return <Loading />;

  const pendingMem = memories.filter((x) => x.status === "pending");
  const pendingPh = photos.filter((x) => x.status === "pending");

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Pending messages" count={pendingMem.length} />
        {pendingMem.length === 0 ? (
          <Empty text="No messages waiting for review." />
        ) : (
          <div className="space-y-3">
            {pendingMem.map((x) => (
              <div key={x.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-ink-900">
                      {x.author_name}{" "}
                      {x.relationship && <span className="text-ink-400 font-normal">· {x.relationship}</span>}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-sage-600">{x.type.replace("_", " ")}</span>
                  </div>
                </div>
                {x.prompt && <p className="mt-2 text-[12px] italic text-ink-500">&ldquo;{x.prompt}&rdquo;</p>}
                {x.body && <p className="mt-2 text-[14px] text-ink-800 leading-relaxed">{x.body}</p>}
                <div className="mt-4 flex gap-2">
                  <ApproveBtn onClick={() => setMemoryStatus(x.id, "approved")} />
                  <RemoveBtn onClick={() => removeMemory(x.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Pending photos" count={pendingPh.length} />
        {pendingPh.length === 0 ? (
          <Empty text="No photos waiting for review." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {pendingPh.map((x) => (
              <div key={x.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img src={x.url} alt="" className="w-full aspect-square object-cover" />
                <div className="p-3">
                  {x.uploaded_by && <p className="text-[11px] text-ink-500">by {x.uploaded_by}</p>}
                  {x.caption && <p className="text-[12px] text-ink-700">{x.caption}</p>}
                  <div className="mt-2 flex gap-2">
                    <ApproveBtn onClick={() => setPhotoStatus(x.id, "approved")} small />
                    <RemoveBtn onClick={() => removePhoto(x)} small />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Published" count={memories.filter((x) => x.status === "approved").length + photos.filter((x) => x.status === "approved").length} />
        <p className="text-[13px] text-ink-500">
          Approved messages and photos appear on the public page automatically.
        </p>
      </section>
    </div>
  );
}

/* ─────────────────────────── SETTINGS ─────────────────────────────── */

function Settings({ memorial, onSaved }) {
  const supabase = getSupabaseBrowser();
  const [f, setF] = useState({
    full_name: memorial.full_name || "",
    display_name: memorial.display_name || "",
    date_of_birth: memorial.date_of_birth || "",
    date_of_death: memorial.date_of_death || "",
    birth_place: memorial.birth_place || "",
    obituary_short: memorial.obituary_short || "",
    obituary_full: memorial.obituary_full || "",
    service_title: memorial.service_title || "",
    service_location: memorial.service_location || "",
    livestream_url: memorial.livestream_url || "",
    hero_image_url: memorial.hero_image_url || "",
    portrait_image_url: memorial.portrait_image_url || "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const payload = { ...f };
    // Empty date strings must be null, not "".
    payload.date_of_birth = f.date_of_birth || null;
    payload.date_of_death = f.date_of_death || null;
    const { data, error: err } = await supabase
      .from("memorials")
      .update(payload)
      .eq("id", memorial.id)
      .select()
      .single();
    if (err) {
      setStatus("error");
      setError(err.message);
    } else {
      setStatus("saved");
      onSaved?.(data);
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
      <Row>
        <Input label="Full name" value={f.full_name} onChange={upd("full_name")} required />
        <Input label="Short name (used in copy)" value={f.display_name} onChange={upd("display_name")} placeholder="First name" />
      </Row>
      <Row>
        <Input label="Date of birth" type="date" value={f.date_of_birth} onChange={upd("date_of_birth")} />
        <Input label="Date of passing" type="date" value={f.date_of_death} onChange={upd("date_of_death")} />
      </Row>
      <Input label="Place of birth" value={f.birth_place} onChange={upd("birth_place")} />

      <Textarea label="Obituary — intro (shown by default)" rows={4} value={f.obituary_short} onChange={upd("obituary_short")} hint="Separate paragraphs with a blank line." />
      <Textarea label="Obituary — full (behind 'Read more')" rows={5} value={f.obituary_full} onChange={upd("obituary_full")} hint="Separate paragraphs with a blank line." />

      <Row>
        <Input label="Service title" value={f.service_title} onChange={upd("service_title")} placeholder="Funeral Service" />
        <Input label="Service location" value={f.service_location} onChange={upd("service_location")} />
      </Row>
      <Input label="Livestream URL" value={f.livestream_url} onChange={upd("livestream_url")} placeholder="https://…" />

      <Row>
        <Input label="Hero image URL" value={f.hero_image_url} onChange={upd("hero_image_url")} />
        <Input label="Portrait image URL" value={f.portrait_image_url} onChange={upd("portrait_image_url")} />
      </Row>

      {error && <p className="text-[13px] text-rose-600">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.2em] px-7 py-3 rounded-sm transition"
        >
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
        {status === "saved" && <span className="text-[13px] text-sage-700">Saved ✓</span>}
      </div>
    </form>
  );
}

/* ─────────────────────────── SHARE / PUBLISH ──────────────────────── */

function SharePublish({ memorial, onChange }) {
  const supabase = getSupabaseBrowser();
  const [status, setStatus] = useState(memorial.status);
  const [busy, setBusy] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/${memorial.slug}` : `/${memorial.slug}`;

  const toggle = async () => {
    setBusy(true);
    const next = status === "published" ? "draft" : "published";
    const { data, error } = await supabase
      .from("memorials")
      .update({ status: next })
      .eq("id", memorial.id)
      .select()
      .single();
    setBusy(false);
    if (!error) {
      setStatus(next);
      onChange?.(data);
    }
  };

  const copy = () => navigator.clipboard?.writeText(url);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-600 mb-2">Public link</p>
        <div className="flex gap-2">
          <input readOnly value={url} className="tl-input flex-1" />
          <button onClick={copy} className="bg-ink-900 text-white text-[12px] uppercase tracking-[0.16em] px-4 rounded-sm">
            Copy
          </button>
        </div>
        {status !== "published" && (
          <p className="mt-2 text-[12px] text-ink-500">
            This link only works once the page is published.
          </p>
        )}
      </div>

      <div className="border-t border-cream-200 pt-6">
        <p className="font-display text-lg text-ink-900">
          {status === "published" ? "This memorial is live" : "This memorial is a draft"}
        </p>
        <p className="text-[13px] text-ink-600 mt-1">
          {status === "published"
            ? "Anyone with the link can view it and contribute."
            : "Only you can see it. Publish when you're ready to share."}
        </p>
        <button
          onClick={toggle}
          disabled={busy}
          className={`mt-4 text-[12px] uppercase tracking-[0.2em] px-7 py-3 rounded-sm transition text-white disabled:opacity-60 ${
            status === "published" ? "bg-ink-700 hover:bg-ink-800" : "bg-sage-600 hover:bg-sage-700"
          }`}
        >
          {busy ? "…" : status === "published" ? "Unpublish" : "Publish Now"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── UI bits ──────────────────────────────── */

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="font-display text-xl text-ink-900">{title}</h2>
      <span className="bg-sage-100 text-sage-700 text-[12px] rounded-full px-2.5 py-0.5">{count}</span>
    </div>
  );
}
function Empty({ text }) {
  return <p className="text-[13px] text-ink-500 bg-white rounded-lg p-5 shadow-sm">{text}</p>;
}
function Loading() {
  return <p className="text-[13px] text-ink-500">Loading…</p>;
}
function ApproveBtn({ onClick, small }) {
  return (
    <button
      onClick={onClick}
      className={`bg-sage-600 hover:bg-sage-700 text-white uppercase tracking-[0.16em] rounded-sm transition ${
        small ? "text-[10px] px-3 py-1.5 flex-1" : "text-[11px] px-4 py-2"
      }`}
    >
      Approve
    </button>
  );
}
function RemoveBtn({ onClick, small }) {
  return (
    <button
      onClick={onClick}
      className={`border border-ink-300 text-ink-600 hover:bg-cream-200 uppercase tracking-[0.16em] rounded-sm transition ${
        small ? "text-[10px] px-3 py-1.5 flex-1" : "text-[11px] px-4 py-2"
      }`}
    >
      Remove
    </button>
  );
}
function Row({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}
function Input({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">{label}</span>
      <input className="tl-input" {...props} />
      {hint && <span className="block mt-1 text-[11px] text-ink-400">{hint}</span>}
    </label>
  );
}
function Textarea({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-600 mb-1.5">{label}</span>
      <textarea className="tl-input resize-none" {...props} />
      {hint && <span className="block mt-1 text-[11px] text-ink-400">{hint}</span>}
    </label>
  );
}
