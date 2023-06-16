import axios from "axios";
import { Devices, Paramstype } from "../../utils/types";

export const getDevices = async (
  params: Paramstype = {}
): Promise<{ totalResult: number; results: Devices[] }> => {
  const { page = 1, limit = 20, where, include } = params;
  const res = await axios.get("/devices", {
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

export const addDevice = async (data: Devices): Promise<Devices> => {
  if (data && data.attributes && data.attributes.length > 0) {
    data.attributes.forEach((attr) => {
      delete attr.id;
      delete attr.deviceId;
    });
  }

  const res = await axios.post("/devices", data);
  return res.data;
};

export const updateDevice = async (
  id: any,
  data: Devices
): Promise<Devices> => {
  if (data && data.attributes && data.attributes.length > 0) {
    data.attributes.forEach((attr) => {
      delete attr.id;
      delete attr.deviceId;
    });
  }

  const res = await axios.patch(`/devices/${id}`, data);
  return res.data;
};

export const deleteDevice = async (id: any): Promise<Devices> => {
  const res = await axios.delete(`/devices/${id}`);
  return res.data;
};
