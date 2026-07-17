"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

type ConfirmVariant = "primary" | "danger";

type DialogState = {
  kind: "confirm" | "choose";
  title?: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: ConfirmVariant;
  icon?: LucideIcon;
};

export type ConfirmOptions = {
  title?: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: LucideIcon;
};

export type ChooseOptions = {
  title?: string;
  body: string;
  yesLabel: string;
  noLabel: string;
  variant?: ConfirmVariant;
  icon?: LucideIcon;
};

// DS confirmation built on the native <dialog> element, driven by a promise so
// a call site reads almost exactly like the window.confirm it replaces:
//
//   const { confirm, dialog } = useConfirm();
//   async function remove() {
//     if (!(await confirm({ body: t("..."), variant: "danger" }))) return;
//     startTransition(...);
//   }
//   return ( <>{dialog} ...</> );
//
// showModal() gives a free focus-trap, Esc handling and focus restore to the
// trigger, and makes the background inert. Esc or a backdrop click resolves to
// the dismiss value (false for confirm, null for choose).
//
// choose() is the two-continue-buttons variant (both buttons act; dismissing
// aborts): returns "yes" | "no" | null.
export function useConfirm() {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((value: unknown) => void) | null>(null);
  const [state, setState] = useState<DialogState | null>(null);
  const titleId = useId();
  const bodyId = useId();

  const run = useCallback((next: DialogState) => {
    setState(next);
    return new Promise<unknown>((resolve) => {
      resolver.current = resolve;
      // The <dialog> is always mounted; open it once React has painted the new
      // content into it.
      requestAnimationFrame(() => ref.current?.showModal());
    });
  }, []);

  const settle = useCallback((value: boolean | "yes" | "no" | null) => {
    const resolve = resolver.current;
    resolver.current = null;
    ref.current?.close();
    resolve?.(value);
  }, []);

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      run({
        kind: "confirm",
        title: o.title,
        body: o.body,
        confirmLabel: o.confirmLabel ?? t("common.confirm"),
        cancelLabel: o.cancelLabel ?? t("common.cancel"),
        variant: o.variant ?? "primary",
        icon: o.icon,
      }) as Promise<boolean>,
    [run, t]
  );

  const choose = useCallback(
    (o: ChooseOptions) =>
      run({
        kind: "choose",
        title: o.title,
        body: o.body,
        confirmLabel: o.yesLabel,
        cancelLabel: o.noLabel,
        variant: o.variant ?? "primary",
        icon: o.icon,
      }) as Promise<"yes" | "no" | null>,
    [run]
  );

  const dismiss = () => settle(state?.kind === "choose" ? null : false);
  const Icon = state?.icon;

  const dialog: ReactNode = (
    <dialog
      ref={ref}
      aria-labelledby={state?.title ? titleId : undefined}
      aria-describedby={bodyId}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        // A click whose point falls outside the panel rect is on the backdrop.
        const d = ref.current;
        if (!d) return;
        const r = d.getBoundingClientRect();
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        if (!inside) dismiss();
      }}
      className="confirm-dialog m-auto w-[calc(100vw-2rem)] max-w-sm rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-card"
    >
      {state && (
        <>
          <div className="flex gap-3">
            {Icon && (
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  state.variant === "danger"
                    ? "bg-danger/10 text-danger"
                    : "bg-violet-100 text-violet-700"
                }`}
              >
                <Icon aria-hidden className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              {state.title && (
                <h2 id={titleId} className="text-[15px] font-semibold text-neutral-900">
                  {state.title}
                </h2>
              )}
              <p
                id={bodyId}
                className={`text-[13.5px] text-neutral-600 ${state.title ? "mt-1" : ""}`}
              >
                {state.body}
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => settle(state.kind === "choose" ? "no" : false)}
            >
              {state.cancelLabel}
            </Button>
            <Button
              variant={state.variant === "danger" ? "danger" : "primary"}
              onClick={() => settle(state.kind === "choose" ? "yes" : true)}
            >
              {state.confirmLabel}
            </Button>
          </div>
        </>
      )}
    </dialog>
  );

  return { confirm, choose, dialog };
}
