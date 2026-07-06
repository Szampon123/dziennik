-- CreateTable
CREATE TABLE "FavoriteQuote" (
    "userId" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "quoteId"),
    CONSTRAINT "FavoriteQuote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
