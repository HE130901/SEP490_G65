import axiosInstance from "@/utils/axiosInstance";

const NicheAPI = {
  getAllNicheForCustomer(buildingId: any, floorId: any, areaId: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/nichesForCustomer`;
    return axiosInstance.get(url);
  },
  getAll(buildingId: any, floorId: any, areaId: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`;
    return axiosInstance.get(url);
  },
  get(buildingId: string, floorId: string, areaId: string, nicheId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches/${nicheId}`;
    return axiosInstance.get(url);
  },
  getNichesForCustomer() {
    const url = `/api/Niches/customer`;
    return axiosInstance.get(url);
  },
  getDetail(nicheId: string) {
    const url = `/api/niches/${nicheId}/details`;
    return axiosInstance.get(url);
  },
};

export default NicheAPI;


