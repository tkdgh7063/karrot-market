import db from "@/lib/db";
import { getLoggedInUserId } from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import FormattedDate from "./formatted-date";

interface ProductDetailProps {
  product: {
    id: number;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    edited: boolean;
    userId: number;
    price: number;
    photo: string;
    user: {
      username: string;
      avatar: string | null;
    };
  };
  isOwner: boolean;
}

export default function ProductDetail({
  product,
  isOwner,
}: ProductDetailProps) {
  const createChatRoom = async () => {
    "use server";
    const loggedInUserId = await getLoggedInUserId();
    const existingRoom = await db.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: loggedInUserId } } },
          { users: { some: { id: product.userId } } },
        ],
      },
      select: {
        id: true,
      },
    });
    if (existingRoom) {
      redirect(`/chats/${existingRoom.id}`);
    } else {
      const room = await db.chatRoom.create({
        data: {
          users: {
            connect: [
              {
                id: product.userId,
              },
              { id: loggedInUserId },
            ],
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/chats/${room.id}`);
    }
  };
  return (
    <div>
      <div className="relative aspect-square">
        <Image
          src={product.photo ?? ""}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <span className="text-semibold text-md">{product.user.username}</span>
          <div>
            <FormattedDate
              date={product.created_at}
              className="text-sm"
              edited={product.edited}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10">
        <span className="text-xl font-semibold">
          {formatToWon(product.price)} Won
        </span>
        {isOwner ? (
          <Link
            className="rounded-md bg-orange-500 px-4 py-2.5 font-semibold text-white"
            href={`/products/${product.id}/edit`}
          >
            Edit Product
          </Link>
        ) : (
          <form action={createChatRoom}>
            <button className="rounded-md bg-orange-500 px-4 py-2.5 font-semibold text-white hover:cursor-pointer hover:bg-orange-400">
              Chat with seller
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
