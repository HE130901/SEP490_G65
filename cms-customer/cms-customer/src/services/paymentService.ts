// /services/paymentService.ts
import axiosInstance from "@/utils/axiosInstance";

interface CreatePaymentRequest {
  amount: string;
  orderId: string;
}

interface CreatePaymentResponse {
  paymentUrl: string;
}

const createPayment = async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
  const response = await axiosInstance.post<CreatePaymentResponse>("/api/Payments/create-payment", data);
  return response.data;
};

const paymentService = {
  createPayment,
};

export default paymentService;
