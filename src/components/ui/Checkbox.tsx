"use client";

import { Check } from "lucide-react";

// Design System v1.0 — custom checkbox. Rounded square, violet fill when
// checked (violet = action), with a small check that pops in. Built on a real
// <button role="checkbox"> so keyboard + screen-reader semantics are native.
export type CheckboxSize = "sm" | "md";

const SIZES: Record<CheckboxSize, { box: string; icon: string }> = {
  sm: { box: "h-[18px] w-[18px] rounded-[5px]", icon: "h-3 w-3" },
  md: { box: "h-5 w-5 rounded-md", icon: "h-3.5 w-3.5" },
};

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  "aria-label": ariaLabel,
  title,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: CheckboxSize;
  className?: string;
  "aria-label"?: string;
  title?: string;
}) {
  const s = SIZES[size];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={onChange}
      className={`grid shrink-0 place-items-center border transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-violet-200 disabled:cursor-default disabled:opacity-40 ${
        checked
          ? "border-violet-600 bg-violet-600 text-white shadow-[0_1px_4px_-1px_rgba(110,86,207,0.5)]"
          : "border-neutral-300 bg-neutral-0 text-transparent hover:border-violet-400 enabled:active:scale-95"
      } ${s.box} ${className}`}
    >
      <Check
        aria-hidden
        strokeWidth={3}
        className={`${s.icon} transition-transform duration-150 ${
          checked ? "scale-100" : "scale-0"
        }`}
      />
    </button>
  );
}
