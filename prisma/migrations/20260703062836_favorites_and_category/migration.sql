-- CreateTable
CREATE TABLE "FavoriteActivity" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "activityId"),
    CONSTRAINT "FavoriteActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FavoriteActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "logKind" TEXT NOT NULL DEFAULT 'distance',
    "category" TEXT NOT NULL DEFAULT 'inne'
);
INSERT INTO "new_Activity" ("description", "icon", "id", "logKind", "name", "slug", "sortOrder") SELECT "description", "icon", "id", "logKind", "name", "slug", "sortOrder" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
