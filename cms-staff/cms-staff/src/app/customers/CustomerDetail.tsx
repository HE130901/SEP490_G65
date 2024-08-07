"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { CustomerViewDialogProps } from "./interfaces";
import CustomerEditDialog from "./CustomerEdit";

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};
interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  citizenId: string;
  citizenIdissuanceDate: string;
  citizenIdsupplier: string;
}

const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (open && customerId) {
      setLoading(true);
      axiosInstance
        .get(`/api/Customers/${customerId}`)
        .then((response) => {
          setCustomer(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [open, customerId]);

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    onClose(); // Close the view dialog when edit dialog is closed
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thông tin khách hàng</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : customer ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label={<span>Tên khách hàng</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="fullName"
                value={customer?.fullName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã Khách hàng"
                type="text"
                fullWidth
                variant="outlined"
                value={customer?.customerId}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={<span>Số điện thoại</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="phone"
                value={customer?.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={<span>Email</span>}
                type="email"
                fullWidth
                variant="outlined"
                name="email"
                value={customer?.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<span>Địa chỉ</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="address"
                value={customer?.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={<span>Số CCCD</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="citizenId"
                value={customer?.citizenId}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={<span>Ngày cấp CCCD</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="citizenIdissuanceDate"
                value={formatDateToDDMMYYYY(customer?.citizenIdissuanceDate)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={<span>Nơi cấp CCCD</span>}
                type="text"
                fullWidth
                variant="outlined"
                name="citizenIdsupplier"
                value={customer?.citizenIdsupplier}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>Không có thông tin khách hàng.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
        <Button
          onClick={handleOpenEditDialog}
          color="primary"
          variant="contained"
        >
          Sửa
        </Button>
      </DialogActions>
      {customer && (
        <CustomerEditDialog
          open={editDialogOpen}
          customerId={customer.customerId}
          onClose={handleCloseEditDialog}
        />
      )}
    </Dialog>
  );
};

export default CustomerViewDialog;
