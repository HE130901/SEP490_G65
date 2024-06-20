import axiosInstance from "@/api/axios-config";

const BuildingAPI = {
  getAll() {
    const url = "/api/Buildings";
    return axiosInstance.get(url);
  },
  get(id: string) {
    const url = `/api/Buildings/${id}`;
    return axiosInstance.get(url);
  },
  add(data: any) {
    const url = "/api/Buildings";
    return axiosInstance.post(url, data);
  },
  update(data: any) {
    const url = `/api/Buildings/${data.id}`;
    return axiosInstance.put(url, data);
  },
  remove(id: string) {
    const url = `/api/Buildings/${id}`;
    return axiosInstance.delete(url);
  },
};
export default BuildingAPI;
