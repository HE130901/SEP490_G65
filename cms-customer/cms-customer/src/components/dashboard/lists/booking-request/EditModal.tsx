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
import { addDays, format } from "date-fns";
import { parseISO } from "date-fns";

type EditModalProps = {
  record: NicheReservation;
  onSave: (updatedRecord: NicheReservation) => void;
  onClose: () => void;
};

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
] as const;

const today = new Date();
const maxDate = addDays(today, 3);

const reservationSchema = z.object({
  confirmationDate: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      return date >= today && date <= maxDate;
    },
    {
      message: "Ngày xác nhận phải trong vòng 3 ngày tính từ ngày hiện tại.",
    }
  ),
  signAddress: z.enum(predefinedAddresses),
  note: z.string().optional(),
});

export default function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [updatedRecord, setUpdatedRecord] = useState<NicheReservation>({
    ...record,
    confirmationDate: format(
      parseISO(record.confirmationDate),
      "yyyy-MM-dd'T'HH:mm"
    ),
    signAddress: record.signAddress || predefinedAddresses[0], // Set default value
  });
  const [formErrors, setFormErrors] = useState<{
    confirmationDate?: string;
    signAddress?: string;
  }>({});

  const handleChange = (field: keyof NicheReservation, value: any) => {
    setUpdatedRecord({ ...updatedRecord, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      reservationSchema.parse(data);
      onSave(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
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
                min: format(today, "yyyy-MM-dd'T'HH:mm"),
                max: format(maxDate, "yyyy-MM-dd'T'HH:mm"),
              }}
            />
          </Box>
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
