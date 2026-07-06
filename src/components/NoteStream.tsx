"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { addNote, deleteNote } from "@/actions/notes";
import { NOTE_TYPES, NOTE_TYPE_LABELS, type NoteType } from "@/lib/day";
import { formatTime } from "@/lib/dates";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { Textarea, inputClass } from "@/components/ui/Input";

export type NoteItem = {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
};

const TYPE_BADGE: Record<NoteType, string> = {
  log: "bg-violet-100 text-violet-700",
  distraction: "bg-warning-bg text-warning",
  idea: "bg-azure-100 text-azure-700",
};

export function NoteStream({
  date,
  notes,
  disabled,
}: {
  date: string;
  notes: NoteItem[];
  disabled: boolean;
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>("log");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) return;
    startTransition(async () => {
      const result = await addNote({ date, content, type });
      if (result.ok) {
        setContent("");
        setError("");
      } else {
        setError(result.error);
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteNote(id);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {!disabled && (
        <div className="flex flex-col gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Co się właśnie wydarzyło? Zapisz myśl, zadanie lub rozproszenie…"
            rows={3}
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NoteType)}
              aria-label="Typ notatki"
              className={`${inputClass} w-auto`}
            >
              {NOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {NOTE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <Button onClick={submit} disabled={isPending || !content.trim()}>
              Dodaj
            </Button>
            <span className="text-[13px] text-neutral-400">
              Enter — dodaj · Shift+Enter — nowa linia
            </span>
          </div>
          {error && <p className="text-[13px] text-danger">{error}</p>}
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState
          title="Brak notatek"
          hint="Zapisuj w ciągu dnia, co zrobiłeś i co Cię rozproszyło."
        />
      ) : (
        <ul className="flex flex-col gap-1">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-50"
            >
              <span className="mt-0.5 shrink-0 font-mono text-[13px] text-neutral-500">
                {formatTime(new Date(note.createdAt))}
              </span>
              <span
                className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  TYPE_BADGE[(note.type as NoteType) in TYPE_BADGE ? (note.type as NoteType) : "log"]
                }`}
              >
                {NOTE_TYPE_LABELS[(note.type as NoteType)] ?? note.type}
              </span>
              <span className="flex-1 text-[15px] text-neutral-800">{note.content}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(note.id)}
                  aria-label="Usuń notatkę"
                  title="Usuń notatkę"
                  className="rounded p-1 text-neutral-500 opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
