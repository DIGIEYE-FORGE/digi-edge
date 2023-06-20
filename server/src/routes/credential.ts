import { z } from "zod";
import { authProcedure as procedure, router } from "../trpc";
import { isBetween } from "../utils";
import prisma from "../common/prisma";

export const createSchema = z.object({
  id: z.number().optional(),
  username: isBetween(2, 50),
  password: isBetween(2, 50),
  isToken: z.boolean().optional(),
  deviceId: z.number().optional(),
});

export const updateSchema = createSchema.partial();

const credentialRouter = router({
  findMany: procedure.query(async () => {
    return await prisma.credential.findMany({
      include: {
        device: true,
      },
    });
  }),

  findUnique: procedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    return await prisma.credential.findUnique({
      where: { id: input },
      include: {
        device: true,
      },
    });
  }),

  create: procedure.input(createSchema).mutation(async (opts) => {
    return await prisma.credential.create({
      data: {
        ...opts.input,
      },
    });
  }),

  update: procedure.input(updateSchema).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.credential.update({
      where: { id: input.id },
      data: {
        ...input,
      },
    });
  }),

  delete: procedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.credential.delete({
      where: { id: input },
    });
  }),
});
