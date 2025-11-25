import db from "@/lib/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function createLiveInput(title: string) {
  let uid: string = "";
  let streamKey: string = "";
  let exists = true;

  while (exists) {
    uid = uuidv4().replace(/-/g, "");
    streamKey = randomBytes(32).toString("hex");

    const conflict = await db.liveStream.findFirst({
      where: {
        OR: [{ streamId: uid }, { streamKey: streamKey }],
      },
      select: { id: true },
    });

    exists = !!conflict;
  }

  return NextResponse.json({
    result: {
      uid,
      rtmps: { streamKey },
      meta: { name: title },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response(null, { status: 401 });
    }

    const body = await req.json();
    const title = body.meta.name;
    return createLiveInput(title);
  } catch (e) {
    console.log(e);
  }
}
