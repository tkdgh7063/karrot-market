import ListProduct from "@/components/list-product";
import db from "@/lib/db";

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      photo: true,
      price: true,
      created_at: true,
      id: true,
    },
  });
  return products;
}

export default async function Products() {
  const products = await getProducts();
  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => {
        return <ListProduct {...product} key={product.id} />;
      })}
    </div>
  );
}
