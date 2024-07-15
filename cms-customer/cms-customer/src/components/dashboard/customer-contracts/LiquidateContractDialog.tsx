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
import axiosInstance from "@/utils/axiosInstance";
import { Delete as DeleteIcon } from "@mui/icons-material";

const predefinedAddresses = [
  "Nhà tang lễ thành phố (Phùng Hưng - Cửa Đông - Hoàn Kiếm)",
  "Nghĩa trang Văn Điển (Phan Trọng Tuệ - Tam Hiệp - Thanh Trì)",
  "Nghĩa trang Mai Dịch (Trần Vỹ - Mai Dịch - Cầu Giấy)",
];

interface LiquidateContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number | null;
}

export default function LiquidateContractDialog({
  isOpen,
  onClose,
  contractId,
}: LiquidateContractDialogProps) {
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(
    predefinedAddresses[0]
  );
  const [loading, setLoading] = useState(false);

  const handleLiquidate = async () => {
    if (!appointmentDate || !selectedAddress) {
      alert("Vui lòng chọn ngày hẹn và địa điểm thanh lý hợp đồng.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/api/Niches/${contractId}/liquidate`, {
        appointmentDate,
        signAddress: selectedAddress,
      });
      alert("Hợp đồng đã được thanh lý.");
      onClose();
    } catch (err) {
      console.error("Error liquidating contract:", err);
      alert("Không thể thanh lý hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`LiquidateContractDialog isOpen: ${isOpen}`);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Thanh lý hợp đồng</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="grid gap-6 p-6">
          <div className="grid gap-4">
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
            <div className="grid gap-1">
              <p className="text-sm font-medium">Ngày hẹn thanh lý</p>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                placeholder="Chọn ngày"
                className="w-36"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleLiquidate}
            disabled={loading}
          >
            <DeleteIcon className="mr-2" /> Thanh lý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
