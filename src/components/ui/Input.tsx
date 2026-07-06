import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

// Design System v1.0 — Input. White surface (the only grey in the layout is
// the page background), neutral-500 placeholder, violet focus ring.
export const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-neutral-0 px-3.5 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-100 disabled:opacity-60";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} resize-none ${className}`} {...props} />;
}
