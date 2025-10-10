"use server";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import { z } from "zod";

function checkUsername(username: string): boolean {
  return !username.includes("admin");
}

function checkPassword(password: string, confirm_password: string): boolean {
  return password === confirm_password;
}

const formSchema = z
  .object({
    email: z
      .email({
        error: (issue) => {
          if (issue.input === undefined) return "Email is required";
          return "Please enter a valid email address";
        },
      })
      .toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters long")
      .max(PASSWORD_MAX_LENGTH, "Password must be less than 20 characters")
      .regex(
        PASSWORD_REGEXP,
        "Password must have uppercase, lowercase, number, special character, and no spaces.",
      ),
    confirm_password: z.string(),
    username: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return "Username is required";
          return "Please enter a valid username";
        },
      })
      .min(USERNAME_MIN_LENGTH, "Username must be at least 3 characters long")
      .max(USERNAME_MAX_LENGTH, "Username must be less than 15 characters")
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
