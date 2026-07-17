import type { ButtonHTMLAttributes } from "react";

// Design System v1.0 — Button, 4 variants. Violet appears only on actions.
export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "danger";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-600 text-white shadow-[0_2px_6px_-2px_rgba(110,86,207,0.45)] hover:bg-violet-700",
  secondary: "bg-neutral-0 border border-neutral-300 text-neutral-800 hover:bg-neutral-50",
  ghost: "text-neutral-600 hover:bg-neutral-100",
  // Subtle outline danger — inline actions like "Disconnect".
  destructive: "bg-neutral-0 border border-danger-border text-danger hover:bg-danger-bg",
  // Filled danger — the prominent confirm button in a destructive dialog.
  danger: "bg-danger text-white shadow-[0_2px_6px_-2px_rgba(220,38,38,0.45)] hover:opacity-90",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-all duration-150 outline-none active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 ${VARIANTS[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
