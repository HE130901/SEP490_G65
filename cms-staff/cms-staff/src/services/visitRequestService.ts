import axiosInstance from "@/utils/axiosInstance";

const VisitRequestAPI = {
  getAllVisitRequests() {
    return axiosInstance.get("/api/VisitRegistrations");
  },
  // Các phương thức khác như addVisitRequest, updateVisitRequest, deleteVisitRequest có thể được thêm ở đây
};

export default VisitRequestAPI;
