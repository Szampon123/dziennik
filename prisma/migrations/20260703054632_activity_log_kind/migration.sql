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
    "logKind" TEXT NOT NULL DEFAULT 'distance'
);
INSERT INTO "new_Activity" ("description", "icon", "id", "name", "slug", "sortOrder") SELECT "description", "icon", "id", "name", "slug", "sortOrder" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
