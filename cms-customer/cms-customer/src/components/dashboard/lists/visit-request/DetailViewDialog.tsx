"use client";

import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
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
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Mã đơn:</strong> {record.visitCode}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Địa chỉ ô chứa:</strong> {record.nicheAddress}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Ngày Tạo:</strong>{" "}
                {new Date(record.createdDate).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Ngày Hẹn:</strong>{" "}
                {new Date(record.visitDate).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Số Người Đi Cùng:</strong> {record.accompanyingPeople}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Trạng thái đơn: </strong>
                <Badge variant={getStatusVariant(record.status)}>
                  {getStatusText(record.status) || "Không có thông tin"}
                </Badge>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Ghi Chú: </strong> {record.note}
              </Typography>
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
