// Figures verified against prisma/seed-data: 138 activity modules, every one
// carrying a contiguous 1–99 ladder, 13,662 milestones in total. If the seed
// grows, these move — they are claims on a public page, not decoration.
const STATS = [
  { value: "138", label: "Activities" },
  { value: "13,600+", label: "Milestones" },
  { value: "99", label: "Levels Each" },
  { value: "Free", label: "To Start" },
] as const;

export function StatsBar() {
  return (
    <section className="bg-gradient-to-r from-brand-violet to-brand-azure">
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-y-10 px-6 py-14 sm:grid-cols-4 sm:gap-y-0 sm:px-8">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span className="text-4xl font-bold tracking-[-1px] text-white sm:text-5xl">
              {value}
            </span>
            <span className="mt-1.5 text-sm font-medium text-white/75">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
