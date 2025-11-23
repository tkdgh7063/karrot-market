-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoomReadStatus" (
    "last_read_time" DATETIME,
    "userId" INTEGER NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "chatRoomId"),
    CONSTRAINT "ChatRoomReadStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomReadStatus_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoomReadStatus" ("chatRoomId", "last_read_time", "userId") SELECT "chatRoomId", "last_read_time", "userId" FROM "ChatRoomReadStatus";
DROP TABLE "ChatRoomReadStatus";
ALTER TABLE "new_ChatRoomReadStatus" RENAME TO "ChatRoomReadStatus";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatRoomId", "created_at", "id", "payload", "updated_at", "userId") SELECT "chatRoomId", "created_at", "id", "payload", "updated_at", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
