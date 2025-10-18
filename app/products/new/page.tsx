"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadNewProduct } from "./actions";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export default function NewProduct() {
  const [preview, setPreview] = useState<string | null>(null);
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
      <form action={uploadNewProduct} className="flex flex-col gap-5 p-5">
        <h1 className="text-2xl">New Product</h1>
        <Input name="title" placeholder="Title" type="text" required />
        <Input name="price" placeholder="Price" type="number" required />
        <Input
          name="description"
          placeholder="Description"
          type="text"
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
              <div className="text-lg font-semibold">Upload a photo</div>
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
        <Button text="Upload Product" />
      </form>
    </div>
  );
}
