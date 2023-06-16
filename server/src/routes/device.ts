import { authProcedure as procedure, router } from '../trpc';
import prisma from '../common/prisma';
import { z } from 'zod';
import { isBetween } from '../utils';
import { TRPCError } from '@trpc/server';

// model Device {
//   id          Int @id @default (autoincrement())
//   name        String
//   serial      String @unique
//   isPassive   Boolean @default (false) @map("is_passive")
//   isDecode   Boolean @default (false) @map("is_decoder")
//   blacklisted Boolean @default (false)

//   attributes      Attribute[]
//   lastTelemetries LastTelemetry[]
//   history         History[]
//   tags            Tag[]
//   credential      Credential ? @relation(fields: [credentialId], references: [id])
//   credentialId    Int ? @unique @map("credential_id")
//   VirtualDevice   VirtualDevice ? @relation(fields: [virtualDeviceId], references: [id])
//   virtualDeviceId Int ? @map("virtual_device_id")
//   group           Group ? @relation(fields: [groupId], references: [id])
//   groupId         Int ? @map("group_id")
//   deviceProfile   DeviceProfile ? @relation(fields: [deviceProfileId], references: [id])
//   deviceProfileId Int ? @map("device_profile_id")
//   mqttServer      MqttServer ? @relation(fields: [mqttServerId], references: [id])
//   mqttServerId    Int ? @map("mqtt_server_id")

//   createdAt DateTime @default (now()) @map("created_at")
//   updatedAt DateTime @updatedAt @map("updated_at")

// 	@@map("devices")
// }


export const createSchema = z.object({
	id: z.number().optional(),
	name: isBetween(2, 50),
	serial: isBetween(2, 50),
	isPassive: z.boolean().optional(),
	isDecoded: z.boolean().optional(),
	attributes: z.record(z.string()).optional(),
	deviceProfileId: z.number().optional(),
	mqttServerId: z.number().optional(),
	groupId: z.number().optional(),
});

export const updateSchema = createSchema.partial();

const deviceRouter = router({

	findMany: procedure
		.query(async () => {
			return await prisma.device.findMany({
				include: {
					deviceProfile: { select: { id: true, name: true, } },
					group: { select: { id: true, name: true, } },
					mqttServer: { select: { id: true, username: true } },
					attributes: { select: { name: true, value: true } },
					credential: { select: { id: true, username: true, isToken: true, password: true } },
				}
			});
		}),

	findUnique: procedure
		.input(z.number())
		.query(async (opts) => {
			const { input } = opts;
			return await prisma.device.findUnique({ where: { id: input } });
		}),

	create: procedure
		.input(createSchema)
		.mutation(async (opts) => {
			const {
				attributes,
				...rest
			} = opts.input
			return await prisma.device.create({
				data: {
					...rest,
					attributes: attributes && {
						createMany: {
							data: Object.entries(attributes).map(([key, value]) => ({
								name: key,
								value,
							}))
						}
					},
				}
			});
		}),


	update: procedure
		.input(z.object({
			id: z.number(),
			data: updateSchema,
		}))
		.mutation(async (opts) => {
			const { input } = opts;
			const { id } = input;
			const { attributes, ...rest } = input.data;
			const device = await prisma.device.findUnique({ where: { id } });
			if (!device) throw new TRPCError({ code: 'NOT_FOUND', message: 'Device not found' });
			return await prisma.device.update({
				where: { id }, data: {
					...rest,
					attributes: attributes && {
						upsert: Object.entries(attributes).map(([key, value]) => ({
							where: { deviceId_name: { deviceId: id, name: key } },
							update: { value },
							create: { deviceId: id, name: key, value },
						}))
					},
				}
			});
		}),


	delete: procedure
		.input(z.number())
		.mutation(async (opts) => {
			const { input } = opts;
			return await prisma.device.delete({ where: { id: input } });
		}),

	deleteMany: procedure
		.mutation(async () => {
			return await prisma.device.deleteMany();
		}),


});


export default deviceRouter;

