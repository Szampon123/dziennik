-- Extra Dudu customization slots (hat, glasses, outfit, pants, shoes, item,
-- background) stored as JSON alongside the existing duduColor.
ALTER TABLE "User" ADD COLUMN "duduConfigJson" TEXT NOT NULL DEFAULT '{}';
