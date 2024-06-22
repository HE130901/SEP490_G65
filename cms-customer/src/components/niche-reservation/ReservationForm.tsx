import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/context/state-context";
import axios from "@/api/axios-config";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 

const bookingSchema = z.object({
  customerName: z.string().min(1, "Tên của bạn là bắt buộc"),
  customerPhone: z.string().min(1, "Số điện thoại của bạn là bắt buộc"),
  customerAddress: z.string().min(1, "Địa chỉ của bạn là bắt buộc"),
  contractDate: z.string().refine(
    (val) => {
      const contractDate = new Date(val + "T23:59:00");
      const now = new Date();
      const threeDaysLater = new Date(now);
      threeDaysLater.setDate(now.getDate() + 3);
      return contractDate <= threeDaysLater;
    },
    {
      message: "Ngày hẹn ký hợp đồng phải trong vòng tối đa 3 ngày kể từ ngày hiện tại.",
    }
  ),
  signAddress: z.string().min(1, "Địa chỉ ký hợp đồng là bắt buộc"),
  phoneNumber: z.string().min(1, "Số điện thoại là bắt buộc"),
  note: z.string().optional(),
});

const predefinedAddresses = [
  "Nhà tang lễ thành phố (Phùng Hưng - Cửa Đông - Hoàn Kiếm)",
  "Nghĩa trang Văn Điển (Phan Trọng Tuệ - Tam Hiệp - Thanh Trì)",
  "Nghĩa trang Mai Dịch (Trần Vỹ - Mai Dịch - Cầu Giấy)",
];

const ReservationForm = ({ isVisible, onClose }) => {
  const { selectedBuilding, selectedFloor, selectedArea, selectedNiche, user } =
    useStateContext();
  const [selectedAddress, setSelectedAddress] = useState(predefinedAddresses[0]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("customerName", user.fullName);
      setValue("customerPhone", user.phone);
      setValue("customerAddress", user.address);
      setValue("contractDate", new Date().toISOString().slice(0, 10));
      setValue("signAddress", selectedAddress);
      setValue("phoneNumber", user.phone);
    }
  }, [setValue, user, selectedAddress]);

  const onSubmit = async (data) => {
    const contractDate = data.contractDate + "T23:59:00"; 

    const dataToSubmit = {
      customerID: user.customerId,
      nicheID: selectedNiche?.nicheId,
      confirmationDate: contractDate,
      signAddress: selectedAddress,
      phoneNumber: data.phoneNumber,
      note: data.note,
    };

    try {
      const response = await axios.post("/api/NicheReservations", dataToSubmit);
      toast.success("Đặt ô chứa thành công!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`);
          });
        } else {
          toast.error(error.response.data.error || "Mỗi số điện thoại chỉ được đặt tối đa 3 ô chứa");
        }
      } else {
        toast.error("Failed to create reservation.");
      }
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogTitle asChild>
        <VisuallyHidden>
          <h2 className="text-xl font-bold mb-4">Đăng ký đặt chỗ</h2>
        </VisuallyHidden>
      </DialogTitle>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Đăng ký đặt chỗ</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              {...register("customerName")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.customerName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.customerName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              {...register("phoneNumber")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ ký hợp đồng
            </label>
            <RadioGroup
              value={selectedAddress}
              onValueChange={(value) => setSelectedAddress(value)}
            >
              {predefinedAddresses.map((address) => (
                <div key={address} className="flex items-center mb-2">
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
            <input
              type="hidden"
              value={selectedAddress}
              {...register("signAddress")}
            />
            {errors.signAddress && (
              <p className="mt-2 text-sm text-red-600">
                {errors.signAddress.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ô đã chọn
            </label>
            <input
              type="text"
              value={`${selectedBuilding?.buildingName} - ${selectedFloor?.floorName} - ${selectedArea?.areaName} - Ô số ${selectedNiche?.nicheName}`}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ngày hẹn ký hợp đồng
            </label>
            <input
              type="date"
              {...register("contractDate")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.contractDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.contractDate.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              {...register("note")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="mb-4 text-sm font-semibold text-red-600">
            Quý khách vui lòng lưu ý!
          </p>
          <p className="mb-4 text-sm text-red-600">
            Thời gian giữ chỗ ô chứa chỉ có hiệu lực trong vòng 3 ngày kể từ khi
            đặt chỗ thành công.
            <br />
            Nếu quá thời hạn trên, việc đặt chỗ sẽ tự động bị hủy.
          </p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Quay lại
            </Button>
            <Button type="submit" className="ml-2">
              Xác nhận
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
