import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween, isPassword } from '../utils';


export const createSchema = z.object({
	id: z.number().optional(),
	clientId: z.number(),
	username: isBetween(2, 50),
	password: isPassword(),
	host: isBetween(2, 50),
	topic: isBetween(2, 50),
});

export const updateSchema = createSchema.partial();

const mqttServerRouter = router({

	findMany: procedure
		.query(async () => {
			return await prisma.mqttServer.findMany();
		}),

	findUnique: procedure
		.input(z.number())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.mqttServer.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.mqttServer.create({ data: input });
		}),

	createMany: procedure
		.input(z.array(createSchema))
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.mqttServer.createMany({ data: input });
		}),

	update: procedure
		.input(z.object({
			id: z.number(),
			serial: z.string(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id, data } = input;
			return await prisma.mqttServer.update({ where: { id }, data });
		}),

	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.mqttServer.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.mqttServer.deleteMany();
		}),
});


export default mqttServerRouter;

