"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DeleteBookingRequestDialog = ({
  open,
  bookingRequest,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa đơn đăng ký đặt chỗ này không? Hành động này
          không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={onDelete} color="error">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBookingRequestDialog;