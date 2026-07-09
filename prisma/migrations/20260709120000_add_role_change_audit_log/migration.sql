-- Admin audit log: one immutable row per role change (who changed whose role,
-- from what to what, and why).

-- Registration date for the admin user list. Pre-existing users are backfilled
-- with the migration timestamp (their true sign-up date was never recorded).
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "RoleChange" (
    "id" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "oldRole" TEXT NOT NULL,
    "newRole" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleChange_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RoleChange_targetId_idx" ON "RoleChange"("targetId");
CREATE INDEX "RoleChange_changedBy_idx" ON "RoleChange"("changedBy");
CREATE INDEX "RoleChange_createdAt_idx" ON "RoleChange"("createdAt");

ALTER TABLE "RoleChange" ADD CONSTRAINT "RoleChange_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleChange" ADD CONSTRAINT "RoleChange_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
