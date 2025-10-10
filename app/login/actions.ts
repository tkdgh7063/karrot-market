"use server";

import { ERROR_MESSAGES } from "@/lib/constants";
import z from "zod";

const formSchema = z.object({
  email: z.email(ERROR_MESSAGES.EMAIL_INVALID).toLowerCase(),
  password: z
    .string()
    .nonempty(ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(8, ERROR_MESSAGES.PASSWORD_WRONG)
    .max(20, ERROR_MESSAGES.PASSWORD_WRONG),
});

export async function login(_: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);

  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    console.log(result.data);
  }
}
