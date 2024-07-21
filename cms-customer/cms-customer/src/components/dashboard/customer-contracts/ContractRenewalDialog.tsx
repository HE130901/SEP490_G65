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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
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
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleExtend = async () => {
    if (!appointmentDate || !selectedAddress || !note) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
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
      console.error("Error extending contract:", err);
      toast.error("Không thể hẹn gia hạn hợp đồng.");
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
      <ToastContainer />
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
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
            Hẹn ký gia hạn
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
