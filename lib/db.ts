import { PrismaClient } from "./generated/prisma";

const db = new PrismaClient();

async function test() {
  const code = await db.sMSCode.create({
    data: {
      code: "1231212123",
      user: {
        connect: {
          id: 1,
        },
      },
    },
  });
  console.log(code);
}

test();
export default db;
