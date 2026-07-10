import { LandingNav } from "./LandingNav";
import { LandingButton } from "./LandingButton";

/**
 * PLACEHOLDER. Stands in for the angel-writing-in-a-book illustration until the
 * artwork lands at public/images/landing/icon.png. Matched to the final art's
 * footprint (200px square, white lineart, violet glow) so swapping it in is a
 * one-element change and nothing around it reflows:
 *
 *   <Image src="/images/landing/icon.png" alt="" width={200} height={200}
 *          priority className="drop-shadow-[0_0_40px_rgba(110,86,207,0.4)]" />
 *
 * The favicon, the PWA 192/512 icons and the OG card still need regenerating
 * from that same source.
 */
function HeroIconPlaceholder() {
  return (
    <div className="relative flex h-[200px] w-[200px] items-center justify-center">
      {/* Violet radial glow behind the mark. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-brand-violet/25 blur-3xl"
      />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="relative h-[140px] w-[140px] text-white drop-shadow-[0_0_40px_rgba(110,86,207,0.45)]"
      >
        {/* Halo */}
        <ellipse cx="50" cy="16" rx="13" ry="4.5" />
        {/* Head */}
        <circle cx="50" cy="30" r="8" />
        {/* Wings */}
        <path d="M38 40C28 36 18 40 12 50c8-2 14 0 18 4" />
        <path d="M62 40c10-4 20 0 26 10-8-2-14 0-18 4" />
        {/* Body */}
        <path d="M50 38v18" />
        {/* Open book */}
        <path d="M50 62c-6-5-14-7-22-6v20c8-1 16 1 22 6 6-5 14-7 22-6V56c-8-1-16 1-22 6Z" />
        <path d="M50 62v20" />
        {/* Quill */}
        <path d="M64 48 78 34" />
        <path d="M74 30l6 6-3 3-6-6 3-3Z" />
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      <LandingNav />

      {/* Ambient violet→azure wash, echoing AuthShell's backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-violet/20 to-brand-azure/10 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-[880px] flex-col items-center px-6 pb-24 pt-32 text-center sm:pb-32 sm:pt-40">
        <HeroIconPlaceholder />

        <h1 className="mt-8 text-balance text-4xl font-bold leading-[1.05] tracking-[-1.5px] text-white sm:text-6xl lg:text-7xl">
          Level Up Your Real Life
        </h1>

        <p className="mt-6 max-w-[600px] text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          138 skills. 99 levels each. Daily journaling, habit tracking, and a progression system
          that turns self-improvement into a game.
        </p>

        <LandingButton href="/register" className="mt-10">
          Start Your Journey — Free
        </LandingButton>

        <p className="mt-6 text-[13px] text-white/50">
          No credit card required · Works on any device · Set up in 2 minutes
        </p>
      </div>
    </section>
  );
}
