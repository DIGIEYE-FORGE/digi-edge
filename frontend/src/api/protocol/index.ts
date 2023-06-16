import axios from "axios";
import { Protocol, Paramstype } from "../../utils/types";

export const getProtocols = async (
  params: Paramstype = {}
): Promise<{ totalResult: number; results: Protocol[] }> => {
  const { page = 1, limit = 20, where, include } = params;
  const res = await axios.get("/protocols", {
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

export const addProtocol = async (data: Protocol | null): Promise<Protocol> => {
  const res = await axios.post("/protocols", data);
  return res.data;
};
