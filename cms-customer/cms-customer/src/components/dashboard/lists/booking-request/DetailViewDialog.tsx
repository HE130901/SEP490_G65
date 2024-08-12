"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

type NicheReservation = {
  reservationId: number;
  nicheId: number;
  createdDate: string;
  confirmationDate: string;
  status: string;
  signAddress: string;
  phoneNumber: string;
  note: string;
  name: string;
  confirmedBy: number;
  reservationCode: string;
};

type DetailViewDialogProps = {
  open: boolean;
  onClose: () => void;
  id: number | null;
};

export default function DetailViewDialog({
  open,
  onClose,
  id,
}: DetailViewDialogProps) {
  const [record, setRecord] = useState<NicheReservation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (id !== null) {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/api/NicheReservations/${id}`
          );
          setRecord(response.data);
        } catch (error) {
          console.error("Error fetching reservation details:", error);
          setRecord(null);
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      fetchReservationDetails();
    }
  }, [id, open]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "Approved":
        return "Đã duyệt";
      case "Pending":
        return "Đang chờ duyệt";
      case "Canceled":
        return "Đã hủy";
      case "Expired":
        return "Đã hết hạn";
      case "Signed":
        return "Đã ký hợp đồng";
      default:
        return "Không xác định";
    }
  };

  if (!open || !id) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết Đơn Đặt Chỗ</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : record ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mã đơn"
                variant="outlined"
                value={record.reservationCode}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tên"
                variant="outlined"
                value={record.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số Điện Thoại"
                variant="outlined"
                value={record.phoneNumber}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày Tạo"
                variant="outlined"
                value={new Date(record.createdDate).toLocaleString("vi-VN")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày hẹn"
                variant="outlined"
                value={new Date(record.confirmationDate).toLocaleString(
                  "vi-VN"
                )}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Trạng Thái"
                variant="outlined"
                value={getStatusText(record.status)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa Chỉ Ký"
                variant="outlined"
                value={record.signAddress}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi Chú"
                variant="outlined"
                value={record.note}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>Không tìm thấy thông tin đơn đặt chỗ.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
