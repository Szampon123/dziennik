// Skeleton for the activities page: title + subtitle, then a list of activity
// cards, each with the rounded icon tile and two text lines. Decorative only.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div>
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-100" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-4 rounded-card border border-neutral-200 bg-neutral-0 p-4"
          >
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
