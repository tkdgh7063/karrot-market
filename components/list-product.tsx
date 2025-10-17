import { BASE_PHOTO } from "@/lib/constants";
import { formatDate, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  photo: string | null;
  price: number;
  created_at: Date;
  id: number;
}

export default function ListProduct({
  title,
  photo,
  price,
  created_at,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-4">
      <div className="relative size-30 overflow-hidden rounded-md">
        <Image
          src={photo ?? BASE_PHOTO}
          alt={title}
          fill
          className="object-cover"
          // sizes="30"
        />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-lg font-semibold">{formatToWon(price)} Won</span>
        <span className="text-sm text-neutral-500">
          {formatDate(created_at)}
        </span>
      </div>
    </Link>
  );
}
