import axiosInstance from "@/utils/axiosInstance";

const renewalService = {
  async getRenewalById(id: number) {
    try {
      const response = await axiosInstance.get(`/api/ContractForStaff/contract-renewal/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching renewal details:", error);
      throw new Error("Lỗi khi lấy thông tin gia hạn");
    }
  },
};

export default renewalService;
