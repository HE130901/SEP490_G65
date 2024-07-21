"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import SaveIcon from "@mui/icons-material/Save";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import NicheReservationAPI from "@/services/nicheReservationService";

interface EditBookingRequestDialogProps {
  open: boolean;
  bookingRequest: any;
  onClose: () => void;
  onConfirmSuccess: () => void;
}

const EditBookingRequestDialog: React.FC<EditBookingRequestDialogProps> = ({
  open,
  bookingRequest,
  onClose,
  onConfirmSuccess,
}) => {
  const [formData, setFormData] = useState({
    confirmationDate: "",
    signAddress: "",
    note: "",
  });

  useEffect(() => {
    if (bookingRequest) {
      setFormData({
        confirmationDate: bookingRequest.confirmationDate || "",
        signAddress: bookingRequest.signAddress || "",
        note: bookingRequest.note || "",
      });
    }
  }, [bookingRequest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await NicheReservationAPI.updateNicheReservation(
        bookingRequest.reservationId,
        {
          confirmationDate: formData.confirmationDate,
          signAddress: formData.signAddress,
          note: formData.note,
        }
      );
      toast.success("Đã cập nhật đơn đặt chỗ");
      onConfirmSuccess(); // Refresh the list after update
      onClose(); // Close the dialog
    } catch (error) {
      toast.error("Không thể cập nhật đơn đặt chỗ");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        {bookingRequest && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Địa chỉ ký hợp đồng"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.signAddress}
                onChange={handleInputChange}
                name="signAddress"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Ngày xác nhận"
                type="datetime-local"
                fullWidth
                variant="outlined"
                value={formData.confirmationDate}
                onChange={handleInputChange}
                name="confirmationDate"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Ghi chú"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.note}
                onChange={handleInputChange}
                name="note"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookingRequestDialog;
