import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween } from '../utils';



export const createSchema = z.object({
	id: z.number().optional(),
	name: isBetween(2, 50),
	type: isBetween(2, 50),
});

export const updateSchema = createSchema.partial();

const groupRouter = router({

	findMany: procedure
		.query(async () => {
			return await prisma.group.findMany();
		}),

	getNames: procedure
		.query(async () => {
			return await prisma.group.findMany({ select: { id: true, name: true } });
		}),

	findUnique: procedure
		.input(z.number())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.group.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const { input } = opts;
			const group = await prisma.group.create({ data: input });
			return group;

		}),

	createMany: procedure
		.input(z.array(createSchema))
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.group.createMany({ data: input });
		}),

	update: procedure
		.input(z.object({
			id: z.number(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id, data } = input;
			return await prisma.group.update({ where: { id }, data });
		}),

	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.group.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.group.deleteMany();
		}),


});


export default groupRouter;

