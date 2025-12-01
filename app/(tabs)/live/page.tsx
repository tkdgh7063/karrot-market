import AddIconBtn from "@/components/add-icon-btn";
import StreamCard from "@/components/stream-card";
import db from "@/lib/db";

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
    omit: {
      updated_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div
      className={`mt-5 flex h-[100vh] flex-col gap-2 px-5 ${streams.length === 0 ? "items-center justify-center" : null}`}
    >
      {streams.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 *:text-xl">
          <span>No streams are live right now 😴</span>
          <span>Check back later or start your own stream!</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}
      <AddIconBtn href={`/streams/add`} />
    </div>
  );
}
