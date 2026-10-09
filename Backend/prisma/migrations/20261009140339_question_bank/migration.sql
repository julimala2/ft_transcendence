/*
  Warnings:

  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ref` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "creditAuthor" TEXT,
    "creditLicense" TEXT,
    "creditUrl" TEXT
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_QuestionToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_QuestionToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,
    "imageId" INTEGER,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("id", "isCorrect", "questionId", "text") SELECT "id", "isCorrect", "questionId", "text" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ref" TEXT NOT NULL,
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
    CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Question_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("categoryId", "difficulty", "id", "text") SELECT "categoryId", "difficulty", "id", "text" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_ref_key" ON "Question"("ref");
CREATE INDEX "Question_categoryId_difficulty_idx" ON "Question"("categoryId", "difficulty");
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    CONSTRAINT "Quiz_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("createdAt", "description", "id", "title") SELECT "createdAt", "description", "id", "title" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
CREATE TABLE "new_UserAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isCorrect" BOOLEAN NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerId" INTEGER,
    CONSTRAINT "UserAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UserAnswer" ("answerId", "attemptId", "id", "isCorrect", "questionId") SELECT "answerId", "attemptId", "id", "isCorrect", "questionId" FROM "UserAnswer";
DROP TABLE "UserAnswer";
ALTER TABLE "new_UserAnswer" RENAME TO "UserAnswer";
CREATE UNIQUE INDEX "UserAnswer_attemptId_questionId_key" ON "UserAnswer"("attemptId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_quizId_position_key" ON "QuizQuestion"("quizId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Image_src_key" ON "Image"("src");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToTag_AB_unique" ON "_QuestionToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToTag_B_index" ON "_QuestionToTag"("B");
