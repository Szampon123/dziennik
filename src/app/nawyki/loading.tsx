// Skeleton for the habits page: title + subtitle, then a grid card echoing the
// tracker's habit-rows-by-days layout. Decorative only.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div>
        <div className="h-8 w-40 animate-pulse rounded-lg bg-neutral-100" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="h-8 w-32 shrink-0 animate-pulse rounded bg-neutral-100" />
              <div className="flex flex-1 gap-1">
                {Array.from({ length: 10 }).map((_, cell) => (
                  <div key={cell} className="h-8 flex-1 animate-pulse rounded bg-neutral-100" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
