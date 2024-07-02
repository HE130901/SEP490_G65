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
import { addMonths, addYears, format } from "date-fns";
import { vi } from "date-fns/locale";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";

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
  const [durationType, setDurationType] = useState<"month" | "year">("month");
  const [durationValue, setDurationValue] = useState<number>(0);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointmentDate && durationValue > 0) {
      const newEndDate = calculateNewEndDate(
        new Date(appointmentDate),
        durationType,
        durationValue
      );
      setNewEndDate(newEndDate);
    } else {
      setNewEndDate(null);
    }
  }, [appointmentDate, durationType, durationValue]);

  const handleExtend = async () => {
    if (!appointmentDate || !selectedAddress || durationValue <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/api/Niches/${containerId}/extend`, {
        appointmentDate,
        signAddress: selectedAddress,
        durationType,
        durationValue,
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

  const calculateNewEndDate = (
    startDate: Date,
    type: "month" | "year",
    value: number
  ): Date => {
    if (type === "month") {
      return addMonths(startDate, value);
    }
    return addYears(startDate, value);
  };

  const formatDateToVietnamese = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Gia hạn hợp đồng</DialogTitle>
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
              <p className="text-sm font-medium">Thời hạn</p>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={durationValue}
                  onChange={(e) => setDurationValue(Number(e.target.value))}
                  placeholder="Nhập số tháng/năm"
                  className="w-20"
                />
                <RadioGroup
                  value={durationType}
                  onValueChange={(value) =>
                    setDurationType(value as "month" | "year")
                  }
                  className="flex items-center"
                >
                  <div className="flex items-center mr-4">
                    <RadioGroupItem id="month" value="month" className="mr-2" />
                    <label htmlFor="month" className="text-gray-700 text-sm">
                      Tháng
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="year" value="year" className="mr-2" />
                    <label htmlFor="year" className="text-gray-700 text-sm">
                      Năm
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium">Ngày hẹn ký gia hạn</p>
              <div className="flex items-center space-x-4">
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  placeholder="Chọn ngày"
                  className="w-36"
                />
              </div>
            </div>
            {newEndDate && (
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  Ngày kết thúc mới dự tính:
                </p>
                <p className="text-sm">{formatDateToVietnamese(newEndDate)}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-center space-x-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="green" onClick={handleExtend} disabled={loading}>
            <HistorySharpIcon className="mr-2" /> Gia hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
