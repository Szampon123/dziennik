import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

// Deliberately not the app's <Nav>: that one is a client component keyed on
// the signed-in user's locale and routes, and it renders nothing on "/".
export function LandingNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-brand-violet to-brand-azure"
          />
          <span className="text-[17px] font-bold tracking-[-0.3px] text-white">{SITE_NAME}</span>
        </Link>

        {/* whitespace-nowrap throughout: at 375px "Log in" and "Get Started
            Free" otherwise wrap onto two lines each and collide with the
            wordmark. The CTA drops the word "Free" below `sm` for the same
            reason — the hero repeats it immediately underneath. */}
        <nav className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link
            href="/login"
            className="whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white sm:px-4 sm:text-sm"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="whitespace-nowrap rounded-full bg-brand-violet px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-violet-strong sm:px-5 sm:text-sm"
          >
            Get Started<span className="hidden sm:inline"> Free</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
