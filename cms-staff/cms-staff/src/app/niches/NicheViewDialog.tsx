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

const NicheViewDialog = ({ open, niche, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xem chi tiết ô chứa</DialogTitle>
      <DialogContent>
        {niche && (
          <>
            <TextField
              margin="dense"
              label="Mã"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.nicheName}
              disabled
            />
            <TextField
              margin="dense"
              label="Khách hàng"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.customer}
              disabled
            />
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.phone}
              disabled
            />
            <TextField
              margin="dense"
              label="Người mất"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.deceased}
              disabled
            />
            <TextField
              margin="dense"
              label="Trạng thái"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.status}
              disabled
            />
            <TextField
              margin="dense"
              label="Lịch sử"
              type="text"
              fullWidth
              variant="outlined"
              value={niche.history}
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

export default NicheViewDialog;
