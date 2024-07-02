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

const NicheEditDialog = ({ open, niche, onClose }) => {
  const [formData, setFormData] = useState({
    nicheName: "",
    customer: "",
    phone: "",
    deceased: "",
    status: "",
    history: "",
  });

  useEffect(() => {
    if (niche) {
      setFormData({ ...niche });
    }
  }, [niche]);

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
      <DialogTitle>Sửa thông tin ô chứa</DialogTitle>
      <DialogContent>
        {formData && (
          <>
            <TextField
              margin="dense"
              label="Mã"
              type="text"
              fullWidth
              variant="outlined"
              name="nicheName"
              value={formData.nicheName}
              onChange={handleChange}
              disabled
            />
            <TextField
              margin="dense"
              label="Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              name="customer"
              value={formData.customer}
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
              label="Người mất"
              type="text"
              fullWidth
              variant="outlined"
              name="deceased"
              value={formData.deceased}
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
              label="Lịch sử"
              type="text"
              fullWidth
              variant="outlined"
              name="history"
              value={formData.history}
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

export default NicheEditDialog;
