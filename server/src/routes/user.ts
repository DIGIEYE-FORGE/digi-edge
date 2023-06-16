import { adminProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween, isEmail, isId } from '../utils';
import bcrypt from 'bcryptjs';



export const createUserSchema = z.object({
	id: z.number().optional(),
	firstName: isBetween(2, 50),
	lastName: isBetween(2, 50),
	email: isEmail(),
	password: z.string().min(8),
	role: z.enum(['ADMIN', 'USER']).optional(),
});

export const updateUserSchema = createUserSchema.partial();

const userRouter = router({

	findMany: procedure
		.query(async () => {
			return await prisma.user.findMany();
		}),

	findUnique: procedure
		.input(isId())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.user.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createUserSchema)
		.mutation(async (opts) => {
			const { input } = opts;
			const { password, ...rest } = input;
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			return await prisma.user.create({
				data: {
					...rest,
					password: hashedPassword,
				}
			});
		}),

	update: procedure
		.input(z.object({
			id: isId(),
			data: updateUserSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id, data } = input;
			return await prisma.user.update({ where: { id }, data });
		}),

	delete: procedure
		.input(isId())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.user.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.user.deleteMany();
		}),


},);



export default userRouter;

