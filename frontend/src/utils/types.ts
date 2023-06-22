export type State = "idle" | "loading" | "error";

export type Device = {
  id?: number;
  name: string;
  serial: string;
  isPassive: boolean;
  isDecoded: boolean;
  blacklisted: boolean;
  createdAt?: string;
  updatedAt?: string;
  attributes: Attribute[];
  credential: {
    username: string | null;
    password: string | null;
    isToken: boolean | null;
    [key: string]: any;
  } | null;
  deviceProfileId: number | null;
  mqttServerId: number | null;
  groupId: number | null;
  [key: string]: any;
};

export type Types = {
  id?: number;
  index: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Group = {
  id?: number;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  mqttServerId: number | null;
  [key: string]: any;
};

export type MqttServer = {
  id?: number;
  pid?: number;
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
};

export type Name = {
  id: number;
  name: string;
  credentialsType?: string | null;
  mqttServer?: MqttServer | null;
};

export type Attribute = {
  name: string;
  value: string;
  [key: string]: any;
};

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  role: "ADMIN" | "USER";
  [key: string]: any;
};

export type Tag = {
  id: number;
  value: string;
  [key: string]: any;
};
