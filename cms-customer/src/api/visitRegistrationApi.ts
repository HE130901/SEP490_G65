// src/api/VisitRegistrationAPI.ts
import axiosInstance from "@/api/axios-config";

const VisitRegistrationAPI = {
  getByCustomerId(customerId: string) {
    const url = `/api/VisitRegistrations/customer/${customerId}`;
    return axiosInstance.get(url);
  },
  update(visitId: number, data: any) {
    const url = `/api/VisitRegistrations/${visitId}`;
    const updateData = {
      visitDate: data.visitDate,
      note: data.note,
      accompanyingPeople: data.accompanyingPeople,
    };
    return axiosInstance.put(url, updateData);
  },
  delete(visitId: number) {
    const url = `/api/VisitRegistrations/${visitId}`;
    return axiosInstance.delete(url);
  },
};

export default VisitRegistrationAPI;