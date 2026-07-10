"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, RotateCcw, Trash2 } from "lucide-react";
import {
  saveMilestoneNote,
  uploadMilestonePhoto,
  deleteMilestonePhoto,
  saveMilestoneLevel,
  resetMilestoneLevel,
} from "@/actions/milestone-entry";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useT } from "@/components/i18n/I18nProvider";

// Note + proof-photo editor for a single milestone level, plus a per-user
// customisation of the level's goal. The entry lives independently of the
// check-off, so notes/photos survive unchecking a level. Customising a level
// never touches the seeded original — it stays in memory and can be restored.
export function MilestoneEntryEditor({
  milestoneId,
  initialNote,
  hasPhoto,
  entryVersion,
  effectiveTitle,
  effectiveDetail,
  originalTitle,
  originalDetail,
  customized,
}: {
  milestoneId: string;
  initialNote: string | null;
  hasPhoto: boolean;
  entryVersion: number | null;
  effectiveTitle: string;
  effectiveDetail: string | null;
  originalTitle: string;
  originalDetail: string | null;
  customized: boolean;
}) {
  const t = useT();
  const [note, setNote] = useState(initialNote ?? "");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  // Level-goal customisation.
  const [title, setTitle] = useState(effectiveTitle);
  const [detail, setDetail] = useState(effectiveDetail ?? "");
  const [levelStatus, setLevelStatus] = useState<"idle" | "saved" | "error">("idle");
  const [levelError, setLevelError] = useState("");

  const noteDirty = note.trim() !== (initialNote ?? "").trim();
  const levelDirty =
    title.trim() !== effectiveTitle.trim() || detail.trim() !== (effectiveDetail ?? "").trim();

  function saveNote() {
    startTransition(async () => {
      const result = await saveMilestoneNote({ milestoneId, note });
      if (result.ok) {
        setStatus("saved");
        setError("");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  function saveLevel() {
    if (!title.trim()) {
      setLevelStatus("error");
      setLevelError(t("errors.levelTitleEmpty"));
      return;
    }
    startTransition(async () => {
      const result = await saveMilestoneLevel({
        milestoneId,
        customTitle: title,
        customDetail: detail,
      });
      if (result.ok) {
        setLevelStatus("saved");
        setLevelError("");
      } else {
        setLevelStatus("error");
        setLevelError(result.error);
      }
    });
  }

  function restoreLevel() {
    startTransition(async () => {
      const result = await resetMilestoneLevel({ milestoneId });
      if (result.ok) {
        setTitle(originalTitle);
        setDetail(originalDetail ?? "");
        setLevelStatus("idle");
        setLevelError("");
      } else {
        setLevelStatus("error");
        setLevelError(result.error);
      }
    });
  }

  function onFileChosen(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.set("milestoneId", milestoneId);
    formData.set("photo", file);
    startTransition(async () => {
      const result = await uploadMilestonePhoto(formData);
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
      } else {
        setStatus("idle");
        setError("");
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  function removePhoto() {
    if (!window.confirm(t("mEditor.confirmRemovePhoto"))) return;
    startTransition(async () => {
      const result = await deleteMilestonePhoto({ milestoneId });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Dostosuj poziom — per-user override of the goal; original kept intact. */}
      <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-0 p-3">
        <span className="text-[13px] font-semibold text-neutral-900">{t("mEditor.customizeLevel")}</span>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">{t("mEditor.levelNameGoal")}</span>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setLevelStatus("idle");
            }}
            maxLength={200}
            placeholder={t("mEditor.levelNamePlaceholder")}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">{t("mEditor.detailLabel")}</span>
          <Textarea
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setLevelStatus("idle");
            }}
            rows={2}
            maxLength={500}
            placeholder={t("mEditor.detailPlaceholder")}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={saveLevel} disabled={isPending || !levelDirty}>
            {isPending ? t("common.saving") : t("mEditor.saveLevel")}
          </Button>
          {customized && (
            <Button variant="secondary" onClick={restoreLevel} disabled={isPending}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              {t("mEditor.restoreOriginal")}
            </Button>
          )}
          {levelStatus === "saved" && <span className="text-[13px] text-success">{t("common.saved")}</span>}
          {levelStatus === "error" && <span className="text-[13px] text-danger">{levelError}</span>}
        </div>
        {customized && (
          <p className="text-xs text-neutral-500">
            {t("mEditor.originalKept")} <span className="text-neutral-700">{originalTitle}</span>
            {originalDetail && <span className="text-neutral-500"> — {originalDetail}</span>}
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">{t("mEditor.note")}</span>
        <Textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setStatus("idle");
          }}
          rows={2}
          maxLength={500}
          placeholder={t("mEditor.notePlaceholder")}
        />
      </label>

      {hasPhoto && (
        <div className="flex flex-col items-start gap-2">
          {/* Served through the authorized API route — only the owner sees it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/milestone-photo/${milestoneId}?v=${entryVersion ?? 0}`}
            alt={t("mEditor.proofAlt")}
            className="max-h-64 w-auto max-w-full rounded-lg border border-neutral-200"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={saveNote} disabled={isPending || !noteDirty}>
          {isPending ? t("common.saving") : t("mEditor.saveNote")}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => onFileChosen(e.target.files?.[0])}
        />
        <Button
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
        >
          <ImagePlus aria-hidden className="h-4 w-4" />
          {hasPhoto ? t("mEditor.changePhoto") : t("mEditor.addPhoto")}
        </Button>
        {hasPhoto && (
          <Button variant="destructive" onClick={removePhoto} disabled={isPending}>
            <Trash2 aria-hidden className="h-4 w-4" />
            {t("mEditor.removePhoto")}
          </Button>
        )}
        {status === "saved" && <span className="text-[13px] text-success">{t("common.saved")}</span>}
        {status === "error" && <span className="text-[13px] text-danger">{error}</span>}
      </div>
      <p className="text-xs text-neutral-500">{t("mEditor.photoHint")}</p>
    </div>
  );
}
