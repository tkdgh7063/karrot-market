"use server";

import { z } from "zod";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
  username: z.string().min(3).max(15),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    username: formData.get("username"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }
}
