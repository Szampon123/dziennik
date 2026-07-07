-- Reshape the forum into a per-skill/per-level board: drop threads+replies,
-- add a single flat ForumPost (message) keyed by skill + optional level.
-- (No production data yet — the previous tables are empty.)

DROP TABLE IF EXISTS "ForumReply";
DROP TABLE IF EXISTS "ForumThread";

CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activitySlug" TEXT NOT NULL,
    "level" INTEGER,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ForumPost_activitySlug_level_createdAt_idx" ON "ForumPost"("activitySlug", "level", "createdAt");

ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
