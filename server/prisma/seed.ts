import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function initUser() {

	await prisma.user.deleteMany();
	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash("iseljao@gmail.com", salt);
	await prisma.user.create({
		data: {
			firstName: "Isel",
			lastName: "Jao",
			email: "iseljao@gmail.com",
			password,
		}
	});
}

async function main() {
	await initUser();
	const users = await prisma.user.findMany();
	console.log({ users });

}


main().catch((e) => {
	console.error(e);
	process.exit(1);
}).finally(async () => {
	await prisma.$disconnect();
})