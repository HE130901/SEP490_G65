"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface ViewBookingRequestDialogProps {
  open: boolean;
  bookingRequest: any;
  onClose: () => void;
}

const ViewBookingRequestDialog: React.FC<ViewBookingRequestDialogProps> = ({
  open,
  bookingRequest,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xem chi tiết đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        {bookingRequest && (
          <>
            <TextField
              margin="dense"
              label="Mã đơn"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.reservationId}
              disabled
            />
            <TextField
              margin="dense"
              label="Mã ô chứa"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.nicheId}
              disabled
            />
            <TextField
              margin="dense"
              label="Địa chỉ"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.signAddress}
              disabled
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.phoneNumber}
              disabled
            />
            <TextField
              margin="dense"
              label="Trạng thái"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.status}
              disabled
            />
            <TextField
              margin="dense"
              label="Ghi chú"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingRequest.note}
              disabled
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBookingRequestDialog;
