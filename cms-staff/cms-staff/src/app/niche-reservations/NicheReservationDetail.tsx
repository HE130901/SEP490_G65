"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import NicheReservationAPI from "@/services/nicheReservationService";
import EditBookingRequestDialog from "./EditBookingRequestDialog";
import dayjs from "dayjs";

function formatDisplayDateTime(dateTimeString: any) {
  return dayjs(dateTimeString).format("DD/MM/YYYY"); // Format for display
}

interface ViewBookingRequestDialogProps {
  open: boolean;
  bookingRequest: any;
  onClose: () => void;
  onConfirmSuccess: () => void; // Callback to refresh the list after confirmation
}

const ViewBookingRequestDialog: React.FC<ViewBookingRequestDialogProps> = ({
  open,
  bookingRequest,
  onClose,
  onConfirmSuccess,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
    onClose(); // Close the view dialog when the edit dialog opens
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    onConfirmSuccess(); // Refresh the list after update
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Canceled":
        return { label: "Đã hủy", color: "error" };
      case "Rejected":
        return { label: "Đã từ chối", color: "error" };
      case "Expired":
        return { label: "Đã hết hạn", color: "error" };
      case "Pending":
        return { label: "Đang chờ duyệt", color: "warning" };
      case "Approved":
        return { label: "Đã duyệt", color: "success" };
      case "Signed":
        return { label: "Đã ký hợp đồng", color: "success" };
      default:
        return { label: status, color: "default" };
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xem chi tiết đơn đăng ký đặt chỗ</DialogTitle>
        <DialogContent dividers>
          {bookingRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Mã đơn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.reservationCode}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Địa chỉ ô chứa"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.nicheAddress}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Địa chỉ ký hợp đồng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.signAddress}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Tên khách hàng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Số điện thoại"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.phoneNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Ngày tạo"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formatDisplayDateTime(bookingRequest.createdDate)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Ngày hẹn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formatDisplayDateTime(bookingRequest.confirmationDate)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              {/* <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Tên nhân viên xác nhận"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.nameConfirmedBy || "Chưa xác nhận"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Trạng thái:</strong>{" "}
                  <Chip
                    label={getStatusLabel(bookingRequest.status).label}
                    color={getStatusLabel(bookingRequest.status).color as any}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Ghi chú"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.note || "Không có ghi chú"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="outlined">
            Đóng
          </Button>

          <Button
            onClick={handleEditDialogOpen}
            color="primary"
            variant="contained"
            startIcon={<EditIcon />}
            disabled={
              !bookingRequest ||
              bookingRequest.status == "Canceled" ||
              bookingRequest.status == "Rejected" ||
              bookingRequest.status == "Expired" ||
              bookingRequest.status == "Signed"
            }
          >
            Sửa
          </Button>
        </DialogActions>
      </Dialog>
      {bookingRequest && (
        <EditBookingRequestDialog
          open={editDialogOpen}
          bookingRequest={bookingRequest}
          onClose={handleEditDialogClose}
          onConfirmSuccess={onConfirmSuccess}
        />
      )}
    </>
  );
};

export default ViewBookingRequestDialog;
