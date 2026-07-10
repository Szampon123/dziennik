-- Password reset links + the session cut-off that a reset trips.

-- Any JWT issued before this instant is rejected by the jwt callback, so
-- resetting a password drops every session opened with the old one. NULL for
-- every existing row: nobody has reset yet, so nobody's session is stale.
ALTER TABLE "User" ADD COLUMN "sessionsValidFrom" TIMESTAMP(3);

-- "token" stores the SHA-256 hash of the value mailed to the user, never the
-- value itself. "usedAt" is set instead of deleting the row, so a second click
-- on a spent link reports "already used" rather than "invalid or expired".
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
