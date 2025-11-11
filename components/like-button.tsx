"use client";

import { dislikePost, likePost } from "@/app/(posts)/posts/[id]/actions";
import {
  HandThumbUpIcon as OutlineHandThumbUpIcon,
  HandThumbUpIcon as SolidHandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, startTransition, useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

const DEBOUNCE_DELAY_MS = 500;

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [_, addOptimisticLike] = useOptimistic(
    { isLiked, likeCount },
    (_, newState: { isLiked: boolean; likeCount: number }) => newState,
  );

  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;

    setLiked(newLiked);
    setCount(newCount);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          if (newLiked) {
            await likePost(postId);
          } else {
            await dislikePost(postId);
          }

          addOptimisticLike({ isLiked: newLiked, likeCount: newCount });
        } catch (e) {
          setLiked(isLiked);
          setCount(likeCount);
        }
      });
    }, DEBOUNCE_DELAY_MS);
  };

  return (
    <button
      onClick={toggleLike}
      className={`${
        liked
          ? "border-orange-500 bg-orange-500 text-white"
          : "hover:bg-neutral-800"
      } flex min-w-[105.23px] items-center justify-center rounded-full border border-neutral-400 px-0.5 py-2 text-sm text-neutral-400 transition-colors hover:cursor-pointer`}
    >
      {liked ? (
        <>
          <SolidHandThumbUpIcon className="mr-1.5 size-5" />
          <span>Liked ({count})</span>
        </>
      ) : (
        <>
          <OutlineHandThumbUpIcon className="mr-1.5 size-5" />
          <span>Like ({count})</span>
        </>
      )}
    </button>
  );
}
