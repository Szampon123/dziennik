"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { addTodo, toggleTodo, deleteTodo } from "@/actions/todos";
import { sortTodosForDisplay, MAX_TODO_TITLE, type Todo } from "@/lib/todos";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { inputClass } from "@/components/ui/Input";
import { useT } from "@/components/i18n/I18nProvider";

export function TodoList({
  date,
  todos,
  disabled,
}: {
  date: string;
  todos: Todo[];
  disabled: boolean;
}) {
  // The component owns the list after mount (it is the only editor of today's
  // to-dos); the server action confirms/rolls back each optimistic change.
  const [items, setItems] = useState<Todo[]>(todos);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = useT();

  const sorted = sortTodosForDisplay(items);
  const doneCount = items.filter((t) => t.done).length;

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setError("");
    startTransition(async () => {
      const result = await addTodo({ date, title: trimmed, time: time || null });
      if (result.ok) {
        setItems((prev) => [...prev, result.todo]);
        setTitle("");
        setTime("");
      } else {
        setError(result.error);
      }
    });
  }

  function toggle(todo: Todo) {
    const next = !todo.done;
    setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: next } : t)));
    setError("");
    startTransition(async () => {
      const result = await toggleTodo({ date, id: todo.id, done: next });
      if (!result.ok) {
        // roll back
        setItems((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
        setError(result.error);
      }
    });
  }

  function remove(todo: Todo) {
    const snapshot = items;
    setItems((prev) => prev.filter((t) => t.id !== todo.id));
    setError("");
    startTransition(async () => {
      const result = await deleteTodo({ date, id: todo.id });
      if (!result.ok) {
        setItems(snapshot); // restore
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {!disabled && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              maxLength={MAX_TODO_TITLE}
              placeholder={t("todo.placeholder")}
              aria-label={t("todo.contentLabel")}
              className={`${inputClass} min-w-[180px] flex-1`}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label={t("todo.timeLabel")}
              className={`${inputClass} w-auto`}
            />
            <Button onClick={submit} disabled={isPending || !title.trim()}>
              {t("common.add")}
            </Button>
          </div>
          {error && <p className="text-[13px] text-danger">{error}</p>}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState title={t("todo.emptyTitle")} hint={t("todo.emptyHint")} />
      ) : (
        <>
          <ul className="flex flex-col gap-0.5">
            {sorted.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50"
              >
                <Checkbox
                  checked={todo.done}
                  onChange={() => toggle(todo)}
                  disabled={disabled}
                  size="sm"
                  aria-label={t("todo.markAria", {
                    title: todo.title,
                    state: todo.done ? t("todo.stateUndone") : t("todo.stateDone"),
                  })}
                />
                {todo.time && (
                  <span className="shrink-0 font-mono text-[13px] tabular-nums text-neutral-500">
                    {todo.time}
                  </span>
                )}
                <span
                  className={`flex-1 text-[15px] ${
                    todo.done ? "text-neutral-400 line-through" : "text-neutral-800"
                  }`}
                >
                  {todo.title}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => remove(todo)}
                    aria-label={t("todo.deleteAria", { title: todo.title })}
                    title={t("todo.deleteTitle")}
                    className="rounded p-1 text-neutral-500 opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="px-2 text-[13px] text-neutral-500">
            {t("todo.doneCount", { done: doneCount, total: items.length })}
          </p>
        </>
      )}
    </div>
  );
}
