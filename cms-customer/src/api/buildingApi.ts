import axiosInstance from "@/api/axios-config";

const BuildingAPI = {
  getAllData() {
    const url = "/api/Buildings/all";
    return axiosInstance.get(url);
  },
};

export default BuildingAPI;
