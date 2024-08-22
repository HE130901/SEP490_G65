// services/serviceService.ts
import axiosInstance from "@/utils/axiosInstance";

const ServiceAPI = {
  getAllServices() {
    return axiosInstance.get("/api/Services");
  },
  updateService(serviceId: any, data: any) {
    return axiosInstance.put(`/api/Services/${serviceId}`, data);
  },

  addService(data: any) {
    return axiosInstance.post("/api/Services", data);
  },
};

export default ServiceAPI;
