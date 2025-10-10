"use server";

import { z } from "zod";

function checkUsername(username: string): boolean {
  return !username.includes("admin");
}

function checkPassword(password: string, confirm_password: string): boolean {
  return password === confirm_password;
}

const passwordRegexp = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])(?!.*\s).+$/,
);

const formSchema = z
  .object({
    email: z.email("Please enter a valid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be less than 20 characters")
      .regex(
        passwordRegexp,
        "Password must have uppercase, lowercase, number, special character, and no spaces.",
      ),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(15, "Username must be less than 15 characters")
      .toLowerCase()
      .trim()
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
  } else {
    return;
  }
}
