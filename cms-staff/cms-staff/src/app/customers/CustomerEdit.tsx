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
  Divider,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

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

interface CustomerEditDialogProps {
  open: boolean;
  customerId: any;
  onClose: () => void;
}

const CustomerEditDialog: React.FC<CustomerEditDialogProps> = ({
  open,
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    if (open && customerId !== null) {
      setLoading(true);
      setError(null);
      axiosInstance
        .get(`/api/Customers/${customerId}`)
        .then((response) => {
          setCustomer(response.data);
        })
        .catch((err) => {
          setError("Failed to fetch customer data.");
          console.error(err); // Debugging
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setCustomer(null);
    }
  }, [open, customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) =>
      prevCustomer ? { ...prevCustomer, [name]: value } : null
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSaveInfo = async () => {
    if (!customer) return;
    try {
      await axiosInstance.put(`/api/Customers/${customer.customerId}`, {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        citizenId: customer.citizenId,
        citizenIdissuanceDate: customer.citizenIdissuanceDate,
        citizenIdsupplier: customer.citizenIdsupplier,
      });
      toast.success("Customer information updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update customer information");
      console.error(error); // Debugging
    }
  };

  const handleChangePassword = async () => {
    if (!customer || !newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    try {
      await axiosInstance.put(
        `/api/Customers/${customer.customerId}/ChangePassword`,
        {
          password: newPassword,
        }
      );
      toast.success("Password updated successfully");
      setNewPassword(""); // Clear the password field
      onClose();
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error); // Debugging
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : customer ? (
          <>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Mã Khách hàng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={customer.customerId}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tên Khách hàng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Số điện thoại"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="CCCD"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="citizenId"
                  value={customer.citizenId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ngày cấp CCCD"
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="citizenIdissuanceDate"
                  value={customer.citizenIdissuanceDate}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nơi cấp CCCD"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="citizenIdsupplier"
                  value={customer.citizenIdsupplier}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button
                onClick={handleSaveInfo}
                color="primary"
                variant="contained"
              >
                Lưu thông tin
              </Button>
            </DialogActions>
            <Divider />
            <Typography variant="h6" gutterBottom mt={2}>
              Đổi mật khẩu
            </Typography>
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Nhập mật khẩu mới"
              margin="dense"
            />
            <DialogActions>
              <Button
                onClick={handleChangePassword}
                color="primary"
                variant="contained"
              >
                Đổi mật khẩu
              </Button>
            </DialogActions>
          </>
        ) : (
          <Typography>Không có thông tin khách hàng.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerEditDialog;
