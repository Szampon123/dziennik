import type { ReactNode } from "react";

// Design System v1.0 — card: white surface, neutral-200 border, shadow-card.
// Header = H2 + Small subtitle (gap-0.5), optional action slot on the right.
export function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold tracking-[-0.2px] text-neutral-900">{title}</h2>
          {subtitle && <p className="text-[13px] text-neutral-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
