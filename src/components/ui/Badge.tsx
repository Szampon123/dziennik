import type { ReactNode } from "react";

// Design System v1.0 — Badge, 5 variants.
// violet → day rating · azure → energy · success → Notion ✓ ·
// neutral → open day, categories · warning → warning statuses.
export type BadgeVariant = "violet" | "azure" | "success" | "neutral" | "warning";

const VARIANTS: Record<BadgeVariant, string> = {
  violet: "bg-violet-100 text-violet-700",
  azure: "bg-azure-100 text-azure-700",
  success: "bg-success-bg text-success",
  neutral: "bg-neutral-100 text-neutral-600",
  warning: "bg-warning-bg text-warning",
};

export function Badge({
  variant = "neutral",
  className = "",
  title,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
