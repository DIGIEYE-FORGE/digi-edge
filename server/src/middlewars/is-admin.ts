import { TRPCError } from "@trpc/server";
import isAuthed from "./is-authed";

const isAdmin = isAuthed.unstable_pipe(async ({ ctx, next }) => {

	if (ctx.user?.role !== 'ADMIN') {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be an admin to do that.' });
	}
	return next({ ctx });
});

export default isAdmin;