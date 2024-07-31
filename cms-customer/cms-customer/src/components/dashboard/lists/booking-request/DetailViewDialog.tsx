"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  Grid,
  DialogActions,
} from "@mui/material";
import { NicheReservation } from "./BookingRequestList";

type DetailViewDialogProps = {
  open: boolean;
  onClose: () => void;
  record: NicheReservation | null;
};

export default function DetailViewDialog({
  open,
  onClose,
  record,
}: DetailViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết Đơn Đặt Chỗ</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Mã đơn:</strong> {record.reservationCode}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Tên:</strong> {record.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Số Điện Thoại:</strong> {record.phoneNumber}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Ngày Tạo:</strong>{" "}
              {new Date(record.createdDate).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Ngày Xác Nhận:</strong>{" "}
              {new Date(record.confirmationDate).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Trạng Thái:</strong> {record.status}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Địa Chỉ Ký:</strong> {record.signAddress}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Ghi Chú:</strong> {record.note}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
