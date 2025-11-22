-- CreateTable
CREATE TABLE "ChatRoomReadStatus" (
    "last_read_time" DATETIME,
    "userId" INTEGER NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "chatRoomId"),
    CONSTRAINT "ChatRoomReadStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChatRoomReadStatus_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
