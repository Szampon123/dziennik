-- Forum interactions: replies (self-referential ForumPost), helpful votes,
-- and post attachments (photo + link).

ALTER TABLE "ForumPost" ADD COLUMN "parentId" TEXT;
ALTER TABLE "ForumPost" ADD COLUMN "photoPath" TEXT;
ALTER TABLE "ForumPost" ADD COLUMN "linkUrl" TEXT;

DROP INDEX IF EXISTS "ForumPost_activitySlug_level_createdAt_idx";
CREATE INDEX "ForumPost_activitySlug_level_parentId_createdAt_idx" ON "ForumPost"("activitySlug", "level", "parentId", "createdAt");
CREATE INDEX "ForumPost_parentId_idx" ON "ForumPost"("parentId");

ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ForumVote" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumVote_pkey" PRIMARY KEY ("userId", "postId")
);

CREATE INDEX "ForumVote_postId_idx" ON "ForumVote"("postId");

ALTER TABLE "ForumVote" ADD CONSTRAINT "ForumVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ForumVote" ADD CONSTRAINT "ForumVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
