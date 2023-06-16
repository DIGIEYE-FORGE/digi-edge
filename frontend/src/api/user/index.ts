import axios from "axios";

export const signIn = async (data: { username: string; password: string }) => {
  const res = await axios.post("/auth/sign-in", {
    ...data,
  });

  return res.data;
};

export const signOut = async () => {
  const res = await axios.get("/auth/sign-out");

  return res.data;
};

export const currentUser = async () => {
  try {
    const res = await axios.get("/auth/current-user");

    return res.data;
  } catch (error) {
    return null;
  }
};
