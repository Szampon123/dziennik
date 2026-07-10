-- Post-registration onboarding wizard.

ALTER TABLE "User" ADD COLUMN "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- Backfill every row that already exists. The column defaults to false so new
-- accounts land in the wizard, but nobody who signed up before this deploy
-- should be dragged through it — they already have their habits, activities and
-- companion. Runs once, and only touches rows present at migration time.
UPDATE "User" SET "onboardingComplete" = true;
