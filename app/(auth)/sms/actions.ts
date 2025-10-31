"use server";

import { ERROR_MESSAGES } from "@/lib/constants";
import { redirect } from "next/navigation";
import validator from "validator";
import z from "zod";

const phoneSchema = z
  .string()
  .trim()
  .refine(validator.isMobilePhone, ERROR_MESSAGES.PHONE_INVALID_FORMAT)
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    ERROR_MESSAGES.PHONE_INVALID_LOCALE,
  );

const codeSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  code: boolean;
}

export default async function smsLogin(
  prevState: ActionState,
  formData: FormData,
) {
  const phone = formData.get("phone");
  const code = formData.get("code");

  if (!prevState.code) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      console.log(result.error);
      return {
        code: false,
        error: z.flattenError(result.error),
      };
    } else {
      return {
        code: true,
      };
    }
  } else {
    const result = codeSchema.safeParse(code);
    if (!result.success) {
      return {
        code: true,
        error: z.flattenError(result.error),
      };
    } else {
      redirect("/");
    }
  }
}
