-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AiTagStatus" (
    "postId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isAiTagged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AiTagStatus_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AiTagStatus" ("isAiTagged", "postId") SELECT "isAiTagged", "postId" FROM "AiTagStatus";
DROP TABLE "AiTagStatus";
ALTER TABLE "new_AiTagStatus" RENAME TO "AiTagStatus";
CREATE UNIQUE INDEX "AiTagStatus_postId_key" ON "AiTagStatus"("postId");
CREATE TABLE "new_PostTag" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "aiConfidence" REAL,

    PRIMARY KEY ("postId", "tagId"),
    CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostTag" ("aiConfidence", "postId", "tagId") SELECT "aiConfidence", "postId", "tagId" FROM "PostTag";
DROP TABLE "PostTag";
ALTER TABLE "new_PostTag" RENAME TO "PostTag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
