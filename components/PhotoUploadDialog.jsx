"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useMemorial } from "./MemorialContext";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Visitor photo contribution. Uploads files to the public storage bucket
 * under <memorial_id>/, then inserts pending `photos` rows for family review.
 */
export default function PhotoUploadDialog({ open, onClose }) {
  const m = useMemorial();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [error, setError] = useState("");

  const reset = () => {
    setFiles([]);
    setName("");
    setCaption("");
    setStatus("idle");
    setError("");
  };
  const handleClose = () => {
    reset();
    onClose?.();
  };

  const onPick = (e) => {
    const picked = Array.from(e.target.files || []);
    const valid = picked.filter((f) => OK_TYPES.includes(f.type) && f.size <= MAX_BYTES);
    if (valid.length < picked.length) {
      setError("Some files were skipped (must be images under 10 MB).");
    } else {
      setError("");
    }
    setFiles(valid.slice(0, 10));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please choose at least one photo.");
      return;
    }
    setStatus("uploading");
    setError("");

    const supabase = getSupabaseBrowser();
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${m.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("memorial-photos")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) throw upErr;

        const { error: insErr } = await supabase.from("photos").insert({
          memorial_id: m.id,
          status: "pending",
          storage_path: path,
          caption: caption.trim() || null,
          uploaded_by: name.trim() || null,
        });
        if (insErr) throw insErr;
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Upload failed. Please try again.");
    }
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
          <h3 className="mt-5 font-display text-2xl text-ink-900">Photos received</h3>
          <p className="mt-2 text-ink-600 text-[14px] max-w-xs mx-auto leading-relaxed">
            Thank you for sharing. Your {files.length === 1 ? "photo" : "photos"} will appear
            once {m.name}&rsquo;s family has approved them.
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
            Share Photos of {m.name}
          </h3>
          <p className="mt-2 text-center text-[13px] text-ink-600">
            Add up to 10 images (JPG, PNG, WebP — max 10 MB each).
          </p>

          <label className="mt-6 block border-2 border-dashed border-sage-300 rounded-lg px-6 py-8 text-center cursor-pointer hover:bg-sage-50 transition">
            <input type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="mx-auto text-sage-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-3 text-[13px] text-ink-700">
              {files.length > 0
                ? `${files.length} photo${files.length > 1 ? "s" : ""} selected`
                : "Click to choose photos"}
            </p>
          </label>

          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {files.map((f, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-full aspect-square object-cover rounded-sm"
                />
              ))}
            </div>
          )}

          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="tl-input"
            />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption (optional)"
              className="tl-input"
            />
          </div>

          {error && <p className="mt-3 text-[13px] text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "uploading"}
            className="mt-6 w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-[12px] uppercase tracking-[0.22em] py-3.5 rounded-sm transition"
          >
            {status === "uploading" ? "Uploading…" : "Share Photos"}
          </button>
          <p className="mt-3 text-[11px] text-ink-500 text-center">
            Photos are reviewed by the family before they appear.
          </p>
        </form>
      )}
    </Modal>
  );
}
