-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ref" TEXT,
    "type" TEXT NOT NULL DEFAULT 'multiple',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "text" TEXT NOT NULL,
    "explanation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,
    "categoryId" INTEGER,
    "imageId" INTEGER,
    CONSTRAINT "Question_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("authorId", "categoryId", "createdAt", "difficulty", "explanation", "id", "imageId", "isActive", "ref", "text", "type") SELECT "authorId", "categoryId", "createdAt", "difficulty", "explanation", "id", "imageId", "isActive", "ref", "text", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_ref_key" ON "Question"("ref");
CREATE INDEX "Question_categoryId_difficulty_idx" ON "Question"("categoryId", "difficulty");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
