/**
 * Created by Zura on 12/25/2021.
 */
import axios from "axios";
import store from "./store";
import router from "./router/index.js";

console.log(
  "import.meta.env.VITE_API_BASE_URL",
  import.meta.env.VITE_API_BASE_URL
);

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Fallback to /api for Vite proxy
});

axiosClient.interceptors.request.use((config) => {
  console.log("Request config:", config);
  // Only add Authorization header if token exists
  const token = store.state.user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    if (error.response && error.response.status === 401) {
      store.commit("setToken", null);
      router.push({ name: "login" });
    }
    throw error;
  }
);

export default axiosClient;
