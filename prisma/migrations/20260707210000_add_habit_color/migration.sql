-- Per-habit checkbox colour (to tell habits apart). Existing habits default green.
ALTER TABLE "Habit" ADD COLUMN "color" TEXT NOT NULL DEFAULT 'green';
