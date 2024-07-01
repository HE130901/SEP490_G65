"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AddVisitRequestDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    nicheId: "",
    visitDate: "",
    status: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdd = () => {
    // Add visit request logic
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm mới đơn đăng ký viếng thăm</DialogTitle>
      <DialogContent>
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
          label="Ngày viếng thăm"
          type="date"
          fullWidth
          variant="outlined"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handleAdd} color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVisitRequestDialog;
