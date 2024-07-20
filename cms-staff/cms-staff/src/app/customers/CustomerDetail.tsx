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
import { CustomerViewDialogProps } from "./interfaces";

const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  customer,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xem thông tin khách hàng</DialogTitle>
      <DialogContent>
        {customer && (
          <>
            <TextField
              margin="dense"
              label="Mã Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.customerId}
            />
            <TextField
              margin="dense"
              label="Tên Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.fullName}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={customer.email}
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.phone}
            />
            <TextField
              margin="dense"
              label="Địa chỉ"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.address}
            />
            <TextField
              margin="dense"
              label="CCCD"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.citizenId}
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

export default CustomerViewDialog;
