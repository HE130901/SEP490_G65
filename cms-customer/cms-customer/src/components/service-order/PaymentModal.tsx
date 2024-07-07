"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface PaymentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalAmount: number;
}

export const PaymentModal = ({
  isOpen,
  setIsOpen,
  totalAmount,
}: PaymentModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    console.log("Payment modal state changed:", open);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/vnpay", {
        name,
        email,
        phone,
        amount: totalAmount,
      });
      if (response.data && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect to VNPay
      } else {
        console.error("Payment initiation failed:", response.data);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <Input
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <Input
              placeholder="Nhập số điện thoại của bạn"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">
              Tổng cộng
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {totalAmount.toLocaleString()} ₫
            </span>
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thanh toán với VNPay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
