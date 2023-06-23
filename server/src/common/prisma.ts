import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();


prisma.$use(async (params, next) => {
	// Manipulate params here
	try {

		const result = await next(params)
		return result
	}
	catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2002': {
					throw new TRPCError({
						code: 'CONFLICT',
						message: `Unique constraint failed on the ${err.meta?.target}`
					})
				}

				default: {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: `Something went wrong: ${err.code}`
					})
				}
			}
		}
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Something went wrong',
		})
	}
})

// See results here
// prisma interceptor
export default prisma;