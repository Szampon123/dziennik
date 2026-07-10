-- Machine translations of the seeded Polish copy. Polish stays canonical in
-- `name` / `title` / `detail`; these columns are backfilled out-of-band by
-- scripts/translate-seed.mjs and are NULL until it runs.
--
-- Nullable with no default, so this is a metadata-only change on Postgres:
-- no table rewrite, no lock held while rows are touched. Safe to deploy ahead
-- of the backfill — readers fall back to Polish when a column is NULL.
ALTER TABLE "Activity" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Activity" ADD COLUMN "nameDe" TEXT;
ALTER TABLE "Activity" ADD COLUMN "nameEs" TEXT;

ALTER TABLE "Milestone" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "titleDe" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "titleEs" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "detailEn" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "detailDe" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "detailEs" TEXT;
