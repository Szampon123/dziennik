"use client";

/** 1–5 rating picker rendered as a row of buttons. */
export function RatingScale({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={`h-10 w-10 rounded-lg border text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 disabled:opacity-50 ${
              value === n
                ? "border-violet-200 bg-violet-100 text-violet-700"
                : "border-neutral-300 bg-neutral-0 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
