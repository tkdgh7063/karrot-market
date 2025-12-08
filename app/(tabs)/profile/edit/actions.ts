"use server";

import {
  ERROR_MESSAGES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

function checkUsername(username: string): boolean {
  return !username.includes("admin");
}

const userSchema = z.object({
  userId: z.coerce.number(),
  username: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return ERROR_MESSAGES.USERNAME_REQUIRED;
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
});

export async function editProfile(_: any, formData: FormData) {
  const data = {
    userId: await getLoggedInUserId(),
    username: formData.get("username"),
  };

  const results = userSchema.safeParse(data);
  if (!results.success) {
    return z.flattenError(results.error);
  }

  try {
    await db.user.update({
      where: {
        id: results.data.userId,
      },
      data: {
        username: results.data.username,
      },
      select: {
        id: true,
      },
    });
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        // userId not found
        return {
          fieldErrors: { username: [ERROR_MESSAGES.PROFILE_EDIT_ERROR] },
        };
      }
    }
  }

  return redirect("/profile");
}
