import axiosInstance from "@/utils/axiosInstance";

const NicheAPI = {
  getAll(buildingId: any, floorId: any, areaId: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`;
    return axiosInstance.get(url);
  },
  get(buildingId: string, floorId: string, areaId: string, nicheId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches/${nicheId}`;
    return axiosInstance.get(url);
  },
  getAllByCustomer(customerId: string) {
    const url = `/api/niches/customer/${customerId}`;
    return axiosInstance.get(url);
  },
  getDetail(nicheId: string) {
    const url = `/api/niches/${nicheId}/details`;
    return axiosInstance.get(url);
  },
};

export default NicheAPI;


