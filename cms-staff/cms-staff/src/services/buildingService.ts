// services/buildingService.js
import axiosInstance from "@/utils/axiosInstance";

const buildingService = {
  getAllBuildingsFloorsAreas() {
    return axiosInstance.get("/api/Buildings/all");
  },
  getNiches(buildingId, floorId, areaId) {
    return axiosInstance.get(`/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`);
  },
  // Các hàm API khác...
};

export default buildingService;
