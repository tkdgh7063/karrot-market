/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LiveStream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LiveStream_userId_key" ON "LiveStream"("userId");
