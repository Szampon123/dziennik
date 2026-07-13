import Image from "next/image";
import { LandingNav } from "./LandingNav";
import { LandingButton } from "./LandingButton";

/**
 * The app icon: a black squircle carrying white lineart. It sits on the black
 * hero, so the squircle's fill disappears and only the drawing and the violet
 * glow read — which is why the asset is masked to transparent corners rather
 * than kept on its original gray backdrop.
 *
 * `priority` because it is the largest element above the fold; leaving it lazy
 * would make it the LCP candidate *and* delay it.
 */
function HeroIcon() {
  return (
    <div className="relative flex h-[200px] w-[200px] items-center justify-center">
      {/* Violet radial bloom behind the mark. */}
      <div aria-hidden className="absolute inset-0 rounded-full bg-brand-violet/25 blur-3xl" />
      <Image
        src="/images/landing/icon.png"
        alt=""
        aria-hidden
        width={200}
        height={200}
        priority
        className="relative h-[200px] w-[200px] drop-shadow-[0_0_40px_rgba(110,86,207,0.45)]"
      />
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
        <HeroIcon />

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
          Completely free · No ads · Works on any device · Set up in 2 minutes
        </p>
      </div>
    </section>
  );
}
