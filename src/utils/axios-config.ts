// src/utils/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7148",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
