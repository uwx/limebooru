-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "sha1" TEXT,
    "sha256" TEXT,
    "rating" TEXT NOT NULL DEFAULT 'g',
    "sourceUrl" TEXT,
    "pixivId" INTEGER,
    "fileSize" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Post" ("id", "location", "md5", "rating") SELECT "id", "location", "md5", "rating" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_location_idx" ON "Post"("location");
CREATE INDEX "Post_md5_idx" ON "Post"("md5");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
