// services/serviceService.ts
import axiosInstance from "@/utils/axiosInstance";

const ServiceAPI = {
  getAllServices() {
    return axiosInstance.get("/api/Services");
  },
  updateService(serviceId: any, data: any) {
    return axiosInstance.put(`/api/Services/${serviceId}`, data);
  },
  deleteService(serviceId: any) {
    return axiosInstance.delete(`/api/Services/${serviceId}`);
  },
  addService(data: any) {
    return axiosInstance.post("/api/Services", data);
  },
};

export default ServiceAPI;
