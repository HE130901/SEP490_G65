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
  create(data: { nicheID: number; orderDate: string; serviceOrderDetails: { serviceID: number; quantity: number }[] }) {
    const url = `/api/ServiceOrders/create-service-order`;
    console.log("Sending POST request to:", url); // Debugging line
    console.log("Data being sent:", data); // Debugging line
    return axiosInstance.post(url, data);
  }
};

export default ServiceOrderAPI;
