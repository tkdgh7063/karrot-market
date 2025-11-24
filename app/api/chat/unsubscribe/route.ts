import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatRoomId, loggedInUserId, last_read_time } = body;

    const status = await db.chatRoomReadStatus.findUnique({
      where: {
        id: {
          chatRoomId,
          userId: loggedInUserId,
        },
      },
      select: {
        chatRoomId: true,
      },
    });

    if (!status) {
      // user is not in the chat room
      return NextResponse.json({ ok: true, skipped: true });
    }

    const result = await db.chatRoomReadStatus.upsert({
      where: {
        id: {
          userId: loggedInUserId,
          chatRoomId,
        },
      },
      update: {
        last_read_time,
      },
      create: {
        userId: loggedInUserId,
        chatRoomId,
        last_read_time,
      },
    });

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Failed to update last read time" },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { ok: false, error: "Failed to update last read time" },
      { status: 500 },
    );
  }
}
