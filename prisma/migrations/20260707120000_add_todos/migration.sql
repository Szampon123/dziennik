-- Add per-day to-do checklist (JSON) to DayEntry.
ALTER TABLE "DayEntry" ADD COLUMN "todosJson" TEXT NOT NULL DEFAULT '[]';
