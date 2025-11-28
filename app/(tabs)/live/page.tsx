import AddIconBtn from "@/components/add-icon-btn";
import db from "@/lib/db";
import { formatStreamDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

export default async function Live() {
  const streams = await db.liveStream.findMany({
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-semibold p-5 text-center text-2xl text-white">
        Live
      </div>
      <div className="grid grid-cols-2 gap-2 px-2">
        {streams.map((stream) => (
          <Link
            className="flex flex-col gap-2 rounded-md bg-orange-500 px-3 py-2 text-white hover:bg-orange-400"
            key={stream.id}
            href={`/streams/${stream.streamId}`}
          >
            <div>{stream.title}</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm">
                {formatStreamDate(stream.created_at)}
              </div>
              <div className="flex items-center gap-1.5">
                {stream.user.avatar !== null ? (
                  <Image
                    src={stream.user.avatar}
                    width={28}
                    height={28}
                    alt={stream.user.username}
                    className="size-5 overflow-hidden rounded-full"
                  />
                ) : (
                  <UserIcon className="size-5 overflow-hidden rounded-full" />
                )}
                <div>{stream.user.username}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <AddIconBtn href={`/streams/add`} />
    </div>
  );
}
