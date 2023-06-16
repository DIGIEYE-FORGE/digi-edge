import axios from "axios";
import { Group, Paramstype } from "../../utils/types";

export const getGroups = async (
  params: Paramstype = {}
): Promise<{
  totalResult: number;
  results: Group[];
}> => {
  const { page = 1, limit = 20, where, include } = params;
  const response = await axios.get("/groups", {
    params: {
      take: limit,
      skip: (page - 1) * limit,
      where: where ? JSON.stringify(where) : undefined,
      include: include ? JSON.stringify(include) : undefined,
    },
  });
  return response.data;
};

export const addGroup = async (data: Group): Promise<Group> => {
  const res = await axios.post("/groups", data);
  return res.data;
};

export const updateGroup = async (id: any, data: Group): Promise<Group> => {
  const res = await axios.patch(`/groups/${id}`, data);
  return res.data;
};

export const deleteGroup = async (id: any): Promise<Group> => {
  const res = await axios.delete(`/groups/${id}`);
  return res.data;
};
