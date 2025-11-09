import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
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
        views: true,
        created_at: true,
        updated_at: true,
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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const getCachedPost = nextCache(getPost, ["karrot", "post", "detail"], {
    revalidate: 60,
    tags: [`post-detail-${id}`],
  });
  const getCachedLikeStatus = nextCache(
    async (postId: number, userId: number) => getLikeStatus(postId, userId),
    ["karrot", "post", "like-status"],
    {
      tags: [`like-status-${id}`],
    },
  );

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const userId = (await getSession()).id!;
  const { isLiked, likeCount } = await getCachedLikeStatus(id, userId);

  return (
    <div className="p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        <Image
          src={post.user.avatar ?? ""}
          width={28}
          height={28}
          alt={post.user.username}
          className="size-7 overflow-hidden rounded-full"
        />
        <div>
          <span className="text-md font-semibold">{post.user.username}</span>
          <div className="text-sm">
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
      <h2 className="mb-3 text-2xl font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="mb-8 flex flex-col items-start gap-5">
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>
            {post.views} {post.views === 1 ? "view" : "views"}
          </span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <span>{post._count.comments} comments</span>
        </div>
      </div>
    </div>
  );
}
