"use client";

import { Comment, User } from "@/lib/types";
import { startTransition, useOptimistic } from "react";
import AddComment from "./add-comment";
import CommentsList from "./comments-list";

export default function CommentSection({
  postId,
  comments,
  user,
}: {
  postId: number;
  comments: Comment[];
  user: User;
}) {
  const [optimisticComments, addOptimisticComments] = useOptimistic(
    comments,
    (prevState: Comment[], newComment: Comment) => [newComment, ...prevState],
  );

  const handleAddComment = (newComment: Comment) => {
    startTransition(() => {
      addOptimisticComments(newComment);
    });
  };

  return (
    <>
      <AddComment postId={postId} action={handleAddComment} user={user} />
      <CommentsList comments={optimisticComments} />
    </>
  );
}
