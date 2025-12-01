"use server";

import { createLiveInput } from "@/app/api/stream/[accountId]/live_inputs/route";
import { ERROR_MESSAGES, STREAM_TITLE_MAX_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const titleSchema = z
  .string({ error: ERROR_MESSAGES.STREAM_TITLE_NOT_STRING })
  .trim()
  .nonempty(ERROR_MESSAGES.STREAM_TITLE_REQUIRED)
  .max(STREAM_TITLE_MAX_LENGTH, ERROR_MESSAGES.STREAM_TITLE_TOO_LONG);

const streamIdSchema = z.string().trim().nonempty();

export async function startStream(_: any, formData: FormData) {
  const results = titleSchema.safeParse(formData.get("title"));
  if (!results.success) return z.flattenError(results.error);

  const loggedInUserId = await getLoggedInUserId();
  // const response = await fetch(
  // `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  //     },
  //     body: JSON.stringify({
  //       meta: { name: results.data },
  //       recording: { mode: "automatic" },
  //     }),
  //   },
  // );
  const response = await createLiveInput(results.data);
  const data = await response.json();

  let stream;
  try {
    stream = await db.$transaction(async (tx) => {
      await tx.liveStream.deleteMany({
        where: {
          userId: loggedInUserId,
        },
      });

      return await tx.liveStream.create({
        data: {
          title: results.data,
          streamId: data.result.uid,
          streamKey: data.result.rtmps.streamKey,
          userId: loggedInUserId,
        },
        select: {
          streamId: true,
        },
      });
    });
  } catch (e) {
    return {
      ok: false,
      error: ERROR_MESSAGES.STREAM_CREATION_FAILED,
    };
  }
  return redirect(`/streams/${stream.streamId}`);
}

export async function deleteStream(formData: FormData) {
  const streamId = formData.get("streamId") as string;
  if (!streamId || typeof streamId !== "string") return;

  const results = streamIdSchema.safeParse(streamId);
  if (!results.success) return;

  await db.liveStream.delete({
    where: {
      streamId,
    },
  });
  return redirect("/live");
}
