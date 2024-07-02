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

const ViewVisitRequestDialog = ({ open, visitRequest, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xem chi tiết đơn đăng ký viếng thăm</DialogTitle>
      <DialogContent>
        {visitRequest && (
          <>
            <TextField
              margin="dense"
              label="Mã đơn"
              type="text"
              fullWidth
              variant="outlined"
              value={visitRequest.visitId}
              disabled
            />
            <TextField
              margin="dense"
              label="Mã ô chứa"
              type="text"
              fullWidth
              variant="outlined"
              value={visitRequest.nicheId}
              disabled
            />
            <TextField
              margin="dense"
              label="Ngày viếng thăm"
              type="date"
              fullWidth
              variant="outlined"
              value={visitRequest.visitDate}
              disabled
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
              value={visitRequest.status}
              disabled
            />
            <TextField
              margin="dense"
              label="Ghi chú"
              type="text"
              fullWidth
              variant="outlined"
              value={visitRequest.note}
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

export default ViewVisitRequestDialog;
