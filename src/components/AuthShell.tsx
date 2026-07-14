import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/seo";

// Shared premium frame for the auth screens (login / register): an ambient
// violet→azure glow behind a gradient wordmark and an elevated card. Pure
// display — both pages pass their card contents as children.
export function AuthShell({
  subtitle,
  children,
  footer,
}: {
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative mx-auto flex max-w-sm flex-col gap-6 pt-16">
      {/* Ambient backdrop glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-400/25 to-azure-300/25 blur-3xl"
      />

      <div className="relative text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-600 to-azure-500"
          />
          <h1 className="bg-gradient-to-r from-violet-600 to-azure-500 bg-clip-text text-[28px] font-bold tracking-[-0.5px] text-transparent">
            {SITE_NAME}
          </h1>
        </div>
        <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
      </div>

      <div className="relative flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-0 p-6 shadow-pop">
        {children}
      </div>

      {footer && <p className="relative text-center text-[13px] text-neutral-500">{footer}</p>}
    </div>
  );
}
