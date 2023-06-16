import axios from "axios";
import { DeviceProfile, Paramstype } from "../../utils/types";

export const getDeviceProfiles = async (
  params: Paramstype = {}
): Promise<{ totalResult: number; results: DeviceProfile[] }> => {
  const { page = 1, limit = 20, where, include } = params;
  const res = await axios.get("/device-profiles", {
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

export const deleteDeviceProfile = async (id: number): Promise<void> => {
  const res = await axios.delete(`/device-profiles/${id}`);
  return res.data;
};

export const addDeviceProfile = async (
  data: DeviceProfile | null
): Promise<DeviceProfile> => {
  const res = await axios.post("/device-profiles", data);
  return res.data;
};

export const updateDeviceProfile = async (
  id: any,
  data: DeviceProfile | null
): Promise<DeviceProfile> => {
  const res = await axios.patch(`/device-profiles/${id}`, data);
  return res.data;
};
