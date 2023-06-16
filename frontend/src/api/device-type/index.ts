import axios from "axios";
import { DeviceType, Paramstype } from "../../utils/types";

export const getDeviceTypes = async (
  params: Paramstype = {}
): Promise<{ totalResult: number; results: DeviceType[] }> => {
  const { page = 1, limit = 20, where, include } = params;
  const res = await axios.get("/device-types", {
    params: {
      take: limit,
      skip: (page - 1) * limit,
      where: where ? JSON.stringify(where) : undefined,
      include: include ? JSON.stringify(include) : undefined,
    },
  });
  console.log({ res });

  return res.data;
};

export const addDeviceType = async (
  data: DeviceType | null
): Promise<DeviceType> => {
  const res = await axios.post("/device-types", data);
  return res.data;
};
