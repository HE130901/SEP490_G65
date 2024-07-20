"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import NicheReservationAPI from "@/services/nicheReservationService";

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await NicheReservationAPI.updateNicheReservation(
        bookingRequest.reservationId,
        {
          nicheId: bookingRequest.nicheId,
          confirmationDate: new Date().toISOString(),
          signAddress: bookingRequest.signAddress,
          phoneNumber: bookingRequest.phoneNumber,
          name: bookingRequest.name,
          note: bookingRequest.note,
        }
      );
      toast.success("Đã xác nhận đơn đặt chỗ");
      onConfirmSuccess(); // Refresh the list after confirmation
      onClose(); // Close the dialog
    } catch (error) {
      toast.error("Không thể xác nhận đơn đặt chỗ");
    }
  };

  const handleReject = async () => {
    try {
      await NicheReservationAPI.deleteNicheReservation(
        bookingRequest.reservationId
      );
      toast.success("Đã từ chối đơn đặt chỗ");
      onConfirmSuccess(); // Refresh the list after rejection
      onClose(); // Close the dialog
    } catch (error) {
      toast.error("Không thể từ chối đơn đặt chỗ");
    }
  };

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const closeConfirmDialog = () => setConfirmDialogOpen(false);
  const openRejectDialog = () => setRejectDialogOpen(true);
  const closeRejectDialog = () => setRejectDialogOpen(false);

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
                  label="Ngày xác nhận"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={
                    bookingRequest.confirmationDate
                      ? new Date(
                          bookingRequest.confirmationDate
                        ).toLocaleString()
                      : "Chưa xác nhận"
                  }
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
            <>
              <Button
                onClick={openConfirmDialog}
                color="primary"
                variant="contained"
                startIcon={<CheckCircleOutlineIcon />}
              >
                Xác nhận
              </Button>
              <Button
                onClick={openRejectDialog}
                color="error"
                variant="contained"
                startIcon={<CancelOutlinedIcon />}
              >
                Từ chối
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Xác nhận đơn đặt chỗ</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xác nhận đơn đặt chỗ này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
              closeConfirmDialog();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onClose={closeRejectDialog}>
        <DialogTitle>Từ chối đơn đặt chỗ</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn từ chối đơn đặt chỗ này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => {
              handleReject();
              closeRejectDialog();
            }}
            color="error"
            variant="contained"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewBookingRequestDialog;
