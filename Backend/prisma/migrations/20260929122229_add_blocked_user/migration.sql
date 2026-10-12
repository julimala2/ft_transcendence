-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blocker_id" INTEGER NOT NULL,
    "blocked_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlockedUser_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlockedUser_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blocker_id_blocked_id_key" ON "BlockedUser"("blocker_id", "blocked_id");
