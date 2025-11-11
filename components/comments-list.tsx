import db from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      created_at: true,
      payload: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return comments;
}

function getCachedComments(postId: number) {
  return nextCache(
    async () => getComments(postId),
    ["karrot", "post", "comments"],
    {
      tags: [`post-comments-${postId}`],
    },
  )();
}

export default async function CommentsList({ postId }: { postId: number }) {
  const comments = await getCachedComments(postId);

  return (
    <div className="flex w-full flex-col gap-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col items-start gap-1 rounded-md bg-neutral-500 px-3 py-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="text-lg break-words break-all whitespace-normal">
              {comment.payload}
            </div>
            <span className="text-sm">-</span>
            <div className="flex gap-1">
              <div className="size-5 overflow-hidden rounded-full">
                {comment.user.avatar !== null ? (
                  <Image
                    src={comment.user.avatar!}
                    width={28}
                    height={28}
                    alt={comment.user.username}
                  />
                ) : (
                  <UserIcon className="size-5" />
                )}
              </div>
              <div className="text-sm">{comment.user.username}</div>
            </div>
          </div>
          <div className="text-sm">{formatDate(comment.created_at)}</div>
        </div>
      ))}
    </div>
  );
}
