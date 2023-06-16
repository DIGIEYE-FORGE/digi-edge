import { AppRouter } from "../../../server/src/main";

export type State = "idle" | "loading" | "error";


export type Group = {
	id?: number;
	name: string;
	type: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
};

export type MqttServer = {
	id?: number;
	clientId: number;
	username: string;
	password: string;
	host: string;
	topic: string;
};

export type DeviceType = {
	id?: number;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
};

export type Protocol = {
	id?: number;
	name: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
};

export type Decoder = {
	id?: number;
	name: string;
	description: string;
	fnc: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
};


export type DeviceProfile = {
	id?: number;
	name: string;
	description: string | null;
	decoderId: number | null;
	deviceTypeId: number | null;
	protocolId: number | null;
	createdAt?: string;
	updatedAt?: string;
	deviceType: DeviceType | null;
	protocol: Protocol | null;
	decoder: Decoder | null;
	credentialsType: string | null;
	[key: string]: any;

}

export type Name = {
	id: number;
	name: string;
}


// export const createSchema = z.object({
// 	id: z.number().optional(),
// 	name: isBetween(2, 50),
// 	serial: isBetween(2, 50),
// 	isPassive: z.boolean().optional(),
// 	isDecoded: z.boolean().optional(),
// 	attributes: z.record(z.string()).optional(),
// 	deviceProfileId: z.number().optional(),
// 	mqttServerId: z.number().optional(),
// 	groupId: z.number().optional(),
// });

export type Device = {
	id?: number;
	name: string;
	serial: string;
	deviceProfileId: number | null;
	devicePofile: Name | null;
	groupId: number | null;
	group: Name | null;
	isPassive: boolean;
	isDecoded: boolean;
	[key: string]: any;
	createdAt?: string;
	updatedAt?: string;
}


















