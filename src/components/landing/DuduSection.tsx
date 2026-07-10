import { CHARACTER_STAGES } from "@/lib/character";

/**
 * The stage names are read from src/lib/character.ts rather than retyped, so
 * this section cannot drift from what the companion actually calls itself. They
 * stay in Polish on an English page on purpose: they are the character's names,
 * the way a game keeps its characters' names untranslated.
 */
export function DuduSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Gentle violet bloom, drifting on a long loop. Pure CSS, no library.
          `.landing-drift` carries its own prefers-reduced-motion opt-out, the
          same way `.dudu-breathe` does. */}
      <div
        aria-hidden
        className="landing-drift pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-violet/25 to-brand-azure/15 blur-[110px]"
      />

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-6 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-balance text-3xl font-bold tracking-[-1px] text-white sm:text-5xl">
          Meet Your Companion
        </h2>

        {/* Placeholder for the Dudu artwork — see HeroSection for the icon note. */}
        <div
          aria-hidden
          className="mt-12 flex h-40 w-40 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]"
        >
          <span className="text-6xl">🐣</span>
        </div>

        <p className="mt-10 max-w-[560px] text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          Dudu grows with you. Customize their look, and watch them evolve from a spark to a legend
          as you level up across your skills.
        </p>

        {/* The arrow leads each item rather than trailing it, so a wrap starts a
            new line with "→ Dudu Bohater" instead of leaving one dangling at
            the end of the line above. */}
        <ol className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          {CHARACTER_STAGES.map((stage, i) => (
            <li key={stage.name} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="text-white/25">
                  →
                </span>
              )}
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-white/80">
                {stage.name}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
