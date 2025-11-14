import { BASE_PHOTO } from "@/lib/constants";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import FormattedDate from "./formatted-date";

interface ListProductProps {
  title: string;
  photo: string | null;
  price: number;
  created_at: Date;
  edited: boolean;
  id: number;
}

export default function ListProduct({
  title,
  photo,
  price,
  created_at,
  edited,
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
        <FormattedDate
          date={created_at}
          className="text-sm text-neutral-500"
          edited={edited}
        />
      </div>
    </Link>
  );
}
