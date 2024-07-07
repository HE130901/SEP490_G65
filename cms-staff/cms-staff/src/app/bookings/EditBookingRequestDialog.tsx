"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const EditBookingRequestDialog = ({
  open,
  bookingRequest,
  onClose,
}: {
  open: boolean;
  bookingRequest: any;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    reservationId: "",
    nicheId: "",
    signAddress: "",
    phoneNumber: "",
    status: "",
    note: "",
  });

  useEffect(() => {
    if (bookingRequest) {
      setFormData({ ...bookingRequest });
    }
  }, [bookingRequest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Edit booking request logic
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        {formData && (
          <>
            <TextField
              margin="dense"
              label="Mã đơn"
              type="text"
              fullWidth
              variant="outlined"
              name="reservationId"
              value={formData.reservationId}
              disabled
            />
            <TextField
              margin="dense"
              label="Mã ô chứa"
              type="text"
              fullWidth
              variant="outlined"
              name="nicheId"
              value={formData.nicheId}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Địa chỉ"
              type="text"
              fullWidth
              variant="outlined"
              name="signAddress"
              value={formData.signAddress}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Trạng thái"
              type="text"
              fullWidth
              variant="outlined"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Ghi chú"
              type="text"
              fullWidth
              variant="outlined"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handleSave} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookingRequestDialog;
