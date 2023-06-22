import { authProcedure as procedure, router } from "../trpc";
import prisma from "../common/prisma";
import { z } from "zod";
import { isBetween, isPassword } from "../utils";

export const createSchema = z.object({
  id: z.number().optional(),
  index: z.number(),
  name: isBetween(2, 50),
});

export const updateSchema = createSchema.partial();

export const typeRouter = router({
  findMany: procedure.query(async () => {
    return await prisma.type.findMany();
  }),

  findUnique: procedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    return await prisma.type.findUnique({ where: { id: input } });
  }),

  create: procedure.input(createSchema).mutation(async (opts) => {
    const { input } = opts;
    const { id, ...rest } = input;
    return await prisma.type.create({
      data: {
        index: rest.index,
        name: rest.name,
      },
    });
  }),

  update: procedure.input(updateSchema).mutation(async (opts) => {
    const { input } = opts;
    const { id, ...rest } = input;
    return await prisma.type.update({ where: { id }, data: rest });
  }),

  delete: procedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.type.delete({ where: { id: input } });
  }),

  deleteMany: procedure.input(z.array(z.number())).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.type.deleteMany({ where: { id: { in: input } } });
  }),
});
