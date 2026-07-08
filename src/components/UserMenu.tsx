import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";

function initialsOf(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

// Design System v1.0 — avatar with a dropdown (e-mail, Ustawienia, Wyloguj).
// Native <details> keeps this a server component (sign-out is a form action).
export async function UserMenu() {
  const [session, { t }] = await Promise.all([auth(), getT()]);
  if (!session?.user) return null;

  const email = session.user.email ?? session.user.name ?? t("user.loggedInAs");
  const initials = initialsOf(session.user.name, session.user.email);

  return (
    <details className="group relative">
      <summary
        aria-label={email}
        title={email}
        className="flex h-[34px] w-[34px] cursor-pointer list-none items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-violet-200 [&::-webkit-details-marker]:hidden"
      >
        {initials}
      </summary>
      <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 rounded-card border border-neutral-200 bg-neutral-0 py-1.5 shadow-card">
        <p className="truncate px-3.5 py-2 text-[13px] text-neutral-500" title={email}>
          {email}
        </p>
        <div className="mx-1.5 border-t border-neutral-200" />
        <Link
          href="/settings"
          className="block px-3.5 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100"
        >
          {t("nav.settings")}
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="block w-full px-3.5 py-2 text-left text-sm text-neutral-800 transition-colors hover:bg-neutral-100"
          >
            {t("user.logout")}
          </button>
        </form>
      </div>
    </details>
  );
}
