import axiosInstance from "@/utils/axiosInstance";

const NicheAPI = {
  getAll(buildingId: string, floorId: string, areaId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`;
    return axiosInstance.get(url);
  },
  get(buildingId: string, floorId: string, areaId: string, nicheId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches/${nicheId}`;
    return axiosInstance.get(url);
  },

};
export default NicheAPI;
