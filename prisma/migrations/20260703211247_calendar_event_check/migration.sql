-- CreateTable
CREATE TABLE "CalendarEventCheck" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "CalendarEventCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CalendarEventCheck_userId_dayKey_idx" ON "CalendarEventCheck"("userId", "dayKey");
