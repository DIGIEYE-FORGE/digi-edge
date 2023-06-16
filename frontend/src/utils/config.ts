import axios from "axios";

axios.defaults.baseURL = `http://${window.location.hostname}:3000/api`;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        const res = await axios.get("/auth/refresh", {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              window.localStorage.getItem("refreshToken") || "{}"
            )}`,
          },
        });
        window.localStorage.setItem(
          "accessToken",
          JSON.stringify(res.data.accessToken)
        );
        window.localStorage.setItem(
          "refreshToken",
          JSON.stringify(res.data.refreshToken)
        );
      } catch (error: any) {
        if (error?.response?.status) {
          window.localStorage.setItem("accessToken", "");
          window.localStorage.setItem("refreshToken", "");
        }
      }
    }
    return Promise.reject(error);
  }
);
