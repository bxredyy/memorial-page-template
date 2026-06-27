import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import NewMemorialForm from "@/components/dashboard/NewMemorialForm";

export const dynamic = "force-dynamic";

export default async function NewMemorialPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="bg-white border-b border-cream-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <Link href="/dashboard" className="text-[12px] uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900">
            ← All memorials
          </Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-ink-900">Create a memorial</h1>
        <p className="mt-2 text-ink-600 text-[14px]">
          Start with the essentials — you can add photos, the obituary and service
          details afterwards.
        </p>
        <NewMemorialForm />
      </main>
    </div>
  );
}
