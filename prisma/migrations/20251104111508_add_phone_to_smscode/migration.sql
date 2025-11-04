/*
  Warnings:

  - Added the required column `expires_at` to the `SMSCode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SMSCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "code" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SMSCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SMSCode" ("code", "created_at", "id", "updated_at", "userId") SELECT "code", "created_at", "id", "updated_at", "userId" FROM "SMSCode";
DROP TABLE "SMSCode";
ALTER TABLE "new_SMSCode" RENAME TO "SMSCode";
CREATE UNIQUE INDEX "SMSCode_code_key" ON "SMSCode"("code");
CREATE INDEX "SMSCode_phone_idx" ON "SMSCode"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
