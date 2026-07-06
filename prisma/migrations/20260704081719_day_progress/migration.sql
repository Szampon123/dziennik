-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "morningIntent" TEXT,
    "prioritiesJson" TEXT NOT NULL DEFAULT '[]',
    "prioritiesDoneJson" TEXT NOT NULL DEFAULT '[]',
    "tasksDone" INTEGER,
    "tasksTotal" INTEGER,
    "reflectionGood" TEXT,
    "reflectionBad" TEXT,
    "dayRating" INTEGER,
    "energyLevel" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notionPageId" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'none',
    "syncError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DayEntry" ("createdAt", "date", "dayRating", "energyLevel", "id", "morningIntent", "notionPageId", "prioritiesJson", "reflectionBad", "reflectionGood", "status", "syncError", "syncStatus", "updatedAt", "userId") SELECT "createdAt", "date", "dayRating", "energyLevel", "id", "morningIntent", "notionPageId", "prioritiesJson", "reflectionBad", "reflectionGood", "status", "syncError", "syncStatus", "updatedAt", "userId" FROM "DayEntry";
DROP TABLE "DayEntry";
ALTER TABLE "new_DayEntry" RENAME TO "DayEntry";
CREATE UNIQUE INDEX "DayEntry_userId_date_key" ON "DayEntry"("userId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
