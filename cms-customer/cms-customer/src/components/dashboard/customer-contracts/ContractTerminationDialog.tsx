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
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
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
      toast.warn("Vui lòng chọn ngày hẹn và địa điểm thanh lý hợp đồng.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/api/Contracts/cancel`, {
        contractId,
        note: `Hẹn thanh lý hợp đồng tại ${selectedAddress} vào ngày ${appointmentDate}`,
        confirmationDate: new Date(appointmentDate).toISOString(),
        signAddress: selectedAddress,
      });
      toast.success("Đăng ký lịch hẹn thanh lý thành công.");
      onClose();
    } catch (err) {
      console.error("Error liquidating contract:", err);
      toast.error("Không thể thanh lý hợp đồng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`LiquidateContractDialog isOpen: ${isOpen}`);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thanh lý hợp đồng</DialogTitle>
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
              label="Ngày hẹn thanh lý"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
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
          onClick={handleLiquidate}
          variant="contained"
          color="secondary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          Thanh lý
        </Button>
      </DialogActions>
    </Dialog>
  );
}
