import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("token");

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    config.headers["Authorization"] = `${accessToken}`;

    return config;
  },
  (err) => {
    return Promise.reject(parseError(err));
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (err) => {
    return Promise.reject(parseError(err));
  }
);

export default api;
