import type { ButtonHTMLAttributes } from "react";

// Design System v1.0 — filter chip (Aktywności). Active = violet-100 fill.
export function Chip({
  active = false,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
        active
          ? "border-violet-200 bg-violet-100 text-violet-700"
          : "border-neutral-200 bg-neutral-0 text-neutral-600 hover:bg-neutral-50"
      } ${className}`}
      {...props}
    />
  );
}
