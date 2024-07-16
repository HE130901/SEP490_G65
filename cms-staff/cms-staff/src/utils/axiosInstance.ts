// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://cms-server.azurewebsites.net",
    baseURL: "https://localhost:7148",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
