/*
  Warnings:

  - Made the column `phone` on table `SMSCode` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SMSCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SMSCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SMSCode" ("code", "created_at", "expires_at", "id", "phone", "updated_at", "userId") SELECT "code", "created_at", "expires_at", "id", "phone", "updated_at", "userId" FROM "SMSCode";
DROP TABLE "SMSCode";
ALTER TABLE "new_SMSCode" RENAME TO "SMSCode";
CREATE INDEX "SMSCode_phone_idx" ON "SMSCode"("phone");
CREATE UNIQUE INDEX "SMSCode_code_phone_key" ON "SMSCode"("code", "phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
