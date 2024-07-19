import axiosInstance from "@/utils/axiosInstance";

const ServiceOrderAPI = {
  getAllByCustomer() {
    const url = `/api/ServiceOrders/customer`;
    return axiosInstance.get(url);
  },
  update(id: number, data: { serviceOrderId: number; orderDate: string }) {
    const url = `/api/ServiceOrders/${id}`;
    console.log("Sending PUT request to:", url); // Debugging line
    console.log("Data being sent:", data); // Debugging line
    return axiosInstance.put(url, {
      serviceOrderId: data.serviceOrderId,
      orderDate: data.orderDate,
    });
  },
};

export default ServiceOrderAPI;
