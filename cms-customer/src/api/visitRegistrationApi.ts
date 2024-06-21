import axiosInstance from "@/api/axios-config";

const VisitRegistrationAPI = {
  getByCustomerId(customerId: string) {
    const url = `/api/VisitRegistrations/customer/${customerId}`;
    return axiosInstance.get(url);
  },
  delete(visitId: string) {
    const url = `/api/VisitRegistrations/${visitId}`;
    return axiosInstance.delete(url);
  },
};
export default VisitRegistrationAPI;
