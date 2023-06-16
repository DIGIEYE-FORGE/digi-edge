import { publicProcedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { DecodedToken, generateAccessToken, generateRefreshToken, isEmail, isPassword, verifyToken } from '../utils';
import { compareSync } from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import redis from '../common/redis';
import jwt from 'jsonwebtoken';

export const loginSchema = z.object({
	email: isEmail(),
	password: isPassword(),
});

export const logoutSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
});

export const refreshSchema = z.object({
	refreshToken: z.string(),
});

export const verifySchema = z.object({
	accessToken: z.string(),
});

const authRouter = router({
	login: publicProcedure
		.input(loginSchema)
		.mutation(async (opts) => {

			const { email, password } = loginSchema.parse(opts.input);
			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});
			console.log({ user });

			if (!user || !compareSync(password, user.password)) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid email or password',
				})
			}
			const accessToken = generateAccessToken({ id: user.id, });
			const refreshToken = generateRefreshToken({ id: user.id });
			return { accessToken, refreshToken };
		}),

	logout: publicProcedure
		.input(logoutSchema)
		.mutation(async (opts) => {
			const { accessToken, refreshToken } = logoutSchema.parse(opts.input);
			const decodedTokens = {
				accessToken: jwt.decode(accessToken) as DecodedToken,
				refreshToken: jwt.decode(refreshToken) as DecodedToken,
			};
			redis.set(accessToken, "logged out", {
				EXAT: decodedTokens.accessToken.exp,
			});
			redis.set(refreshToken, "logged out", {
				EXAT: decodedTokens.refreshToken.exp,
			});

			return { success: true };
		}),

	refreshtoken: publicProcedure
		.input(refreshSchema)
		.mutation(async (opts) => {
			const { refreshToken } = opts.input;
			const decodedToken = await verifyToken(refreshToken);
			if (!decodedToken) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid refresh token',
				})
			}
			const user = await prisma.user.findUnique({
				where: { id: decodedToken.id }
			});
			if (!user) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid refresh token',
				})
			}
			const accessToken = generateAccessToken({ id: user.id, });
			return { accessToken };
		}),

	verify: publicProcedure
		.input(verifySchema)
		.mutation(async (opts) => {
			const { accessToken } = opts.input;
			const decodedToken = await verifyToken(accessToken);
			if (!decodedToken) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid access token',
				})
			}
			const user = await prisma.user.findUnique({
				where: { id: decodedToken.id }
			});
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

