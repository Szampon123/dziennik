"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/actions/delete-account";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

/**
 * The delete-account confirmation.
 *
 * `hasPassword` decides which proof we ask for: a password account types its
 * password, a Google-only account has none and retypes its own address instead.
 * It only chooses which field to *render* — the server re-derives this from the
 * account and re-checks the answer, so a client that lies about it gets nowhere.
 *
 * The button stays disabled until something is typed, which is a speed bump, not
 * a security control: the real check is the server's. The point is that the
 * destructive button is never one stray click away from an idle cursor.
 */
export function DeleteAccount({ hasPassword, email }: { hasPassword: boolean; email: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    startTransition(async () => {
      setError("");
      // On success the action signs out and redirects, so nothing comes back.
      const res = await deleteAccount(
        hasPassword ? { password: value } : { email: value }
      );
      if (res && !res.ok) setError(res.error);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass("secondary")}
      >
        {t("settings.danger.deleteAccount")}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-[13px] leading-relaxed text-danger">
        {t("settings.danger.warning")}
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] text-neutral-600">
          {hasPassword
            ? t("settings.danger.confirmPassword")
            : t("settings.danger.confirmEmail")}
        </span>
        <input
          type={hasPassword ? "password" : "email"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={hasPassword ? "current-password" : "off"}
          placeholder={hasPassword ? undefined : email}
          required
          className={inputClass}
        />
      </label>

      {error && <p className="text-[13px] text-danger">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-danger px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? t("settings.danger.deleting") : t("settings.danger.confirmButton")}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setValue("");
            setError("");
          }}
          disabled={isPending}
          className={buttonClass("secondary")}
        >
          {t("settings.danger.cancel")}
        </button>
      </div>
    </form>
  );
}
