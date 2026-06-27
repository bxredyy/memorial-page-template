import Link from "next/link";
import { getOwnerMemorials } from "@/lib/memorial";
import LoginForm from "@/components/dashboard/LoginForm";
import { formatLongDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, memorials } = await getOwnerMemorials();

  if (!user) return <LoginForm />;

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader email={user.email} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-ink-900">Your memorials</h1>
          <Link
            href="/dashboard/new"
            className="bg-sage-600 hover:bg-sage-700 text-white text-[12px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-sm transition"
          >
            + New Memorial
          </Link>
        </div>

        {memorials.length === 0 ? (
          <div className="mt-10 bg-white rounded-xl shadow p-10 text-center">
            <p className="font-display text-2xl text-ink-900">Create your first memorial</p>
            <p className="mt-2 text-ink-600 text-[14px] max-w-md mx-auto">
              Set up a beautiful, lasting tribute page where family and friends can
              share memories, photos, and support.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block mt-6 bg-sage-600 hover:bg-sage-700 text-white text-[12px] uppercase tracking-[0.2em] px-7 py-3 rounded-sm transition"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {memorials.map((m) => (
              <div key={m.id} className="bg-white rounded-xl shadow p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-cream-200 shrink-0">
                    {m.portrait_image_url && (
                      <img src={m.portrait_image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-xl text-ink-900 truncate">{m.full_name}</p>
                    <p className="text-[12px] text-ink-500">
                      {[formatLongDate(m.date_of_birth), formatLongDate(m.date_of_death)]
                        .filter(Boolean)
                        .join(" – ") || "Dates not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full ${
                      m.status === "published"
                        ? "bg-sage-100 text-sage-700"
                        : "bg-cream-200 text-ink-500"
                    }`}
                  >
                    {m.status}
                  </span>
                  {m.status === "published" && (
                    <Link
                      href={`/${m.slug}`}
                      className="text-[12px] uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/${m.id}`}
                    className="bg-ink-900 hover:bg-ink-800 text-white text-[12px] uppercase tracking-[0.18em] px-4 py-2 rounded-sm transition"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardHeader({ email }) {
  return (
    <header className="bg-white border-b border-cream-200">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-script text-2xl text-copper-500">
          Memorial Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[12px] text-ink-500">{email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-[12px] uppercase tracking-[0.18em] text-ink-600 hover:text-ink-900">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
