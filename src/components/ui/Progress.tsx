// Design System v1.0 — progress bar. The only place violet meets azure.
// Track visible even when empty; fill keeps min-width 8px when value > 0.
export function Progress({
  value,
  max,
  className = "",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <span
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`block h-2 overflow-hidden rounded-full bg-neutral-200 ${className}`}
    >
      <span
        className="block h-2 rounded-full bg-gradient-to-r from-violet-600 to-azure-500 transition-all"
        style={{ width: `${pct}%`, minWidth: value > 0 ? 8 : 0 }}
      />
    </span>
  );
}
