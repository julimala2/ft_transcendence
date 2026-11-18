/*
  Warnings:

  - Added the required column `mode` to the `OnlineGame` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OnlineGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "mode" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "quizId" INTEGER,
    "categoryId" INTEGER,
    CONSTRAINT "OnlineGame_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OnlineGame_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OnlineGame" ("categoryId", "finishedAt", "id", "quizId", "startedAt", "status", "totalQuestions") SELECT "categoryId", "finishedAt", "id", "quizId", "startedAt", "status", "totalQuestions" FROM "OnlineGame";
DROP TABLE "OnlineGame";
ALTER TABLE "new_OnlineGame" RENAME TO "OnlineGame";
CREATE INDEX "OnlineGame_categoryId_idx" ON "OnlineGame"("categoryId");
CREATE INDEX "OnlineGame_mode_categoryId_idx" ON "OnlineGame"("mode", "categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
