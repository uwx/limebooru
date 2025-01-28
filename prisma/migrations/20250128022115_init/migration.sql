-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "sha1" TEXT,
    "sha256" TEXT,
    "rating" TEXT NOT NULL DEFAULT 'g',
    "ratingAiConfidence" REAL,
    "sourceUrl" TEXT,
    "pixivId" INTEGER,
    "fileSize" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "PostTag" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "aiConfidence" REAL,

    PRIMARY KEY ("postId", "tagId"),
    CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tagger" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "AiTagStatus" (
    "postId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isAiTagged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AiTagStatus_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Thumbnail" (
    "postId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "thumbnail" BLOB NOT NULL
);

-- CreateTable
CREATE TABLE "Config" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT
);

-- CreateIndex
CREATE INDEX "Post_location_idx" ON "Post"("location");

-- CreateIndex
CREATE INDEX "Post_md5_idx" ON "Post"("md5");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AiTagStatus_postId_key" ON "AiTagStatus"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Thumbnail_postId_key" ON "Thumbnail"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
