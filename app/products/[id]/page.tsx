async function getProduct() {
  return new Promise((resolve) => setTimeout(resolve, 120000));
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct();
  return (
    <div>
      <h1 className="text-xl text-white">
        Product Detail of the product {id}!
      </h1>
    </div>
  );
}
