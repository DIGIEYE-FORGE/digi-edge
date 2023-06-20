import { authProcedure as procedure, router } from "../trpc";
import prisma from "../common/prisma";
import { z } from "zod";
import { isBetween } from "../utils";
import { TRPCError } from "@trpc/server";

export const createSchema = z.object({
  // id: z.number().optional(),
  name: isBetween(2, 50),
  serial: isBetween(2, 50),
  isPassive: z.boolean().optional(),
  isDecoded: z.boolean().optional(),
  blacklisted: z.boolean().optional(),
  credential: z
    .object({
      username: isBetween(4, 20),
      password: isBetween(8, 50).optional(),
      isToken: z.boolean().default(false),
    })
    .optional(),
  attributes: z.record(z.string()).optional(),
  deviceProfileId: z.number().optional(),
  mqttServerId: z.number().optional(),
  groupId: z.number().optional(),
});

export const updateSchema = createSchema.partial();

const deviceRouter = router({
  findMany: procedure.query(async () => {
    return await prisma.device.findMany({
      include: {
        deviceProfile: {
          select: { id: true, name: true, credentialsType: true },
        },
        group: { select: { id: true, name: true } },
        mqttServer: true,
        attributes: { select: { name: true, value: true } },
        credential: true,
      },
    });
  }),

  findUnique: procedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    return await prisma.device.findUnique({
      where: { id: input },
      include: {
        deviceProfile: { select: { id: true, name: true } },
        group: { select: { id: true, name: true } },
        mqttServer: { select: { id: true, username: true } },
        attributes: { select: { name: true, value: true } },
        credential: true,
      },
    });
  }),

  create: procedure.input(createSchema).mutation(async (opts) => {
    const {
      attributes,
      credential,
      deviceProfileId,
      groupId,
      mqttServerId,
      ...rest
    } = opts.input;
    // console.log({ credential });

    return await prisma.device.create({
      data: {
        name: rest.name,
        serial: rest.serial,
        isPassive: rest.isPassive,
        isDecoded: rest.isDecoded,
        blacklisted: rest.blacklisted,
        attributes: attributes && {
          create: Object.entries(attributes).map(([key, value]) => ({
            name: key,
            value,
          })),
        },
        credential: credential && {
          create: credential,
        },
        deviceProfile: deviceProfileId
          ? {
              connect: { id: deviceProfileId },
            }
          : undefined,
        group: groupId ? { connect: { id: groupId } } : undefined,
        mqttServer: mqttServerId
          ? { connect: { id: mqttServerId } }
          : undefined,
      },
    });
  }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        data: updateSchema,
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { id } = input;
      const {
        attributes,
        credential,
        deviceProfileId,
        groupId,
        mqttServerId,
        ...rest
      } = input.data;
      const device = await prisma.device.findUnique({ where: { id } });
      await prisma.attribute.deleteMany({ where: { deviceId: id } });
      if (!device)
        throw new TRPCError({ code: "NOT_FOUND", message: "Device not found" });
      return await prisma.device.update({
        where: { id },
        data: {
          ...rest,
          attributes: attributes && {
            create: Object.entries(attributes).map(([key, value]) => ({
              name: key,
              value,
            })),
          },
          credential: credential && {
            update: credential,
          },
          deviceProfile: deviceProfileId
            ? {
                connect: { id: deviceProfileId },
              }
            : undefined,
          group: groupId ? { connect: { id: groupId } } : undefined,
          mqttServer: mqttServerId
            ? { connect: { id: mqttServerId } }
            : undefined,
        },
      });
    }),

  delete: procedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    return await prisma.device.delete({ where: { id: input } });
  }),

  deleteMany: procedure.mutation(async () => {
    return await prisma.device.deleteMany();
  }),
});

export default deviceRouter;
