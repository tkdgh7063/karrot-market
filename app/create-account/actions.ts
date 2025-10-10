"use server";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  ERROR_MESSAGES,
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
          if (issue.input === undefined) return ERROR_MESSAGES.EMAIL_REQUIRED;
          return ERROR_MESSAGES.EMAIL_INVALID;
        },
      })
      .toLowerCase(),
    password: z
      .string()
      .nonempty(ERROR_MESSAGES.PASSWORD_REQUIRED)
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
      .max(PASSWORD_MAX_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_LONG)
      .regex(PASSWORD_REGEXP, ERROR_MESSAGES.PASSWORD_COMPLEXITY),
    confirm_password: z.string(),
    username: z
      .string({
        error: (issue) => {
          if (issue.input === undefined)
            return ERROR_MESSAGES.USERNAME_REQUIRED;
          return ERROR_MESSAGES.USERNAME_INVALID;
        },
      })
      .min(USERNAME_MIN_LENGTH, ERROR_MESSAGES.USERNAME_TOO_SHORT)
      .max(USERNAME_MAX_LENGTH, ERROR_MESSAGES.USERNAME_TOO_LONG)
      .toLowerCase()
      .trim()
      .refine(
        (username) => checkUsername(username),
        ERROR_MESSAGES.USERNAME_CANNOT_CONTAIN_ADMIN,
      ),
  })
  .refine(
    ({ password, confirm_password }) =>
      checkPassword(password, confirm_password),
    {
      path: ["confirm_password"],
      error: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
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
