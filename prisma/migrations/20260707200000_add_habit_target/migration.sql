-- Weekly target for a habit: how many days a week it should be done (1..7).
-- 7 = every day (the original behaviour). Existing habits default to 7.
ALTER TABLE "Habit" ADD COLUMN "targetPerWeek" INTEGER NOT NULL DEFAULT 7;
