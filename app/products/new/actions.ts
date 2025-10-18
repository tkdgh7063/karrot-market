"use server";

export async function uploadNewProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    photo: formData.get("photo"),
  };
  console.log(data);
  return;
}
