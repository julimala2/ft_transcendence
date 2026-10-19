-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "mode" TEXT NOT NULL DEFAULT 'limite',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER,
    "categoryId" INTEGER,
    "tagId" INTEGER,
    "difficulty" INTEGER,
    CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuizAttempt" ("categoryId", "difficulty", "finishedAt", "id", "quizId", "score", "startedAt", "tagId", "totalQuestions", "userId") SELECT "categoryId", "difficulty", "finishedAt", "id", "quizId", "score", "startedAt", "tagId", "totalQuestions", "userId" FROM "QuizAttempt";
DROP TABLE "QuizAttempt";
ALTER TABLE "new_QuizAttempt" RENAME TO "QuizAttempt";
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");
CREATE INDEX "QuizAttempt_categoryId_tagId_difficulty_idx" ON "QuizAttempt"("categoryId", "tagId", "difficulty");
CREATE INDEX "QuizAttempt_categoryId_difficulty_mode_status_idx" ON "QuizAttempt"("categoryId", "difficulty", "mode", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
