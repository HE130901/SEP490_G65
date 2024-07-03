import axiosInstance from "@/utils/axiosInstance";

const CustomerAPI = {
  getAllCustomers() {
    return axiosInstance.get("/api/Customers");
  },
};

export default CustomerAPI;
