/*
  Warnings:

  - The primary key for the `OAuthToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `DayEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "notionToken" TEXT,
    "notionParentPageId" TEXT
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    PRIMARY KEY ("provider", "providerAccountId"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,

    PRIMARY KEY ("identifier", "token")
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DayEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DayEntry" ("createdAt", "date", "dayRating", "energyLevel", "id", "morningIntent", "notionPageId", "prioritiesJson", "reflectionBad", "reflectionGood", "status", "syncError", "syncStatus", "updatedAt") SELECT "createdAt", "date", "dayRating", "energyLevel", "id", "morningIntent", "notionPageId", "prioritiesJson", "reflectionBad", "reflectionGood", "status", "syncError", "syncStatus", "updatedAt" FROM "DayEntry";
DROP TABLE "DayEntry";
ALTER TABLE "new_DayEntry" RENAME TO "DayEntry";
CREATE UNIQUE INDEX "DayEntry_userId_date_key" ON "DayEntry"("userId", "date");
CREATE TABLE "new_OAuthToken" (
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiryDate" BIGINT,
    "scope" TEXT,
    "accountEmail" TEXT,

    PRIMARY KEY ("userId", "provider"),
    CONSTRAINT "OAuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OAuthToken" ("accessToken", "accountEmail", "expiryDate", "provider", "refreshToken", "scope") SELECT "accessToken", "accountEmail", "expiryDate", "provider", "refreshToken", "scope" FROM "OAuthToken";
DROP TABLE "OAuthToken";
ALTER TABLE "new_OAuthToken" RENAME TO "OAuthToken";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
