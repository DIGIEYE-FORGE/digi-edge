import axios from "axios";
import { MqttServer, Paramstype } from "../../utils/types";

export const getMqttServers = async (
  params: Paramstype = {}
): Promise<{
  totalResult: number;
  results: MqttServer[];
}> => {
  const { page = 1, limit = 20, where, include } = params;
  const response = await axios.get("/mqtt-servers", {
    params: {
      take: limit,
      skip: (page - 1) * limit,
      where: where ? JSON.stringify(where) : undefined,
      include: include ? JSON.stringify(include) : undefined,
    },
  });
  return response.data;
};

export const addMqttServer = async (data: MqttServer): Promise<MqttServer> => {
  const res = await axios.post("/mqtt-servers", data);
  return res.data;
};

export const updateMqttServer = async (
  id: any,
  data: MqttServer
): Promise<MqttServer> => {
  const res = await axios.patch(`/mqtt-servers/${id}`, data);
  return res.data;
};

export const deleteMqttServer = async (id: number): Promise<void> => {
  const res = await axios.delete(`/mqtt-servers/${id}`);
  return res.data;
};
