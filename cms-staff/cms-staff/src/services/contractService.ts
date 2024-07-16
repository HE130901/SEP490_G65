import axiosInstance from "@/utils/axiosInstance";

const contractService = {
  async getAllContracts() {
    const response = await axiosInstance.get("/api/ContractForStaff/all-contracts");
    // Extract the contracts from the `$values` key
    if (response.data && response.data.$values) {
      return response.data.$values;
    }
    throw new Error("Invalid API response format");
  },
  async getContractById(id: number) {
    const response = await axiosInstance.get(`/api/ContractForStaff/contract/${id}`);
    // Directly return the contract data
    return response.data;
  },
  createContract(contractData: any) {
    return axiosInstance.post("/api/ContractForStaff/create-contract", contractData);
  },
  // Other API methods...
};

export default contractService;
