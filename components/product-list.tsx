"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { fetchMoreProducts } from "@/app/(tabs)/products/actions";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: InitialProducts;
}) {
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await fetchMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0, // trigger when 100% of the target is visible
        rootMargin: "0px 0px -100px 0px", // trigger when the bottom of the target is 100px from the bottom of the viewport
      },
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => {
        return <ListProduct {...product} key={product.id} />;
      })}
      {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 300}vh`,
          }}
          className="mx-auto mb-96 w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:cursor-pointer hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
