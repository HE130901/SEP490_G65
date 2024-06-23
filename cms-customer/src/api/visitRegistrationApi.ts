// src/api/VisitRegistrationAPI.ts
import axiosInstance from "@/api/axios-config";

const VisitRegistrationAPI = {
  getByCustomerId(customerId: string) {
    const url = `/api/VisitRegistrations/customer/${customerId}`;
    return axiosInstance.get(url);
  },
  update(visitId: number, data: any) { // Update visit registration
    const url = `/api/VisitRegistrations/${visitId}`;
    return axiosInstance.put(url, data);
  },
  delete(visitId: number) { // Delete visit registration
    const url = `/api/VisitRegistrations/${visitId}`;
    return axiosInstance.delete(url);
  },
};

export default VisitRegistrationAPI;
