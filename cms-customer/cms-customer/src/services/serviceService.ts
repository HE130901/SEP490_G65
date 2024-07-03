import axiosInstance from "@/utils/axiosInstance";

const ServiceAPI = {
  getAllServices() {
    return axiosInstance.get("/api/Services");
  },
};

export default ServiceAPI;
