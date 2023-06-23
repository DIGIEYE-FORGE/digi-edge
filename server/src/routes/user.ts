import { adminProcedure as procedure, router } from "../trpc";
import prisma from "../common/prisma";
import { z } from "zod";
import { isBetween, isId } from "../utils";
import * as bcrypt from "bcryptjs";

export const createUserSchema = z.object({
  id: z.number().optional(),
  firstName: isBetween(2, 50),
  lastName: isBetween(2, 50),
  username: isBetween(4, 10),
  password: z.string().min(8),
  avatar: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export const updateUserSchema = createUserSchema.partial();

const userRouter = router({
  findMany: procedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return await prisma.user.findMany({
      where: { id: { not: user.id } },
    });
  }),

  findUnique: procedure.input(isId()).query(async (opts) => {
    const { input } = opts;
    return await prisma.user.findUnique({ where: { id: input } });
  }),

  create: procedure.input(createUserSchema).mutation(async (opts) => {
    const { input } = opts;
    const { id, password, ...rest } = input;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        firstName: rest.firstName,
        lastName: rest.lastName,
        username: rest.username,
        role: rest.role,
        password: hashedPassword,
      },
    });
  }),

  update: procedure
    .input(
      z.object({
        id: isId(),
        data: updateUserSchema,
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { id, data } = input;

      return await prisma.user.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          role: data.role,
          avatar: data.avatar,
        },
      });
    }),

  updatePassword: procedure
    .input(
      z.object({
        id: isId(),
        password: z.string().min(8),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { id, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);

      return await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });
    }),

  delete: procedure.input(isId()).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.user.delete({ where: { id: input } });
  }),

  deleteMany: procedure.mutation(async () => {
    return await prisma.user.deleteMany();
  }),
});

export default userRouter;
