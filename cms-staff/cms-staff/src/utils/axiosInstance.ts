// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "https://cms-server.azurewebsites.net",
  //baseURL: "https://localhost:7148",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
