import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween } from '../utils';



export const createSchema = z.object({
	id: z.number().optional(),
	name: isBetween(2, 50),
	fnc: isBetween(2, 50),
	description: isBetween(2, 50),
});

export const updateSchema = createSchema.partial();

const decoderRouter = router({

	findMany: procedure
		.query(async () => {
			return await prisma.decoder.findMany();
		}),

	findUnique: procedure
		.input(z.number())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.decoder.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.decoder.create({ data: input });
		}),

	createMany: procedure
		.input(z.array(createSchema))
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.decoder.createMany({ data: input });
		}),

	update: procedure
		.input(z.object({
			id: z.number(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id, data } = input;
			return await prisma.decoder.update({ where: { id }, data });
		}),

	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.decoder.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.decoder.deleteMany();
		}),


});


export default decoderRouter;

