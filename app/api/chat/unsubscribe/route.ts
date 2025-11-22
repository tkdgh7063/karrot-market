import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { datetime } from "zod/v4/core/regexes.cjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatRoomId, userId, last_read_time } = body;

    const result = await db.chatRoomReadStatus.upsert({
      where: {
        id: {
          userId,
          chatRoomId,
        },
      },
      update: {
        last_read_time,
      },
      create: {
        userId,
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
