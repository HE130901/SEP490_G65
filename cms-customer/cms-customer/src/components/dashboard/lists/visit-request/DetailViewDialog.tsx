"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Box,
} from "@mui/material";
import { VisitRegistration } from "./VisitRegistrationList";
import { Badge } from "@/components/ui/badge";

type DetailViewDialogProps = {
  record: VisitRegistration | null;
  onClose: () => void;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Pending":
      return "default";
    case "Canceled":
    case "Expired":
      return "destructive";
    default:
      return "secondary";
  }
};

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

    default:
      return "Không xác định";
  }
};

const DetailViewDialog: React.FC<DetailViewDialogProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi Tiết Đơn Đăng Ký Viếng</DialogTitle>
      <DialogContent dividers>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mã đơn"
                variant="outlined"
                value={record.visitCode}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Địa chỉ ô chứa"
                variant="outlined"
                value={record.nicheAddress}
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
                value={new Date(record.createdDate).toLocaleString()}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ngày Hẹn"
                variant="outlined"
                value={new Date(record.visitDate).toLocaleString()}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Số Người Đi Cùng"
                variant="outlined"
                value={record.accompanyingPeople}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Trạng thái đơn"
                variant="outlined"
                value={getStatusText(record.status) || "Không có thông tin"}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailViewDialog;
