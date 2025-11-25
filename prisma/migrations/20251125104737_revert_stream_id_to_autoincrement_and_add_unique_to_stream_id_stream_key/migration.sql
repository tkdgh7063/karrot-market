/*
  Warnings:

  - The primary key for the `LiveStream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `LiveStream` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LiveStream" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "LiveStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LiveStream" ("created_at", "id", "streamId", "streamKey", "title", "updated_at", "userId") SELECT "created_at", "id", "streamId", "streamKey", "title", "updated_at", "userId" FROM "LiveStream";
DROP TABLE "LiveStream";
ALTER TABLE "new_LiveStream" RENAME TO "LiveStream";
CREATE UNIQUE INDEX "LiveStream_streamKey_key" ON "LiveStream"("streamKey");
CREATE UNIQUE INDEX "LiveStream_streamId_key" ON "LiveStream"("streamId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
