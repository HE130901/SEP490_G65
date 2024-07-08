"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStateContext } from "@/context/StateContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "react-responsive";
import NicheReservationAPI from "@/services/nicheReservationService";

const phoneRegex = /^(\+84|0[3|5|7|8|9])+([0-9]{8})$/;

const bookingSchema = z.object({
  name: z.string().min(1, "Tên của bạn là bắt buộc"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại của bạn là bắt buộc")
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  contractDate: z.string().refine(
    (val) => {
      const contractDate = new Date(val + "T23:59:00");
      const now = new Date();
      const threeDaysLater = new Date(now);
      threeDaysLater.setDate(now.getDate() + 3);
      return contractDate <= threeDaysLater;
    },
    {
      message:
        "Ngày hẹn ký hợp đồng phải trong vòng tối đa 3 ngày kể từ ngày hiện tại.",
    }
  ),
  signAddress: z.string().min(1, "Địa chỉ ký hợp đồng là bắt buộc"),
  note: z.string().optional(),
});

const predefinedAddresses = [
  "Nhà tang lễ thành phố (Phùng Hưng - Cửa Đông - Hoàn Kiếm)",
  "Nghĩa trang Văn Điển (Phan Trọng Tuệ - Tam Hiệp - Thanh Trì)",
  "Nghĩa trang Mai Dịch (Trần Vỹ - Mai Dịch - Cầu Giấy)",
];

const ReservationForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const {
    selectedBuilding,
    selectedFloor,
    selectedArea,
    selectedNiche,
    fetchNiches,
    user,
  } = useStateContext();
  const [selectedAddress, setSelectedAddress] = useState(
    predefinedAddresses[0]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setValue("contractDate", new Date().toISOString().slice(0, 10));
    setValue("signAddress", selectedAddress);
    if (user) {
      setValue("name", user.fullName);
      setValue("phoneNumber", user.phone);
    }
  }, [setValue, selectedAddress, user]);

  const onSubmit = async (data: any) => {
    const contractDate = data.contractDate + "T23:59:00";

    const dataToSubmit = {
      nicheId: selectedNiche?.nicheId,
      name: data.name,
      confirmationDate: contractDate,
      signAddress: selectedAddress,
      phoneNumber: data.phoneNumber,
      note: data.note,
      isCustomer: !!user, // Check if the user is a customer
    };

    try {
      const response = await NicheReservationAPI.createReservation(
        dataToSubmit
      );
      toast.success("Đặt ô chứa thành công!");
      fetchNiches(); // Call fetchNiches after successful submission
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if ((error as any).response) {
        console.error("Server responded with:", (error as any).response.data);
        if ((error as any).response.data.errors) {
          Object.entries((error as any).response.data.errors).forEach(
            ([key, value]) => {
              toast.error(`${key}: ${value}`);
            }
          );
        } else {
          toast.error(
            (error as any).response.data.error ||
              "Mỗi số điện thoại chỉ được đặt tối đa 3 ô chứa"
          );
        }
      } else {
        toast.error("Failed to create reservation.");
      }
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className={isSmallScreen ? "dialog-content" : ""}>
        <div className="flex justify-center">
          <h2 className="text-xl font-bold">Đăng ký đặt chỗ</h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={isSmallScreen ? "form-container" : "px-4 bg-white rounded"}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tên của bạn
            </label>
            <input
              type="text"
              {...register("name")}
              className="input-field mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly={!!user}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.name.message?.toString()}
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
              className="input-field mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly={!!user}
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600">
                {errors.phoneNumber.message?.toString()}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 pb-4">
              Địa chỉ ký hợp đồng
            </label>
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
            <input
              type="hidden"
              value={selectedAddress}
              {...register("signAddress")}
            />
            {errors.signAddress && (
              <p className="mt-2 text-sm text-red-600">
                {errors.signAddress.message?.toString()}
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
              className="input-field mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="input-field mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.contractDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.contractDate.message?.toString()}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              {...register("note")}
              className="input-field mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <p className="text-sm font-semibold text-red-600">
              Quý khách vui lòng lưu ý!
            </p>
          </div>

          <p className="mb-4 text-sm text-red-600">
            Thời gian giữ chỗ chỉ có hiệu lực trong vòng 3 ngày kể từ khi đặt
            chỗ thành công. Nếu quá thời hạn trên, việc đặt chỗ sẽ tự động bị
            hủy.
          </p>
          <div
            className={`button-container flex justify-center ${
              isSmallScreen ? "flex-col" : ""
            }`}
          >
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
              className="w-full max-w-xs"
            >
              Quay lại
            </Button>
            <Button type="submit" className="ml-2 w-full max-w-xs">
              Đặt chỗ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
