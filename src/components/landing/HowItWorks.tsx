const STEPS = [
  {
    title: "Pick Your Skills",
    body: "Choose from 138 activities — running, piano, cooking, you name it.",
  },
  {
    title: "Track Daily",
    body: "Journal, log workouts, check habits. Takes 2 minutes a day.",
  },
  {
    title: "Watch Yourself Grow",
    body: "Level up, unlock milestones, and see your progression across everything.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-6 py-20 sm:px-8 sm:py-28">
        <h2 className="text-center text-3xl font-bold tracking-[-1px] text-brand-ink sm:text-4xl">
          How It Works
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-violet text-xl font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.3px] text-brand-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[280px] text-pretty text-[15px] leading-relaxed text-brand-ink/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
