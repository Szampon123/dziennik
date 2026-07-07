"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import {
  MAX_TODOS,
  MAX_TODO_TITLE,
  isValidTime,
  parseTodos,
  serializeTodos,
  type Todo,
} from "@/lib/todos";
import type { ActionResult } from "@/actions/day-entry";

/** addTodo also returns the created row so the client can render it optimistically. */
export type AddTodoResult = { ok: true; todo: Todo } | { ok: false; error: string };

const CLOSED_ERR = "Dzień jest zamknięty. Otwórz go ponownie, aby edytować.";

const addSchema = z.object({
  date: z.string().refine(isValidDayKey, "Nieprawidłowa data"),
  title: z
    .string()
    .trim()
    .min(1, "Wpisz treść zadania.")
    .max(MAX_TODO_TITLE, `Zadanie może mieć maks. ${MAX_TODO_TITLE} znaków.`),
  time: z.string().optional().nullable(),
});

export async function addTodo(input: z.input<typeof addSchema>): Promise<AddTodoResult> {
  const userId = await requireUserId();
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { date } = parsed.data;
  const title = parsed.data.title.trim();
  const time = parsed.data.time && isValidTime(parsed.data.time) ? parsed.data.time : null;

  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    select: { status: true, todosJson: true },
  });
  if (day?.status === "closed") return { ok: false, error: CLOSED_ERR };

  const todos = parseTodos(day?.todosJson);
  if (todos.length >= MAX_TODOS) {
    return { ok: false, error: `Maksymalnie ${MAX_TODOS} zadań na dzień.` };
  }

  const todo: Todo = { id: randomUUID(), title, time, done: false };
  const next = [...todos, todo];

  await prisma.dayEntry.upsert({
    where: { userId_date: { userId, date } },
    update: { todosJson: serializeTodos(next) },
    create: { userId, date, todosJson: serializeTodos(next) },
  });

  revalidatePath("/");
  return { ok: true, todo };
}

const toggleSchema = z.object({
  date: z.string().refine(isValidDayKey, "Nieprawidłowa data"),
  id: z.string().min(1),
  done: z.boolean(),
});

export async function toggleTodo(input: z.input<typeof toggleSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = toggleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Nieprawidłowe żądanie." };
  const { date, id, done } = parsed.data;

  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    select: { status: true, todosJson: true },
  });
  if (!day) return { ok: false, error: "Nie znaleziono wpisu dla tego dnia." };
  if (day.status === "closed") return { ok: false, error: CLOSED_ERR };

  const todos = parseTodos(day.todosJson);
  const next = todos.map((t) => (t.id === id ? { ...t, done } : t));

  await prisma.dayEntry.update({
    where: { userId_date: { userId, date } },
    data: { todosJson: serializeTodos(next) },
  });

  revalidatePath("/");
  return { ok: true };
}

const deleteSchema = z.object({
  date: z.string().refine(isValidDayKey, "Nieprawidłowa data"),
  id: z.string().min(1),
});

export async function deleteTodo(input: z.input<typeof deleteSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Nieprawidłowe żądanie." };
  const { date, id } = parsed.data;

  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    select: { status: true, todosJson: true },
  });
  if (!day) return { ok: false, error: "Nie znaleziono wpisu dla tego dnia." };
  if (day.status === "closed") return { ok: false, error: CLOSED_ERR };

  const todos = parseTodos(day.todosJson);
  const next = todos.filter((t) => t.id !== id);

  await prisma.dayEntry.update({
    where: { userId_date: { userId, date } },
    data: { todosJson: serializeTodos(next) },
  });

  revalidatePath("/");
  return { ok: true };
}
