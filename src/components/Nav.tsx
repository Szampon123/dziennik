"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useT } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const links: { href: string; key: MessageKey }[] = [
  { href: "/dzis", key: "nav.today" },
  { href: "/history", key: "nav.history" },
  { href: "/activities", key: "nav.activities" },
  { href: "/nawyki", key: "nav.habits" },
  { href: "/dudu", key: "nav.hero" },
  { href: "/forum", key: "nav.forum" },
  { href: "/cytaty", key: "nav.quotes" },
  { href: "/settings", key: "nav.settings" },
];

// Design System v1.0 — 64px bar, dot logo, pill links, theme icon + avatar menu.
export function Nav({ userMenu }: { userMenu?: React.ReactNode }) {
  const pathname = usePathname();
  const t = useT();

  // The login, register and landing pages have their own minimal layout.
  // ("/" is also stripped of the chrome in the root layout, which never even
  // renders this component there — the guard is belt-and-braces for client
  // navigations.)
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-neutral-200 bg-neutral-0/80 backdrop-blur-md supports-[backdrop-filter]:bg-neutral-0/70">
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/dzis" className="flex items-center gap-2.5">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-violet-600" />
            <span className="text-[17px] font-bold tracking-[-0.3px] text-neutral-900">
              Dziennik
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map(({ href, key }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                    active
                      ? "bg-violet-100 font-semibold text-violet-700"
                      : "font-medium text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userMenu}
        </div>
      </div>
    </header>
  );
}
