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
      setLevelError("Nazwa poziomu nie może być pusta.");
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
    if (!window.confirm("Usunąć zdjęcie z tego poziomu?")) return;
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
        <span className="text-[13px] font-semibold text-neutral-900">Dostosuj poziom</span>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Nazwa poziomu (Twój cel)</span>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setLevelStatus("idle");
            }}
            maxLength={200}
            placeholder="np. Zagraj swój wybrany utwór…"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Opis / wskazówka (opcjonalnie)</span>
          <Textarea
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setLevelStatus("idle");
            }}
            rows={2}
            maxLength={500}
            placeholder="Doprecyzuj cel na tym poziomie…"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={saveLevel} disabled={isPending || !levelDirty}>
            {isPending ? "Zapisywanie…" : "Zapisz poziom"}
          </Button>
          {customized && (
            <Button variant="secondary" onClick={restoreLevel} disabled={isPending}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              Przywróć oryginał
            </Button>
          )}
          {levelStatus === "saved" && <span className="text-[13px] text-success">Zapisano ✓</span>}
          {levelStatus === "error" && <span className="text-[13px] text-danger">{levelError}</span>}
        </div>
        {customized && (
          <p className="text-xs text-neutral-500">
            Oryginał (zachowany): <span className="text-neutral-700">{originalTitle}</span>
            {originalDetail && <span className="text-neutral-500"> — {originalDetail}</span>}
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Notatka</span>
        <Textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setStatus("idle");
          }}
          rows={2}
          maxLength={500}
          placeholder="Jak poszło? Warunki, samopoczucie, kontekst…"
        />
      </label>

      {hasPhoto && (
        <div className="flex flex-col items-start gap-2">
          {/* Served through the authorized API route — only the owner sees it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/milestone-photo/${milestoneId}?v=${entryVersion ?? 0}`}
            alt="Zdjęcie-dowód poziomu"
            className="max-h-64 w-auto max-w-full rounded-lg border border-neutral-200"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={saveNote} disabled={isPending || !noteDirty}>
          {isPending ? "Zapisywanie…" : "Zapisz notatkę"}
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
          {hasPhoto ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
        </Button>
        {hasPhoto && (
          <Button variant="destructive" onClick={removePhoto} disabled={isPending}>
            <Trash2 aria-hidden className="h-4 w-4" />
            Usuń zdjęcie
          </Button>
        )}
        {status === "saved" && <span className="text-[13px] text-success">Zapisano ✓</span>}
        {status === "error" && <span className="text-[13px] text-danger">{error}</span>}
      </div>
      <p className="text-xs text-neutral-500">
        Zdjęcie (np. screen z aplikacji biegowej) — JPG/PNG/WEBP/GIF, maks. 6 MB. Notatka i
        zdjęcie zostają nawet po odznaczeniu poziomu.
      </p>
    </div>
  );
}
