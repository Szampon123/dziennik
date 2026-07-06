-- CreateTable
CREATE TABLE "DayEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "morningIntent" TEXT,
    "prioritiesJson" TEXT NOT NULL DEFAULT '[]',
    "reflectionGood" TEXT,
    "reflectionBad" TEXT,
    "dayRating" INTEGER,
    "energyLevel" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notionPageId" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'none',
    "syncError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'log',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayEntryId" TEXT NOT NULL,
    CONSTRAINT "Note_dayEntryId_fkey" FOREIGN KEY ("dayEntryId") REFERENCES "DayEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OAuthToken" (
    "provider" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiryDate" BIGINT,
    "scope" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "DayEntry_date_key" ON "DayEntry"("date");
