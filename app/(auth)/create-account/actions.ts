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
import { getPendingEmail, loginUser, savePendingEmail } from "@/lib/session";
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

async function isCodeExists(code: string) {
  const isExists = await db.emailCode.findFirst({
    where: {
      code,
    },
    select: {
      id: true,
    },
  });

  return Boolean(isExists);
}

function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;

  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }

  return result;
}

async function createCode(email: string) {
  let code: string;
  while (true) {
    code = generateRandomCode();
    const exists = await db.emailCode.findUnique({
      where: {
        code_email: {
          code,
          email,
        },
      },
      select: {
        id: true,
      },
    });
    if (!exists) break;
  }

  return code;
}

const codeSchema = z
  .string()
  .nonempty(ERROR_MESSAGES.CODE_REQUIRED)
  .min(6, ERROR_MESSAGES.CODE_INVALID)
  .max(6, ERROR_MESSAGES.CODE_INVALID)
  .refine(isCodeExists, ERROR_MESSAGES.CODE_INVALID);

type ActionState =
  | { code: true; error?: { formErrors: string[] } }
  | { code: false; error?: { fieldErrors: string[] } };

export async function createAccount(prevState: any, formData: FormData) {
  const __ = typeof PASSWORD_REGEXP; // assigned to keep the import

  if (!prevState.code) {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      username: formData.get("username"),
    };

    const result = await formSchema.spa(data); // spa stands for safeParseAsync
    if (!result.success) {
      return { code: false, error: z.flattenError(result.error) };
    } else {
      // hash password
      const hasedPassword = await bcrypt.hash(
        result.data.password,
        HASH_ROUNDS,
      );

      const transaction = await db.$transaction(async (tx) => {
        // save the user to db
        const user = await tx.user.create({
          data: {
            email: result.data.email,
            username: result.data.username,
            password: hasedPassword,
          },
          select: {
            id: true,
          },
        });

        // create email verification code
        const code = await tx.emailCode.create({
          data: {
            email: result.data.email,
            code: await createCode(result.data.email),
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            userId: user.id,
          },
          select: {
            code: true,
          },
        });
        console.log(code.code);

        await savePendingEmail(result.data.email);

        return code;
      });

      if (transaction) return { code: true };
      else
        return {
          code: false,
          error: {
            formErrors: {
              username: ["Something went wrong. Try again."],
            },
          },
        };
    }
  } else {
    // email verification
    const code = formData.get("code");

    const result = await codeSchema.spa(code);
    if (!result.success) {
      return {
        code: true,
        error: z.flattenError(result.error),
      };
    }

    const email = await getPendingEmail();
    if (!email)
      return {
        code: false,
        error: { formErrors: { username: ["Something went wrong."] } },
      };
    const codeRecord = await db.emailCode.findFirst({
      where: {
        email,
        code: result.data,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 1,
      select: {
        code: true,
        expires_at: true,
        userId: true,
      },
    });

    if (!codeRecord) {
      return {
        code: true,
        error: {
          formErrors: [ERROR_MESSAGES.CODE_INVALID],
        },
      };
    } else if (codeRecord.expires_at <= new Date()) {
      return {
        code: true,
        error: {
          formErrors: [ERROR_MESSAGES.CODE_EXPIRED],
        },
      };
    }

    await db.emailCode.deleteMany({
      where: {
        email,
      },
    });

    const user = await db.user.update({
      where: {
        email,
      },
      data: {
        email_verified: true,
      },
      select: {
        id: true,
      },
    });

    await loginUser(user.id);

    return redirect("/profile");
  }
}
