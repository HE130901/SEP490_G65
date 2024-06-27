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
  add(buildingId: string, floorId: string, areaId: string, data: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`;
    return axiosInstance.post(url, data);
  },
  update(
    buildingId: string,
    floorId: string,
    areaId: string,
    nicheId: string,
    data: any
  ) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches/${nicheId}`;
    return axiosInstance.put(url, data);
  },
  remove(buildingId: string, floorId: string, areaId: string, nicheId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches/${nicheId}`;
    return axiosInstance.delete(url);
  },
};
export default NicheAPI;
