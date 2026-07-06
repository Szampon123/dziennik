-- CreateTable
CREATE TABLE "MilestoneEntry" (
    "userId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "note" TEXT,
    "photoPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "milestoneId"),
    CONSTRAINT "MilestoneEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MilestoneEntry_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
