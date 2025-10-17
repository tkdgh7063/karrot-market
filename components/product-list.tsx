"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { fetchMoreProducts } from "@/app/(tabs)/products/actions";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: InitialProducts;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await fetchMoreProducts(1);
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => {
        return <ListProduct {...product} key={product.id} />;
      })}
      <button
        onClick={onLoadMoreClick}
        disabled={isLoading}
        className="mx-auto w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:cursor-pointer hover:opacity-90 active:scale-95"
      >
        {isLoading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
