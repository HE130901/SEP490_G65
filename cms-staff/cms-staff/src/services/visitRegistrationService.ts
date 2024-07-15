import axiosInstance from "@/utils/axiosInstance";

const VisitRegistrationAPI = {
  getAllVisitRegistrations() {
    return axiosInstance.get("/api/VisitRegistrations");
  },
};

export default VisitRegistrationAPI;
