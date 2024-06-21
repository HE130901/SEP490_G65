import axiosInstance from "./axios-config";

const AreaAPI = {
  getAll(buildingId: string, floorId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas`;
    return axiosInstance.get(url);
  },
  get(buildingId: string, floorId: string, areaId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}`;
    return axiosInstance.get(url);
  },
  add(buildingId: string, floorId: string, data: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas`;
    return axiosInstance.post(url, data);
  },
  update(buildingId: string, floorId: string, areaId: string, data: any) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}`;
    return axiosInstance.put(url, data);
  },
  remove(buildingId: string, floorId: string, areaId: string) {
    const url = `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}`;
    return axiosInstance.delete(url);
  },
};
export default AreaAPI;
