import { notFound } from "next/navigation";
import { getMemorialBySlug } from "@/lib/memorial";
import MemorialView from "@/components/MemorialView";

export const dynamic = "force-dynamic";

export default async function Page() {
  const slug = process.env.NEXT_PUBLIC_DEFAULT_SLUG || "in-loving-memory";
  const memorial = await getMemorialBySlug(slug);
  if (!memorial) notFound();
  return <MemorialView memorial={memorial} />;
}
