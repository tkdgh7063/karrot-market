/*
  Warnings:

  - The primary key for the `EmailCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `EmailCode` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "EmailCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailCode" ("code", "created_at", "email", "expires_at", "id", "updated_at", "userId") SELECT "code", "created_at", "email", "expires_at", "id", "updated_at", "userId" FROM "EmailCode";
DROP TABLE "EmailCode";
ALTER TABLE "new_EmailCode" RENAME TO "EmailCode";
CREATE INDEX "EmailCode_email_idx" ON "EmailCode"("email");
CREATE UNIQUE INDEX "EmailCode_code_email_key" ON "EmailCode"("code", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
