"use client";

import { dislikePost, likePost } from "@/app/(posts)/posts/[id]/actions";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as SolidHandThumbUpIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { isLiked, likeCount },
    (previousState, _) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    }),
  );

  const toggleLike = () => {
    startTransition(async () => {
      addOptimisticLike(undefined);
      if (optimisticLike.isLiked) {
        await dislikePost(postId);
      } else {
        await likePost(postId);
      }
    });
  };

  return (
    <button
      onClick={toggleLike}
      className={`${optimisticLike.isLiked ? "border-orange-500 bg-orange-500 text-white" : "hover:bg-neutral-800"} flex min-w-[105.23px] items-center justify-center rounded-full border border-neutral-400 px-0.5 py-2 text-sm text-neutral-400 transition-colors hover:cursor-pointer`}
    >
      {optimisticLike.isLiked ? (
        <>
          <SolidHandThumbUpIcon className="mr-1.5 size-5" />
          <span>Liked ({optimisticLike.likeCount})</span>
        </>
      ) : (
        <>
          <OutlineHandThumbUpIcon className="mr-1.5 size-5" />
          <span>Like ({optimisticLike.likeCount})</span>
        </>
      )}
    </button>
  );
}
