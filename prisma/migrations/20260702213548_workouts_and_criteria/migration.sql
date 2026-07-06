-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN "criteriaJson" TEXT;

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "durationMin" REAL NOT NULL,
    "isRace" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Workout_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserMilestone" (
    "userId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'manual',

    PRIMARY KEY ("userId", "milestoneId"),
    CONSTRAINT "UserMilestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserMilestone_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserMilestone" ("completedAt", "milestoneId", "userId") SELECT "completedAt", "milestoneId", "userId" FROM "UserMilestone";
DROP TABLE "UserMilestone";
ALTER TABLE "new_UserMilestone" RENAME TO "UserMilestone";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Workout_userId_activityId_date_idx" ON "Workout"("userId", "activityId", "date");
