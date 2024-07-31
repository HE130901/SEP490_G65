"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { format, addMonths } from "date-fns";
import { vi } from "date-fns/locale";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import { z } from "zod";
import { toast } from "react-toastify";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
];

const today = new Date();
const maxDate = addMonths(today, 1);

const appointmentSchema = z.object({
  appointmentDate: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      return date >= today && date <= maxDate;
    },
    {
      message:
        "Thời gian hẹn phải trong vòng 1 tháng kể từ thời điểm hiện tại.",
    }
  ),
  selectedAddress: z
    .string()
    .nonempty({ message: "Vui lòng chọn địa điểm ký hợp đồng." }),
});

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    appointmentDate?: string;
    selectedAddress?: string;
  }>({});

  const handleExtend = async () => {
    try {
      appointmentSchema.parse({ appointmentDate, selectedAddress });

      const note = `Hẹn ký gia hạn hợp đồng tại ${selectedAddress} vào ngày ${formatDateToVietnamese(
        new Date(appointmentDate)
      )}`;

      setLoading(true);
      await axiosInstance.post(`/api/Contracts/renew`, {
        contractId,
        note,
        confirmationDate: new Date(appointmentDate).toISOString(),
        signAddress: selectedAddress,
      });
      toast.success("Đăng ký lịch hẹn gia hạn thành công.");
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          appointmentDate?: string;
          selectedAddress?: string;
        } = {};
        err.errors.forEach((error) => {
          if (error.path.includes("appointmentDate")) {
            fieldErrors.appointmentDate = error.message;
          } else if (error.path.includes("selectedAddress")) {
            fieldErrors.selectedAddress = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error extending contract:", err);
        toast.error("Không thể hẹn gia hạn hợp đồng.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateToVietnamese = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  useEffect(() => {
    console.log(`ExtendContractDialog isOpen: ${isOpen}`);
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Gia hạn hợp đồng</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={!!errors.selectedAddress}
              >
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
                {errors.selectedAddress && (
                  <FormHelperText>{errors.selectedAddress}</FormHelperText>
                )}
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
                inputProps={{
                  min: format(today, "yyyy-MM-dd"),
                  max: format(maxDate, "yyyy-MM-dd"),
                }}
                error={!!errors.appointmentDate}
                helperText={errors.appointmentDate && errors.appointmentDate}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Đóng
          </Button>
          <Button
            onClick={handleExtend}
            variant="contained"
            color="success"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <HistorySharpIcon />
            }
          >
            Hẹn ký gia hạn
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
