import { Comment } from "@/lib/types";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import CommentDate from "./comment-date";

export default function CommentsList({
  comments,
  username,
  action,
}: {
  comments: Comment[];
  username: string;
  action: (commentId: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start justify-between gap-1 rounded-md bg-neutral-500 px-3 py-1.5"
        >
          <div>
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
            <CommentDate date={comment.created_at} />
          </div>
          {username === comment.user.username && (
            <XMarkIcon
              onClick={() => action(comment.id)}
              className="size-7 hover:cursor-pointer hover:text-red-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}
