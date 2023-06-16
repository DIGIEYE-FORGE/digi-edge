import { publicProcedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { generateAccessToken, isEmail, isPassword, verifyToken } from '../utils';
import { compareSync } from 'bcryptjs';
import { TRPCError } from '@trpc/server';

export const loginSchema = z.object({
	email: isEmail(),
	password: isPassword(),
});

export const logoutSchema = z.object({
	accessToken: z.string(),
});


export const verifySchema = z.object({
	accessToken: z.string(),
});

const authRouter = router({
	login: publicProcedure
		.input(loginSchema)
		.mutation(async (opts) => {

			const { email, password } = loginSchema.parse(opts.input);

			const user = await prisma.user.findUnique({ where: { email } });

			if (!user || !compareSync(password, user.password))
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid email or password',
				})

			const accessToken = generateAccessToken({ id: user.id, });
			await prisma.user.update({ where: { id: user.id }, data: { accessToken } });
			return { accessToken };
		}),

	logout: publicProcedure
		.input(logoutSchema)
		.mutation(async (opts) => {
			const { accessToken } = logoutSchema.parse(opts.input);
			const { id } = await verifyToken(accessToken);
			await prisma.user.update({ where: { id }, data: { accessToken: null } });
			return { success: true };
		}),

	verify: publicProcedure
		.input(verifySchema)
		.mutation(async (opts) => {
			const { accessToken } = opts.input;
			const { id } = await verifyToken(accessToken);
			const user = await prisma.user.findUnique({ where: { id } });
			if (!user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid access token',
				})
			}
			return user;
		})
});



export default authRouter;

