import { getSupabaseServer } from "./supabase/server";

const PHOTO_BUCKET = "memorial-photos";

/** Build a public URL for a stored photo path. */
export function photoPublicUrl(supabase, storagePath) {
  if (!storagePath) return null;
  if (storagePath.startsWith("http")) return storagePath;
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(storagePath);
  return data?.publicUrl ?? null;
}

/**
 * Fetch a fully-hydrated memorial by slug: the memorial row plus approved
 * memories and approved photos. Returns null if not found / not visible.
 */
export async function getMemorialBySlug(slug) {
  const supabase = getSupabaseServer();

  const { data: memorial, error } = await supabase
    .from("memorials")
    .select("*")
    .ilike("slug", slug)
    .maybeSingle();

  if (error || !memorial) return null;

  const [{ data: memories }, { data: photos }] = await Promise.all([
    supabase
      .from("public_memories")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("public_photos")
      .select("*")
      .eq("memorial_id", memorial.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const hydratedPhotos = (photos ?? []).map((p) => ({
    ...p,
    url: photoPublicUrl(supabase, p.storage_path),
  }));

  return {
    ...memorial,
    memories: memories ?? [],
    photos: hydratedPhotos,
  };
}

/** Owner-side: a single memorial the signed-in user owns, or null. */
export async function getOwnerMemorialById(id) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, memorial: null };

  const { data } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  return { user, memorial: data ?? null };
}

/** Owner-side: list every memorial belonging to the signed-in user. */
export async function getOwnerMemorials() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, memorials: [] };

  const { data } = await supabase
    .from("memorials")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return { user, memorials: data ?? [] };
}
