"use client";

import React, { useState } from "react";
import axios from "@/utils/axiosInstance";

const VnPayPayment = () => {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  interface ErrorData {
    title: string;
    errors: any;
  }

  const [error, setError] = useState<ErrorData | null>(null);

  const handlePayment = async () => {
    try {
      console.log("Sending data to backend:", { amount, orderId }); // Log dữ liệu gửi lên
      const response = await axios.post("/api/payments/create-payment", null, {
        params: {
          amount: Number(amount), // Ensure amount is a number
          orderId,
        },
      });
      console.log("Response from backend:", response.data); // Log response nhận được
      setPaymentUrl(response.data.paymentUrl);
    } catch (error) {
      console.error("Error creating payment:", error);
      if ((error as any).response) {
        console.error("Response data:", (error as any).response.data);
        setError((error as any).response.data);
      }
    }
  };

  return (
    <div className="pt-28">
      <h2>VNPay Payment</h2>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={handlePayment}>Pay with VNPay</button>
      {paymentUrl && (
        <div>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
            Complete Payment
          </a>
        </div>
      )}
      {error && (
        <div className="text-red-500">
          Error: {error.title}. {JSON.stringify(error.errors)}
        </div>
      )}
    </div>
  );
};

export default VnPayPayment;
