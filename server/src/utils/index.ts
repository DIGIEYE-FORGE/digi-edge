import { z } from 'zod';
import jwt from 'jsonwebtoken';
import env from "../common/env"
import { genSalt, hash } from 'bcryptjs';
import redis from '../common/redis';
import { TRPCError } from '@trpc/server';

export const isMin = (min: number) => z.string().min(min, {
	message: `Must be at least ${min} characters long`,
});

export const isMax = (max: number) => z.string().max(max, {
	message: `Must be at most ${max} characters long`,
});

export const isBetween = (min: number, max: number) => z.string().min(min, {
	message: `Must be at least ${min} characters long`,
}).max(max, {
	message: `Must be at most ${max} characters long`,
});


export const isId = () => z.number().int({
	message: 'Must be an integer',
}).positive({
	message: 'Must be a positive integer',
})

export const isEmail = () => z.string()
// 8 chars with lower and upper case letters, numbers and special chars
export const isPassword = () => z.string()

// string or number ... and not null
export async function hashPassword(password: string) {
	const saltRounds = 10;
	const salt = await genSalt(saltRounds);
	const hashedPassword = await hash(password, salt);
	return hashedPassword;
}

export function generateAccessToken({ id }: { id: number }) {
	return jwt.sign({ id }, env.JWT_SECRET, {
		expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
	});
}

export function generateRefreshToken(user: { id: number }) {
	const { id } = user;
	return jwt.sign({ id }, env.JWT_SECRET, {
		expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
	});
}


export async function verifyToken(token: string) {
	const isBlacklisted = await redis.get(token);
	if (isBlacklisted) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Invalid refresh token',
		})
	}
	console.log('token', token);
	try {
		return jwt.verify(token, env.JWT_SECRET) as DecodedToken;
	}
	catch {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Invalid refresh token',
		})
	}
}

export type DecodedToken = {
	id: number;
	exp?: number;
	iat?: number;
};
