import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween } from '../utils';

export const createSchema = z.object({
	id: z.number().optional(),
	name: isBetween(2, 50),
	description: z.string().optional(),
	decoderId: z.number().optional(),
	protocolId: z.number().optional(),
	deviceTypeId: z.number().optional(),
	credentialsType: z.string().optional(),
	attributes: z.record(z.string()).optional(),
});

export const updateSchema = createSchema.partial();


const deviceProfileRouter = router({

	findMany: procedure
		.input(z.object({
			take: z.number().optional(),
			skip: z.number().optional(),
		}).optional())
		.query(async () => {
			return await prisma.deviceProfile.findMany({
				include: {
					deviceType: true,
					decoder: true,
					attributes: true,
					protocol: true,

				},
			});
		}),

	findUnique: procedure
		.input(z.number())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.deviceProfile.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const {
				attributes,
				...rest
			} = opts.input;
			return await prisma.deviceProfile.create({
				data: {
					attributes: attributes && {
						createMany: {
							data: Object.entries(attributes).map(([key, value]) => ({
								name: key,
								value,
							}))
						}
					},
					...rest,
				}
			});
		}),

	// createMany: procedure
	// 	.input(z.array(createSchema))
	// 	.mutation(async (opts) => {
	// 		const { input } = opts;
	// 		return await prisma.deviceProfile.createMany({ data: input });
	// 	}),

	update: procedure
		.input(z.object({
			id: z.number(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id, data } = input;
			const { attributes, ...rest } = data;
			return await prisma.deviceProfile.update({
				where: { id }, data: {
					attributes: attributes && {
						upsert: Object.entries(attributes).map(([key, value]) => ({
							where: { deviceProfileId_name: { deviceProfileId: id, name: key } },
							create: {
								name: key,
								value,
							},
							update: {
								value,
							}
						}))
					},
					...rest,
				}
			});
		}),

	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.deviceProfile.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.deviceProfile.deleteMany();
		}),


});


export default deviceProfileRouter;

