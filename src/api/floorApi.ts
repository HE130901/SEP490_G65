import axiosInstance from "@/api/axios-config";

const FloorAPI = {
  getAll(buildingId: string) {
    const url = `/api/Buildings/${buildingId}/floors`;
    return axiosInstance.get(url);
  },
  get(buildingId: string, floorId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}`;
    return axiosInstance.get(url);
  },
  add(buildingId: string, data: any) {
    const url = `/api/Buildings/${buildingId}/floors`;
    return axiosInstance.post(url, data);
  },
  update(buildingId: string, floorId: string, data: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}`;
    return axiosInstance.put(url, data);
  },
  remove(buildingId: string, floorId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}`;
    return axiosInstance.delete(url);
  },
};
export default FloorAPI;
