import { AppRouter } from "../../../server/src/main";

export type State = "idle" | "loading" | "error";

export type AppContext = {
  secondaryMenu: boolean;
  setSecondaryMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: (data: ConfirmDialogData) => void;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
  loginState: State;
  setLoginState: React.Dispatch<React.SetStateAction<State>>;
  user: User | null;
};

export type ConfirmDialogData = {
  title?: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type Paramstype = {
  page?: number;
  limit?: number;
  where?: any;
  include?: any;
};

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: "admin" | "user";
};

export type Attribute = {
  id?: number;
  name: string;
  value: string;
  deviceId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Devices = {
  id?: number;
  name: string;
  serial: string;
  isPassive?: boolean;
  isDecoder?: boolean;
  blacklisted?: boolean;
  attributes?: Attribute[];
  groupId?: number;
  mqttServerId?: number;
  deviceProfileId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Group = {
  id?: number;
  name: string;
  type: string;
  devices?: Devices[];
  mqttServerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MqttServer = {
  id?: number;
  clientId: number;
  username: string;
  password: string;
  host: string;
  topic: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DeviceType = {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Protocol = {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Decoder = {
  id?: number;
  name: string;
  description: string;
  fnc: string;
  createdAt?: string;
  updatedAt?: string;
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
  deviceType?: DeviceType | null;
  protocol?: Protocol | null;
  decoder?: Decoder | null;
  credentialsType: string | null;
};

export type Device = AppRouter["device"]["findUnique"];
