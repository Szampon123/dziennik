// Skeleton for the history page: title, the trend-chart card, then a list of
// day rows matching the real rounded-xl row cards. Decorative only.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="h-8 w-40 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="h-16 animate-pulse rounded-xl border border-neutral-200 bg-neutral-0"
          />
        ))}
      </div>
    </div>
  );
}
