"use server";

import { z } from "zod";

function checkUsername(username: string): boolean {
  return !username.includes("admin");
}

function checkPassword(password: string, confirm_password: string): boolean {
  return password === confirm_password;
}

const formSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(15, "Username must be less than 15 characters")
      .refine(
        (username) => checkUsername(username),
        "Username cannot contain 'admin'",
      ),
  })
  .refine(
    ({ password, confirm_password }) =>
      checkPassword(password, confirm_password),
    {
      path: ["confirm_password"],
      error: "Password confirmation does not match",
    },
  );

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
