-- Add access role (user/admin/owner) to User.
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
