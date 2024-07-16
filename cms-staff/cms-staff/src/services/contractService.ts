import axiosInstance from "@/utils/axiosInstance";

const contractService = {
  async getAllContracts() {
    const response = await axiosInstance.get("/api/ContractForStaff/all-contracts");
    if (response.data && response.data.$values) {
      return response.data.$values;
    }
    throw new Error("Invalid API response format");
  },
  async getContractById(id: number) {
    const response = await axiosInstance.get(`/api/ContractForStaff/contract/${id}`);
    return response.data;
  },
  createContract(contractData: any) {
    return axiosInstance.post("/api/ContractForStaff/create-contract", contractData);
  },
  async getBuildings() {
    const response = await axiosInstance.get("/api/Buildings/all");
    if (response.data && response.data.buildings && response.data.buildings.$values) {
      return response.data.buildings.$values;
    }
    throw new Error("Invalid API response format");
  },
  async getNiches(buildingId: number, floorId: number, areaId: number) {
    const response = await axiosInstance.get(`/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`);
    return response.data;
  }
};

export default contractService;
