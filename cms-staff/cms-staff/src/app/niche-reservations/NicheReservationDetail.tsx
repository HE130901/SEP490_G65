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
} from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import NicheReservationAPI from "@/services/nicheReservationService";
import EditBookingRequestDialog from "./EditBookingRequestDialog";

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

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Xem chi tiết đơn đăng ký đặt chỗ</DialogTitle>
        <DialogContent>
          {bookingRequest && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Mã đơn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.reservationId}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Mã ô chứa"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.nicheId}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Ngày tạo"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={new Date(bookingRequest.createdDate).toLocaleString()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Ngày hẹn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={new Date(
                    bookingRequest.confirmationDate
                  ).toLocaleString()}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Tên nhân viên xác nhận"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.nameConfirmedBy || "Chưa xác nhận"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Trạng thái"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.status}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Ghi chú"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={bookingRequest.note || "Không có ghi chú"}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Quay lại
          </Button>
          {bookingRequest && bookingRequest.status !== "Approved" && (
            <Button
              onClick={handleEditDialogOpen}
              color="primary"
              variant="contained"
              startIcon={<EditIcon />}
            >
              Sửa
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <EditBookingRequestDialog
        open={editDialogOpen}
        bookingRequest={bookingRequest}
        onClose={handleEditDialogClose}
        onConfirmSuccess={onConfirmSuccess}
      />
    </>
  );
};

export default ViewBookingRequestDialog;
