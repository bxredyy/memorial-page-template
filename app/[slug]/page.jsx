import { notFound } from "next/navigation";
import { getMemorialBySlug } from "@/lib/memorial";
import MemorialView from "@/components/MemorialView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const memorial = await getMemorialBySlug(params.slug);
  if (!memorial) return { title: "Memorial not found" };
  return {
    title: `In Loving Memory of ${memorial.full_name}`,
    description:
      memorial.obituary_short?.slice(0, 160) ||
      `A memorial page honouring the life and memories of ${memorial.full_name}.`,
  };
}

export default async function Page({ params }) {
  const memorial = await getMemorialBySlug(params.slug);
  if (!memorial) notFound();
  return <MemorialView memorial={memorial} />;
}
