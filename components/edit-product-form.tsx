"use client";

import { updateProduct } from "@/app/(products)/products/[id]/edit/actions";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import Button from "./button";
import Input from "./input";
import { Product } from "@/app/(products)/products/[id]/edit/page";

export default function EditProductForm({ product }: { product: Product }) {
  if (!product) return;

  const [state, action] = useActionState(updateProduct, null);
  const [preview, setPreview] = useState<string | null>(product.photo);
  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;

    const file = files[0];
    if (!ALLOWED_TYPES.includes(file.type)) return;
    if (file.size > MAX_FILE_SIZE) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div className="">
      <form action={action} className="flex flex-col gap-5 p-5">
        <h1 className="text-2xl">Edit Product</h1>
        <input type="hidden" name="id" value={product.id} />
        <Input
          name="title"
          placeholder="Title"
          type="text"
          defaultValue={product.title}
          errors={[]}
          required
        />
        <Input
          name="price"
          placeholder="Price"
          type="number"
          min={0}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value < 0) return;
            e.target.value = value.toString();
          }}
          defaultValue={product.price}
          errors={[]}
          required
        />
        <Input
          name="description"
          placeholder="Description"
          type="text"
          defaultValue={product.description}
          errors={[]}
          required
        />
        <label
          htmlFor="photo"
          style={{ backgroundImage: `url(${preview})` }}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-400 bg-cover bg-center text-neutral-400"
        >
          {preview ? null : (
            <>
              <PhotoIcon className="h-32" />
              <div className="text-lg font-semibold">
                Upload a photo
                {""}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageUpload}
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          hidden
        />
        <Button text="Edit Product" />
      </form>
    </div>
  );
}
