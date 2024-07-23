// src/components/VnpayReturn.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { motion } from "framer-motion";

const VnpayReturn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const orderDetails = JSON.parse(
      localStorage.getItem("orderDetails") || "[]"
    );
    const nicheID = localStorage.getItem("nicheID");
    const orderDate = localStorage.getItem("orderDate");

    params["nicheID"] = nicheID ?? "";
    params["serviceOrderDetails"] = JSON.stringify(orderDetails);

    console.log("Request parameters: ", params);

    axiosInstance
      .get("/api/Payments/vnpay_return", { params })
      .then((response) => {
        if (response.data.message === "Giao dịch thành công") {
          ServiceOrderAPI.create({
            nicheID: parseInt(nicheID || "0", 10),
            orderDate: orderDate || "",
            serviceOrderDetails: orderDetails,
          })
            .then(() => {
              toast.success("Đặt đơn hàng thành công!");
              localStorage.removeItem("orderDetails");
              localStorage.removeItem("nicheID");
              localStorage.removeItem("orderDate");
              router.push("/purchase");
            })
            .catch((error) => {
              toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
              console.error("Order creation error:", error);
              router.push("/service-order");
            });
        } else {
          toast.error(`Giao dịch không thành công: ${response.data.message}`);
          console.error("VNPay return error:", response.data);
          router.push("/service-order");
        }
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        console.error("VNPay return API error:", error);
        router.push("/service-order");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-28">
        <motion.div
          className="p-8 bg-white rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Đang xử lý thanh toán
          </h2>
          <p className="text-gray-600">
            Vui lòng đợi trong khi chúng tôi xác nhận giao dịch của bạn...
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default VnpayReturn;
