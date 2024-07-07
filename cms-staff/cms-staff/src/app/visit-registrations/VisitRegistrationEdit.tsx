"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { VisitRequest } from "./interfaces";

interface VisitEditProps {
  open: boolean;
  visitRequest: VisitRequest | null;
  onClose: () => void;
}

const VisitEdit: React.FC<VisitEditProps> = ({
  open,
  visitRequest,
  onClose,
}) => {
  const [formData, setFormData] = useState<VisitRequest>({
    visitId: "",
    nicheId: "",
    visitDate: "",
    status: "",
    note: "",
  });

  useEffect(() => {
    if (visitRequest) {
      setFormData({ ...visitRequest });
    }
  }, [visitRequest]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Edit visit request logic
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa đơn đăng ký viếng thăm</DialogTitle>
      <DialogContent>
        {formData && (
          <>
            <TextField
              margin="dense"
              label="Mã đơn"
              type="text"
              fullWidth
              variant="outlined"
              name="visitId"
              value={formData.visitId}
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

export default VisitEdit;
