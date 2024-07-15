import axiosInstance from "@/utils/axiosInstance";

const ContractAPI = {
  getContractsByCustomer(customerId: number) {
    const url = `/api/Contracts/${customerId}/list`;
    return axiosInstance.get(url);
  },
  getContractDetail(contractId: number) {
    const url = `/api/Contracts/${contractId}/detail`;
    return axiosInstance.get(url);
  }
};

export default ContractAPI;
