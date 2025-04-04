import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE==="development" ? "http://localhost:5001/api":"/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);
