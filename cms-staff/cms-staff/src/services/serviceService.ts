import axiosInstance from "@/utils/axiosInstance";

const ServiceAPI = {
  getAllServices() {
    return axiosInstance.get("/api/Services");
  },
  updateService(serviceId, data) {
    return axiosInstance.put(`/api/Services/${serviceId}`, data);
  },
  deleteService(serviceId) {
    return axiosInstance.delete(`/api/Services/${serviceId}`);
  },
  addService(data) {
    return axiosInstance.post("/api/Services", data);
  },
};

export default ServiceAPI;
