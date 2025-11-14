import CommentSection from "@/components/comment-section";
import DeletePostForm from "@/components/delete-post-form";
import FormattedDate from "@/components/formatted-date";
import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(postId: number) {
  try {
    const post = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
        edited: true,
        _count: {
          select: {
            comments: true,
          },
        },
        userId: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    return null;
  }
}

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        userId,
        postId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return { isLiked: Boolean(isLiked), likeCount };
}

async function getViews(postId: number) {
  const views = await db.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      views: true,
    },
  });
  return views;
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      created_at: true,
      payload: true,
      edited: true,
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

const getCachedPost = (postId: number) => {
  return nextCache(
    async () => getPost(postId),
    ["karrot", "post", "detail", postId.toString()],
    {
      revalidate: 60,
      tags: [`post-${postId}`, `post-detail-${postId}`],
    },
  )();
};

const getCachedLikeStatus = (postId: number, userId: number) => {
  return nextCache(
    async () => getLikeStatus(postId, userId),
    ["karrot", "post", "like-status"],
    {
      tags: [`post-${postId}`, `like-status-${postId}`],
    },
  )();
};

const getCachedViews = (postId: number) => {
  return nextCache(async () => getViews(postId), ["karrot", "post", "views"], {
    revalidate: 5,
    tags: [`post-${postId}`],
  })();
};

function getCachedComments(postId: number) {
  return nextCache(
    async () => getComments(postId),
    ["karrot", "post", "comments", postId.toString()],
    {
      tags: [`post-${postId}`, `post-comments-${postId}`],
    },
  )();
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const loggedInUserId = await getLoggedInUserId();
  const isOwner = loggedInUserId === post.userId;

  const { isLiked, likeCount } = await getCachedLikeStatus(id, loggedInUserId);

  const views = (await getCachedViews(id))!.views;

  const comments = await getCachedComments(id);

  return (
    <div className="p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        {post.user.avatar !== null ? (
          <Image
            src={post.user.avatar}
            width={28}
            height={28}
            alt={post.user.username}
            className="size-7 overflow-hidden rounded-full"
          />
        ) : (
          <UserIcon className="size-7" />
        )}
        <div>
          <span className="text-md font-semibold">{post.user.username}</span>
          <div>
            <FormattedDate
              date={post.created_at}
              className="text-sm"
              edited={post.edited}
            />
          </div>
        </div>
      </div>
      <h2 className="mb-3 text-2xl font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="mb-8 flex flex-col items-start gap-5">
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>
            {views} {views === 1 ? "view" : "views"}
          </span>
        </div>
        {isOwner ? (
          <DeletePostForm postId={id} />
        ) : (
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        )}
      </div>
      <div className="flex flex-col items-start gap-5">
        <CommentSection postId={id} comments={comments} user={post.user} />
      </div>
    </div>
  );
}

export const dynamicParams = true;

export const generateStaticParams = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
    },
  });
  return posts.map((post) => ({ id: post.id.toString() }));
};
