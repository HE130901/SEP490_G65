// src/components/ConfirmBookingRequestDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmBookingRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmBookingRequestDialog: React.FC<
  ConfirmBookingRequestDialogProps
> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận đơn đặt chỗ</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xác nhận đơn đặt chỗ này không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBookingRequestDialog;
