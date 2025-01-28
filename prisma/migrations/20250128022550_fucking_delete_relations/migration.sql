-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostTag" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "aiConfidence" REAL,

    PRIMARY KEY ("postId", "tagId")
);
INSERT INTO "new_PostTag" ("aiConfidence", "postId", "tagId") SELECT "aiConfidence", "postId", "tagId" FROM "PostTag";
DROP TABLE "PostTag";
ALTER TABLE "new_PostTag" RENAME TO "PostTag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
