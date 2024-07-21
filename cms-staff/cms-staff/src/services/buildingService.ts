// services/buildingService.js
import axiosInstance from "@/utils/axiosInstance";

const buildingService = {
  getAllBuildingsFloorsAreas() {
    return axiosInstance.get("/api/Buildings/all");
  },
  getNiches(buildingId: any, floorId: any, areaId: any) {
    return axiosInstance.get(`/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`);
  },
};
export default buildingService;
