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

const CustomerEditDialog = ({ open, customer, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    citizenId: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({ ...customer });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Add your save logic here
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
      <DialogContent>
        {formData && (
          <>
            <TextField
              margin="dense"
              label="Mã Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.customerId}
              disabled
            />
            <TextField
              margin="dense"
              label="Tên Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Địa chỉ"
              type="text"
              fullWidth
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="CCCD"
              type="text"
              fullWidth
              variant="outlined"
              name="citizenId"
              value={formData.citizenId}
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

export default CustomerEditDialog;
