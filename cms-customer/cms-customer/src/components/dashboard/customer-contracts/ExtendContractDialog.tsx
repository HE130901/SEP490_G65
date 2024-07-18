"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
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
  contractId: number | null;
}

export default function ExtendContractDialog({
  isOpen,
  onClose,
  contractId,
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
      await axiosInstance.post(`/api/Niches/${contractId}/extend`, {
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

  useEffect(() => {
    console.log(`ExtendContractDialog isOpen: ${isOpen}`);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gia hạn hợp đồng</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Địa điểm ký hợp đồng</FormLabel>
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
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
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Thời hạn"
              type="number"
              value={durationValue}
              onChange={(e) => setDurationValue(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Loại thời hạn</FormLabel>
              <RadioGroup
                row
                value={durationType}
                onChange={(e) =>
                  setDurationType(e.target.value as "month" | "year")
                }
              >
                <FormControlLabel
                  value="month"
                  control={<Radio />}
                  label="Tháng"
                />
                <FormControlLabel
                  value="year"
                  control={<Radio />}
                  label="Năm"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ngày hẹn ký gia hạn"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {newEndDate && (
            <Grid item xs={12}>
              <Typography>
                Ngày kết thúc mới dự tính: {formatDateToVietnamese(newEndDate)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleExtend}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} /> : <HistorySharpIcon />
          }
        >
          Gia hạn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
