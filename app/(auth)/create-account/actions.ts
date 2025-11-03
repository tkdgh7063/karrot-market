"use server";

import {
  ERROR_MESSAGES,
  HASH_ROUNDS,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { loginUser } from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
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
      .max(PASSWORD_MAX_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_LONG),
    //.regex(PASSWORD_REGEXP, ERROR_MESSAGES.PASSWORD_COMPLEXITY),
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
  .superRefine(async ({ email, password, confirm_password, username }, ctx) => {
    const emailExists = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (emailExists) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: ERROR_MESSAGES.EMAIL_TAKEN,
        continue: false,
      });
      return z.NEVER;
    }

    if (!checkPassword(password, confirm_password)) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
        continue: false,
      });
      return z.NEVER;
    }

    const usernameExists = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (usernameExists) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: ERROR_MESSAGES.USERNAME_TAKEN,
        continue: false,
      });
      return z.NEVER;
    }
  });

export async function createAccount(_: any, formData: FormData) {
  const __ = typeof PASSWORD_REGEXP; // assigned to keep the import
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    username: formData.get("username"),
  };

  const result = await formSchema.spa(data); // spa stands for safeParseAsync
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    // hash password
    const hasedPassword = await bcrypt.hash(result.data.password, HASH_ROUNDS);

    // save the user to db
    const user = await db.user.create({
      data: {
        email: result.data.email,
        username: result.data.username,
        password: hasedPassword,
      },
      select: {
        id: true,
      },
    });

    // log the user in
    await loginUser(user.id);

    // redirect user
    return redirect("/profile");
  }
}
