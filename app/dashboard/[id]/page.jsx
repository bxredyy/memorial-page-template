import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOwnerMemorialById } from "@/lib/memorial";
import ManageClient from "@/components/dashboard/ManageClient";

export const dynamic = "force-dynamic";

export default async function ManagePage({ params }) {
  const { user, memorial } = await getOwnerMemorialById(params.id);
  if (!user) redirect("/dashboard");
  if (!memorial) notFound();

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-white border-b border-cream-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-[12px] uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900">
            ← All memorials
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-[12px] uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <ManageClient memorial={memorial} />
    </div>
  );
}
