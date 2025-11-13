"use client";

import { deleteComment } from "@/app/(posts)/posts/[id]/actions";
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
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (prevState: Comment[], newState: Comment[] | Comment) => {
      if (Array.isArray(newState)) return newState;
      return [newState, ...prevState];
    },
  );

  const handleAddComment = (newComment: Comment) => {
    startTransition(() => {
      setOptimisticComments(newComment);
    });
  };

  const handleDeleteComment = (commentId: number) => {
    startTransition(() => {
      setOptimisticComments(
        optimisticComments.filter((c) => c.id !== commentId),
      );
    });

    deleteComment(postId, commentId);
  };

  return (
    <>
      <div>{optimisticComments.length} Comments</div>
      <AddComment postId={postId} action={handleAddComment} user={user} />
      <CommentsList
        comments={optimisticComments}
        username={user.username}
        action={handleDeleteComment}
      />
    </>
  );
}
