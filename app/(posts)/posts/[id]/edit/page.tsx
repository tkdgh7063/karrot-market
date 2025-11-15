import EditPostForm from "@/components/edit-post-form";
import db from "@/lib/db";
import { PromiseReturnType } from "@prisma/client";
import { notFound } from "next/navigation";

async function getPost(id: number) {
  const post = await db.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
  if (!post) return null;
  return post;
}

export type Post = PromiseReturnType<typeof getPost>;

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (isNaN(id)) return notFound();

  const post = await getPost(id);
  if (!post) return notFound();

  return <EditPostForm key={post.id} post={post} />;
}
