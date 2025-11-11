"use client";

import { Comment } from "@/lib/types";
import { startTransition, useOptimistic } from "react";
import AddComment from "./add-comment";
import CommentsList from "./comments-list";

export default function CommentSection({
  postId,
  comments,
}: {
  postId: number;
  comments: Comment[];
}) {
  const [optimisticComments, addOptimisticComments] = useOptimistic(
    comments,
    (prevState: Comment[], newComment: Comment) => [newComment, ...prevState],
  );

  const handleAddComment = async (newComment: Comment) => {
    startTransition(() => {
      addOptimisticComments(newComment);
    });
  };

  return (
    <>
      <AddComment postId={postId} action={handleAddComment} />
      <CommentsList comments={optimisticComments} />
    </>
  );
}
