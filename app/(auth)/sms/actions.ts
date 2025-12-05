"use server";

import { ERROR_MESSAGES } from "@/lib/constants";
import db from "@/lib/db";
import { loginUser } from "@/lib/session";
import crypto from "crypto";
import { redirect } from "next/navigation";
import twilio from "twilio";
import {
  names,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
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

async function isCodeExists(code: number) {
  const isExists = await db.sMSCode.findFirst({
    where: {
      code: code.toString(),
    },
    select: {
      id: true,
    },
  });

  return Boolean(isExists);
}

const codeSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(isCodeExists, ERROR_MESSAGES.CODE_INVALID);

interface ActionState {
  code: boolean;
}

async function createCode(phone: string) {
  // code generation
  let code: string;
  while (true) {
    code = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSCode.findUnique({
      where: { code_phone: { code, phone } },
    });
    if (!exists) break;
  }
  return code;
}

function generateRandomName() {
  const numberDict = NumberDictionary.generate({ length: 3 });
  const name = uniqueNamesGenerator({
    dictionaries: [names, numberDict],
    length: 2,
    separator: "_",
    style: "capital",
  });
  return name;
}

export default async function smsLogin(
  prevState: ActionState,
  formData: FormData,
) {
  const phone = formData.get("phone")!;
  const code = formData.get("code");

  if (!prevState.code) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        code: false,
        error: z.flattenError(result.error),
      };
    } else {
      db.$transaction(async (tx) => {
        // delete previous code
        await db.sMSCode.deleteMany({
          where: {
            user: {
              phone: result.data,
            },
          },
        });

        // create code
        const code = await createCode(result.data);
        await db.sMSCode.create({
          data: {
            code,
            phone: result.data,
            expires_at: new Date(Date.now() + 3 * 60 * 1000),
            user: {
              connectOrCreate: {
                where: {
                  phone: result.data,
                },
                create: {
                  username: generateRandomName(),
                  phone: result.data,
                },
              },
            },
          },
        });
      });

      // send the code to the user using twilio
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

      const message = await client.messages.create({
        body: `Karrot Market verification code: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.TWILIO_TO_PHONE_NUMBER!,
      });

      console.log(message);

      return {
        code: true,
      };
    }
  } else {
    const result = await codeSchema.spa(code);
    if (!result.success) {
      return {
        code: true,
        error: z.flattenError(result.error),
      };
    } else {
      // get the userId of code
      const codeRecord = await db.sMSCode.findUnique({
        where: {
          code_phone: {
            code: result.data.toString(),
            phone: phone.toString(),
          },
        },
        select: {
          id: true,
          userId: true,
          expires_at: true,
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

      await db.sMSCode.delete({
        where: {
          id: codeRecord.id,
        },
      });

      // log the user in
      await loginUser(codeRecord.userId);

      // redirect user
      return redirect("/profile");
    }
  }
}
