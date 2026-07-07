-- Add Dudu companion colour palette choice to User.
ALTER TABLE "User" ADD COLUMN "duduColor" TEXT NOT NULL DEFAULT 'violet';
