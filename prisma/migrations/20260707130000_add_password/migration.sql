-- Add bcrypt password hash for email+password login (null for Google-only users).
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
