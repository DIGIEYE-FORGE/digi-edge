import axios from "axios";
import { Decoder, Paramstype } from "../../utils/types";

export const getDecoders = async (
  params: Paramstype = {}
): Promise<{ totalResult: number; results: Decoder[] }> => {
  const { page = 1, limit = 20, where, include } = params;
  const res = await axios.get("/decoders", {
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

export const addDecoder = async (data: Decoder | null): Promise<Decoder> => {
  const res = await axios.post("/decoders", data);
  return res.data;
};
