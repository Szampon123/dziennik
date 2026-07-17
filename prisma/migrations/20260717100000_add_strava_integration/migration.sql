-- Strava integration: imported workouts carry their Strava activity id for
-- dedup, and OAuthToken learns the provider-side account id so webhook events
-- (owner_id = athlete id) can be routed back to the local user.

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE "Workout" ADD COLUMN "externalId" TEXT;

-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN "providerAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_userId_externalId_key" ON "Workout"("userId", "externalId");

-- CreateIndex
CREATE INDEX "OAuthToken_provider_providerAccountId_idx" ON "OAuthToken"("provider", "providerAccountId");
