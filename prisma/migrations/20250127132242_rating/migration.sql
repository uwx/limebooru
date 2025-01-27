-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT 'g'
);
INSERT INTO "new_Post" ("id", "location", "md5") SELECT "id", "location", "md5" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_location_idx" ON "Post"("location");
CREATE INDEX "Post_md5_idx" ON "Post"("md5");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
