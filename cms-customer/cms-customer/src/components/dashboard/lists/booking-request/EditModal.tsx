"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";
import { NicheReservation } from "./BookingRequestList";
import { z } from "zod";
import { addDays, format, parseISO } from "date-fns";
import { toast } from "react-toastify";

// Các địa chỉ ký xác định trước
const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
] as const;

type EditModalProps = {
  record: NicheReservation;
  onSave: (updatedRecord: NicheReservation) => void;
  onClose: () => void;
};

export default function EditModal({ record, onSave, onClose }: EditModalProps) {
  // Tính toán ngày tối đa có thể chọn (3 ngày sau ngày tạo)
  const maxDate = addDays(record.createdDate, 2);

  // State để lưu trữ dữ liệu được cập nhật từ form
  const [updatedRecord, setUpdatedRecord] = useState<NicheReservation>({
    ...record,
    confirmationDate: format(
      parseISO(record.confirmationDate),
      "yyyy-MM-dd'T'HH:mm"
    ),
    signAddress: record.signAddress || predefinedAddresses[0], // Đặt giá trị mặc định nếu không có
  });

  // State để lưu trữ lỗi từ form validation
  const [formErrors, setFormErrors] = useState<{
    confirmationDate?: string;
    signAddress?: string;
  }>({});

  // Schema validation sử dụng zod
  const reservationSchema = z.object({
    confirmationDate: z.string().refine(
      (dateString) => {
        const date = new Date(dateString);
        // Kiểm tra ngày xác nhận phải nằm trong khoảng từ ngày tạo đến 3 ngày sau đó
        return date >= new Date(record.createdDate) && date <= maxDate;
      },
      {
        message: "Ngày xác nhận phải trong vòng 3 ngày tính từ ngày tạo.",
      }
    ),
    signAddress: z.enum(predefinedAddresses),
    note: z.string().optional(),
  });

  // Hàm xử lý thay đổi trong các trường input
  const handleChange = (field: keyof NicheReservation, value: any) => {
    setUpdatedRecord({ ...updatedRecord, [field]: value });
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuyển đổi ngày giờ thành định dạng ISO UTC để gửi lên backend
    const localDateTime = parseISO(updatedRecord.confirmationDate);
    const data = {
      ...updatedRecord,
      confirmationDate: new Date(
        Date.UTC(
          localDateTime.getFullYear(),
          localDateTime.getMonth(),
          localDateTime.getDate(),
          localDateTime.getHours(),
          localDateTime.getMinutes(),
          localDateTime.getSeconds()
        )
      ).toISOString(),
    };

    console.log("Data to be sent to backend:", data);

    try {
      // Kiểm tra dữ liệu nhập vào theo schema
      reservationSchema.parse(data);

      // Gọi hàm onSave truyền từ component cha để lưu dữ liệu
      await onSave(data);

      // Đóng dialog sau khi lưu thành công
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
        const fieldErrors: {
          confirmationDate?: string;
          signAddress?: string;
        } = {};

        err.errors.forEach((error) => {
          if (error.path.includes("confirmationDate")) {
            fieldErrors.confirmationDate = error.message;
          } else if (error.path.includes("signAddress")) {
            fieldErrors.signAddress = error.message;
          }
        });

        setFormErrors(fieldErrors);
        toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa Đơn Đặt Chỗ</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          {/* Trường Ngày Xác Nhận */}
          <Box mb={2}>
            <TextField
              label="Ngày Xác Nhận"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={updatedRecord.confirmationDate}
              onChange={(e) => handleChange("confirmationDate", e.target.value)}
              error={!!formErrors.confirmationDate}
              helperText={formErrors.confirmationDate}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: format(record.createdDate, "yyyy-MM-dd'T'HH:mm"),
                max: format(maxDate, "yyyy-MM-dd'T'HH:mm"),
              }}
            />
          </Box>

          {/* Trường Địa Chỉ Ký */}
          <Box mb={2}>
            <Typography variant="subtitle1">Địa Chỉ Ký</Typography>
            <RadioGroup
              value={updatedRecord.signAddress}
              onChange={(e) => handleChange("signAddress", e.target.value)}
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
            {formErrors.signAddress && (
              <FormHelperText error>{formErrors.signAddress}</FormHelperText>
            )}
          </Box>

          {/* Trường Ghi Chú */}
          <Box mb={2}>
            <TextField
              label="Ghi Chú"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={updatedRecord.note}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </Box>
        </form>
      </DialogContent>

      {/* Các nút hành động */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
