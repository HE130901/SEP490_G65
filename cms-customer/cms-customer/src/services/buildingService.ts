import axiosInstance from "@/utils/axiosInstance";

const BuildingAPI = {
  getAllData() {
    const url = "/api/Buildings/all";
    return axiosInstance.get(url);
  },
};

export default BuildingAPI;
