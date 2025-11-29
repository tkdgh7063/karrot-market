import StreamLiveChatClient from "@/components/stream-live-chat";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { deleteStream } from "../add/actions";

async function getStream(streamId: string) {
  const stream = await db.liveStream.findUnique({
    where: {
      streamId,
    },
    omit: {
      id: true,
      updated_at: true,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return stream;
}

async function getUsername(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });

  if (!user) return null;
  return user.username;
}

export default async function StreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const streamId = (await params).id;

  const stream = await getStream(streamId);
  if (!stream) return notFound();

  const loggedInUserId = await getLoggedInUserId();
  const username = await getUsername(loggedInUserId);
  if (!username) return notFound();

  return (
    <div className="flex h-[100vh] flex-col justify-between p-5">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-video">
          {/* <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.streamKey}/iframe`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className="h-full w-full rounded-md"
        /> */}
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar}
              alt={stream.user.username}
              fill
              className="rounded-md blur-sm hover:blur-none"
            />
          ) : (
            <UserIcon className="rounded-md bg-neutral-700 blur-sm" />
          )}
        </div>
        <span>STREAM TITLE: {stream.title}</span>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="text-white">HOSTED BY:</span>
            {stream.user.avatar !== null ? (
              <Image
                src={stream.user.avatar}
                alt={stream.user.username}
                height={28}
                width={28}
                className="size-6 overflow-hidden rounded-full"
              />
            ) : (
              <UserIcon className="size-6 overflow-hidden rounded-full" />
            )}
            <span>{stream.user.username}</span>
          </div>
        </div>
        {stream.userId === loggedInUserId && (
          <div className="flex flex-col gap-1 rounded-md bg-yellow-200 p-3 text-black">
            <div className="flex gap-2">
              <span className="font-semibold">Stream URL</span>
              <span>rtmps://live.cloudflare.com:443/live/</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold">Secret Key</span>
              <span className="break-all text-sm">{stream.streamKey}</span>
            </div>
            <form action={deleteStream} className="flex justify-center">
              <input type="hidden" name="streamId" value={streamId} />
              <button className="h-10 self-center rounded-lg bg-red-500 px-3 text-center font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 disabled:hover:bg-neutral-400">
                Delete Stream
              </button>
            </form>
          </div>
        )}
      </div>
      <StreamLiveChatClient
        streamId={streamId}
        userId={loggedInUserId}
        username={username}
        streamerId={stream.userId}
        isStreamOwner={stream.userId === loggedInUserId}
      />
    </div>
  );
}
