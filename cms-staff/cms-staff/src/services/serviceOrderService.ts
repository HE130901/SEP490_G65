import axiosInstance from "@/utils/axiosInstance";

const ServiceOrderAPI = {
  getAllServiceOrders() {
    return axiosInstance.get("/api/ServiceOrderForStaff");
  },
  getServiceOrderDetails(serviceOrderId: number) {
    return axiosInstance.get(`/api/ServiceOrderForStaff/${serviceOrderId}`);
  },
  createServiceOrder(data: any) {
    return axiosInstance.post("/api/ServiceOrderForStaff/create-service-order", data);
  },
  getAllContracts() {
    return axiosInstance.get("/api/ContractForStaff/all-contracts");
  },
  getAllServices() {
    return axiosInstance.get("/api/Services");
  },
  updateCompletionImage(data: { serviceOrderDetailID: number; completionImage: string }) {
    return axiosInstance.put("/api/ServiceOrderForStaff/update-completion-image", data)
      .catch(error => {
        console.error("Error in updateCompletionImage:", error); // Debug log
        throw error;
      });
  },
  addServiceToOrder: (serviceOrderId: any, serviceOrderDetails: any[]) => {
    return axiosInstance.post("/api/ServiceOrderForStaff/add-service-to-order", {
      serviceOrderID: serviceOrderId,
      serviceOrderDetails,
    });
  },
  removeServiceFromOrder: (serviceOrderDetailId: any) => {
    return axiosInstance.delete(
      `/api/ServiceOrderForStaff/remove-service-from-order/${serviceOrderDetailId}`
    );
  },
};

export default ServiceOrderAPI;
