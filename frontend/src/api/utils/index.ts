import axios from "axios";

export const getStats = async () => {
  const res = await axios.get("/utils/stats");

  return res.data;
};
