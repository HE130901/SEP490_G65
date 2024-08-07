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
import * as z from "zod";

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

const customerSchema = z.object({
  fullName: z.string().nonempty("Tên Khách hàng không được để trống"),
  email: z.string().email("Email không đúng định dạng"),
  phone: z
    .string()
    .regex(
      /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/,
      "Số điện thoại không đúng định dạng"
    ),
  address: z.string().nonempty("Địa chỉ không được để trống"),
  citizenId: z
    .string()
    .refine(
      (val) => val.length === 9 || val.length === 12,
      "CCCD phải có 9 hoặc 12 số"
    ),
  citizenIdissuanceDate: z
    .string()
    .refine(
      (val) => new Date(val) < new Date(),
      "Ngày cấp phải nhỏ hơn ngày hiện tại"
    ),
  citizenIdsupplier: z.string().nonempty("Nơi cấp không được để trống"),
});

const CustomerEditDialog: React.FC<CustomerEditDialogProps> = ({
  open,
  customerId,
  onClose,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Customer, string>>
  >({});

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
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleSaveInfo = async () => {
    if (!customer) return;

    const validationResult = customerSchema.safeParse(customer);
    if (!validationResult.success) {
      const newErrors = validationResult.error.formErrors.fieldErrors;
      setValidationErrors(newErrors as Partial<Record<keyof Customer, string>>);
      return;
    }

    try {
      await axiosInstance.put(
        `/api/Customers/${customer.customerId}`,
        customer
      );
      toast.success("Thông tin khách hàng đã được cập nhật");
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin khách hàng");
      console.error(error); // Debugging
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = async () => {
    if (!customer || !newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }
    try {
      await axiosInstance.put(
        `/api/Customers/${customer.customerId}/ChangePassword`,
        {
          password: newPassword,
        }
      );
      toast.success("Mật khẩu đã được cập nhật");
      setNewPassword(""); // Clear the password field
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cập nhật mật khẩu");
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
            <Typography variant="h6" gutterBottom pb={2}>
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Tên khách hàng
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleChange}
                  error={!!validationErrors.fullName}
                  helperText={validationErrors.fullName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mã Khách hàng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={customer.customerId}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Số điện thoại
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Email
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="email"
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={
                    <span>
                      Địa chỉ
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  error={!!validationErrors.address}
                  helperText={validationErrors.address}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Số CCCD
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="citizenId"
                  value={customer.citizenId}
                  onChange={handleChange}
                  error={!!validationErrors.citizenId}
                  helperText={validationErrors.citizenId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Ngày cấp CCCD
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="date"
                  fullWidth
                  variant="outlined"
                  name="citizenIdissuanceDate"
                  value={customer.citizenIdissuanceDate}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  error={!!validationErrors.citizenIdissuanceDate}
                  helperText={validationErrors.citizenIdissuanceDate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={
                    <span>
                      Nơi cấp CCCD
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="citizenIdsupplier"
                  value={customer.citizenIdsupplier}
                  onChange={handleChange}
                  error={!!validationErrors.citizenIdsupplier}
                  helperText={validationErrors.citizenIdsupplier}
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
