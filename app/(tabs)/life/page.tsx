import AddIconBtn from "@/components/add-icon-btn";
import FormattedDate from "@/components/formatted-date";
import db from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  ChatBubbleOvalLeftIcon,
  EyeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          username: true,
        },
      },
      _count: true,
      edited: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return posts;
}

export const metadata: Metadata = {
  title: "Town",
};

export default async function Life() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col p-5">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="mb-5 flex flex-col gap-2 border-b border-neutral-500 pb-5 text-neutral-400 *:px-1 last:border-b-0 last:pb-0"
        >
          <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm *:flex *:items-center">
            <div className="gap-2">
              <FormattedDate
                date={post.created_at}
                className="text-sm"
                edited={post.edited}
              />
              <span>·</span>
              <span className="flex items-center gap-1">
                <EyeIcon className="size-5" />
                {post.views} {post.views === 1 ? "view" : "views"}
              </span>
            </div>
            <div className="gap-2 *:flex *:items-center">
              <div>
                <HandThumbUpIcon className="size-5" />
                <span className="ml-0.5">{post._count.likes}</span>
              </div>
              <div>
                <ChatBubbleOvalLeftIcon className="size-5" />
                <span className="ml-0.5">{post._count.comments}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      <AddIconBtn href={`/add-posts`} />
    </div>
  );
}
