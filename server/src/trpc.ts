import { TRPCError, initTRPC } from '@trpc/server';
import { Role } from '@prisma/client';
import { verifyToken } from './utils';
import prisma from './common/prisma';
import * as trpcExpress from '@trpc/server/adapters/express';

interface Context {
	req: any;
	res: any;
	user?: {
		id: string;
		role: Role
	};
}

// export const createContext = async (opts: CreateNextContextOptions) => {

// 	return {
// 		req: opts.req,
// 	} as Context;
// };

export const createContext = ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	return {
		req,
		res,
	} as Context;
};

const t = initTRPC.context<typeof createContext>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export const router = t.router;

const isAuthed = middleware(async ({ ctx, next }) => {
	const { req } = ctx;
	const accessToken = req.headers?.authorization?.split(' ')?.[1];
	if (!accessToken) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to do that.' });
	}
	const { id } = await verifyToken(accessToken);
	const user = await prisma.user.findUnique({ where: { id } });
	if (!user) {
		console.log('no user found');

		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to do that.' });
	}

	return next({
		ctx: {
			...ctx,
			user: {
				id: user.id,
				role: user.role
			}
		}
	});
});

const isAdmin = isAuthed.unstable_pipe(async ({ ctx, next }) => {

	if (ctx.user?.role !== 'ADMIN') {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be an admin to do that.' });
	}
	return next({ ctx });
});


export const authProcedure = publicProcedure.use(isAuthed)

export const adminProcedure = publicProcedure.use(isAdmin)