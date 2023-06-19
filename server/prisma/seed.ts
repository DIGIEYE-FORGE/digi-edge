import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function initUser() {
  await prisma.user.deleteMany();
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("test1234", salt);
  await prisma.user.create({
    data: {
      firstName: "test",
      lastName: "test",
      username: "test",
      role: "ADMIN",
      password,
    },
  });
}

async function main() {
  await initUser();
  const users = await prisma.user.findMany();
  console.log({ users });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
