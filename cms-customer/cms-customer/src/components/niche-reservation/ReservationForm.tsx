"use client";

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify"; // Import react-toastify
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStateContext } from "@/context/StateContext";
import { useMediaQuery } from "react-responsive";
import NicheReservationAPI from "@/services/nicheReservationService";

const phoneRegex = /^(\+84|0[1|3|5|7|8|9])+([0-9]{8})$/;

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
  "Nhà tang lễ thành phố ",
  "Nghĩa trang Văn Điển ",
  "An Bình Viên - Hòa Lạc",
];

const ReservationForm = ({
  isVisible,
  onClose,
  selectedNiche,
}: {
  isVisible: boolean;
  onClose: () => void;
  selectedNiche: any;
}) => {
  const { selectedBuilding, selectedFloor, selectedArea, fetchNiches, user } =
    useStateContext();
  const [selectedAddress, setSelectedAddress] = useState(
    predefinedAddresses[0]
  );

  const {
    control,
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

  useEffect(() => {
    console.log("Selected Niche: ", selectedNiche); // Debugging log
  }, [selectedNiche]);

  const onSubmit = async (data: any) => {
    console.log("Form data on submit:", data); // Debugging log
    if (!selectedNiche?.nicheId && !selectedNiche?.$id) {
      toast.error("Please select a niche.");
      return;
    }

    const contractDate = data.contractDate + "T23:59:59";

    const dataToSubmit = {
      nicheId: selectedNiche.nicheId, // Fixed nicheId field
      name: data.name,
      confirmationDate: contractDate,
      signAddress: selectedAddress,
      phoneNumber: data.phoneNumber,
      note: data.note,
      isCustomer: !!user, // Check if the user is a customer
    };

    console.log("Data to submit:", dataToSubmit); // Debugging log

    try {
      const response = await NicheReservationAPI.createReservation(
        dataToSubmit
      );
      console.log("API response:", response); // Debugging log
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

  const getAllowedDates = () => {
    const today = new Date();
    const dates = [today.toISOString().split("T")[0]];
    for (let i = 1; i <= 2; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split("T")[0]);
    }
    return dates;
  };

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-center">Đăng ký đặt chỗ</DialogTitle>
      <DialogContent className="bg-gradient-to-b from-white to-stone-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={
                  <span>
                    Tên của bạn <span style={{ color: "red" }}>*</span>
                  </span>
                }
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message?.toString() : ""}
                InputProps={{
                  readOnly: !!user,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#0e0101",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0e0101",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0e0101",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                }}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={
                  <span>
                    Số điện thoại <span style={{ color: "red" }}>*</span>
                  </span>
                }
                fullWidth
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={
                  errors.phoneNumber
                    ? errors.phoneNumber.message?.toString()
                    : ""
                }
                InputProps={{
                  readOnly: !!user,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#0e0101",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0e0101",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0e0101",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                }}
              />
            )}
          />
          <FormLabel
            component="legend"
            className="mt-4"
            sx={{ color: "#0e0101" }}
          >
            Địa chỉ ký hợp đồng <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <Controller
            name="signAddress"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={selectedAddress}
                onChange={(e) => {
                  setSelectedAddress(e.target.value);
                  field.onChange(e.target.value);
                }}
                sx={{
                  "& .MuiFormControlLabel-root .MuiTypography-root": {
                    color: "#0e0101",
                  },
                  "& .MuiRadio-root.Mui-checked": {
                    color: "#0e0101",
                  },
                }}
              >
                {predefinedAddresses.map((address) => (
                  <FormControlLabel
                    key={address}
                    value={address}
                    control={<Radio />}
                    label={address}
                  />
                ))}
              </RadioGroup>
            )}
          />
          <Controller
            name="contractDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={
                  <span>
                    Ngày hẹn ký hợp đồng <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="date"
                fullWidth
                margin="normal"
                error={!!errors.contractDate}
                helperText={
                  errors.contractDate
                    ? errors.contractDate.message?.toString()
                    : ""
                }
                inputProps={{
                  min: getAllowedDates()[0],
                  max: getAllowedDates()[2],
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#0e0101",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0e0101",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0e0101",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                }}
              />
            )}
          />
          <TextField
            label="Ô đã chọn"
            value={`${selectedBuilding?.buildingName} - ${selectedFloor?.floorName} - ${selectedArea?.areaName} - Ô số ${selectedNiche?.nicheName}`}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                color: "#0e0101",
              },
              "& .MuiInputLabel-root": {
                color: "#0e0101",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0e0101",
              },
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#0e0101",
                },
            }}
          />
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ghi chú"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#0e0101",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0e0101",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0e0101",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                }}
              />
            )}
          />
          <Typography
            variant="body2"
            color="error"
            align="center"
            className="mt-4"
            sx={{ fontWeight: "bold" }}
          >
            Quý khách vui lòng lưu ý!
          </Typography>
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{ fontStyle: "italic" }}
            className="mb-4"
          >
            Thời gian giữ chỗ chỉ có hiệu lực trong vòng 3 ngày kể từ khi đặt
            chỗ thành công. <br />
            Nếu quá thời hạn trên, việc đặt chỗ sẽ tự động bị hủy.
          </Typography>
          <div className="flex justify-between mt-4 space-x-2">
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              sx={{
                borderColor: "#0e0101",
                color: "#0e0101",
                "&:hover": { borderColor: "#0e0101", color: "#0e0101" },
              }}
            >
              Đóng
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: "#FB8C00",
                "&:hover": { backgroundColor: "#EF6C00" },
              }}
            >
              Đặt chỗ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
