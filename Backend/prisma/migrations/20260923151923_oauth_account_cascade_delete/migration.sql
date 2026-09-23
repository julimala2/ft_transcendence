-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OAuthAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OAuthAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OAuthAccount" ("created_at", "id", "provider", "provider_user_id", "user_id") SELECT "created_at", "id", "provider", "provider_user_id", "user_id" FROM "OAuthAccount";
DROP TABLE "OAuthAccount";
ALTER TABLE "new_OAuthAccount" RENAME TO "OAuthAccount";
CREATE UNIQUE INDEX "OAuthAccount_provider_provider_user_id_key" ON "OAuthAccount"("provider", "provider_user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
