"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axiosInstance from "@/api/axios-config";

const predefinedAddresses = [
  "Nhà tang lễ thành phố (Phùng Hưng - Cửa Đông - Hoàn Kiếm)",
  "Nghĩa trang Văn Điển (Phan Trọng Tuệ - Tam Hiệp - Thanh Trì)",
  "Nghĩa trang Mai Dịch (Trần Vỹ - Mai Dịch - Cầu Giấy)",
];

interface ExtendContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  containerId: number | null;
}

export default function ExtendContractDialog({
  isOpen,
  onClose,
  containerId,
}: ExtendContractDialogProps) {
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(
    predefinedAddresses[0]
  );
  const [loading, setLoading] = useState(false);

  const handleExtend = async () => {
    if (!appointmentDate || !selectedAddress) {
      alert("Vui lòng chọn ngày hẹn và địa điểm ký hợp đồng.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/api/Niches/${containerId}/extend`, {
        appointmentDate,
        signAddress: selectedAddress,
      });
      alert("Hợp đồng đã được gia hạn.");
      onClose();
    } catch (err) {
      console.error("Error extending contract:", err);
      alert("Không thể gia hạn hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gia hạn hợp đồng</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="grid gap-6 p-6">
          <div className="grid gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium">Ngày hẹn ký gia hạn</p>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                placeholder="Chọn ngày"
              />
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium">Địa điểm ký hợp đồng</p>
              <RadioGroup
                value={selectedAddress}
                onValueChange={(value) => setSelectedAddress(value)}
              >
                {predefinedAddresses.map((address) => (
                  <div key={address} className="flex items-center">
                    <RadioGroupItem
                      id={address}
                      value={address}
                      className="mr-2"
                    />
                    <label htmlFor={address} className="text-gray-700 text-sm">
                      {address}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleExtend} disabled={loading}>
            Gia hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
