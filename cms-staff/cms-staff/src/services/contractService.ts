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
    if (response.data) {
      return response.data;
    }
    throw new Error("Invalid API response format");
  },
  createContract(contractData: any) {
    return axiosInstance.post("/api/ContractForStaff/create-contract", contractData);
  },
  async getBuildings() {
    const response = await axiosInstance.get("/api/ContractForStaff/buildings");
    if (response.data && Array.isArray(response.data.$values)) {
      return response.data;
    }
    throw new Error("Invalid API response format");
  },
  async getFloors(buildingId: number) {
    const response = await axiosInstance.get(`/api/ContractForStaff/buildings/${buildingId}/floors`);
    if (response.data && Array.isArray(response.data.$values)) {
      return response.data;
    }
    throw new Error("Invalid API response format");
  },
  async getAreas(buildingId: number, floorId: number) {
    const response = await axiosInstance.get(`/api/ContractForStaff/buildings/${buildingId}/floors/${floorId}/areas`);
    if (response.data && Array.isArray(response.data.$values)) {
      return response.data;
    }
    throw new Error("Invalid API response format");
  },
  async getNiches(buildingId: number, floorId: number, areaId: number) {
    const response = await axiosInstance.get(`/api/ContractForStaff/buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`);
    if (response.data && Array.isArray(response.data.$values)) {
      return response.data;
    }
    throw new Error("Invalid API response format");
  }
};

export default contractService;
