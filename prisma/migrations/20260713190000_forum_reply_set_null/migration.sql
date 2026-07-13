-- A reply's parent FK cascaded on delete, which made deleting one post destroy
-- every reply beneath it — including replies written by *other people*. That was
-- survivable while only an admin could delete a post; it stops being survivable
-- the moment a user can delete their own account, because removing their posts
-- would silently take other users' replies with them.
--
-- SET NULL instead: the reply survives its parent. `parentId IS NULL` already
-- means "top-level post" (see the ForumPost comment in schema.prisma), so an
-- orphaned reply is promoted to a root post in the same activity/level thread —
-- replies copy their parent's activitySlug and level, so it still lists and
-- moderates correctly. No new state, and nothing in the forum UI has to learn
-- about tombstones.
ALTER TABLE "ForumPost" DROP CONSTRAINT "ForumPost_parentId_fkey";

ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "ForumPost"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
