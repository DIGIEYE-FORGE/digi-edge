import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


prisma.$use(async (params, next) => {
	// Manipulate params here
	const result = await next(params)
	// See results here
	return result
})
// prisma interceptor
export default prisma;