import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween } from '../utils';
import { TRPCError } from '@trpc/server';

export const createSchema = z.object({
	id: z.number().optional(),
	value: isBetween(2, 50),
});

export const updateSchema = createSchema.partial();

const TagRouter = router({
	findMany: procedure.query(async () => {
		return await prisma.tag.findMany();
	}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const { input, ctx } = opts;
			if (ctx.user.role !== "ADMIN") throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not authorized to perform this action." });
			return await prisma.tag.create({
				data: input,
			});
		}
		),

	update: procedure
		.input(z.object({
			id: z.number(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input, ctx } = opts;
			const { id, data } = input;
			if (ctx.user.role !== "ADMIN") throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not authorized to perform this action." });
			return await prisma.tag.update({
				where: { id },
				data,
			});
		}),

	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input, ctx } = opts;
			if (ctx.user.role !== "ADMIN") throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not authorized to perform this action." });
			return await prisma.tag.delete({ where: { id: input } });
		}
		),
});


export default TagRouter;