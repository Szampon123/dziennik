import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export function LandingFooter() {
  // Computed, not hardcoded: the layout renders dynamically, so this is the
  // year the page is served rather than the year it was written.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-ink">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-white/45 sm:flex-row sm:px-8">
        <p>
          © {year} {SITE_NAME}
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/privacy" className="transition-colors hover:text-white/75">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white/75">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
