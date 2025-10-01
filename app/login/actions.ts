"use server";

export async function handleForm(prevData: any, formData: FormData) {
  console.log("prev: ", prevData);
  console.log(formData.get("email"), formData.get("password"));
  return {
    errors: ["Wrong password", "Short Password"],
  };
}
