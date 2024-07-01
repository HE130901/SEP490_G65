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

const CustomerViewDialog = ({ open, customer, onClose }) => {
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
              disabled
            />
            <TextField
              margin="dense"
              label="Tên Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.fullName}
              disabled
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={customer.email}
              disabled
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.phone}
              disabled
            />
            <TextField
              margin="dense"
              label="Địa chỉ"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.address}
              disabled
            />
            <TextField
              margin="dense"
              label="CCCD"
              type="text"
              fullWidth
              variant="outlined"
              value={customer.citizenId}
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

export default CustomerViewDialog;
