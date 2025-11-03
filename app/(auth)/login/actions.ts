"use server";

import { ERROR_MESSAGES } from "@/lib/constants";
import db from "@/lib/db";
import { loginUser } from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import z from "zod";

const isEmailRegistered = async (email: string) => {
  const user = db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .toLowerCase()
    .refine(isEmailRegistered, ERROR_MESSAGES.EMAIL_NOT_REGISTERED),
  password: z
    .string()
    .nonempty(ERROR_MESSAGES.PASSWORD_REQUIRED)
    //.min(8, ERROR_MESSAGES.PASSWORD_WRONG)
    .max(20, ERROR_MESSAGES.PASSWORD_WRONG),
});

export async function login(_: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);

  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    // if the user found, check password
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const match = await bcrypt.compare(
      result.data.password,
      user?.password ?? "",
    );

    // log the user in
    if (match) {
      await loginUser(user!.id);

      // redirect user
      return redirect("/profile");
    } else {
      // show password error
      return {
        fieldErrors: {
          email: [],
          password: [ERROR_MESSAGES.PASSWORD_WRONG],
        },
      };
    }
  }
}
