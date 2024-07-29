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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
            {[
              { label: "Mã Khách hàng", value: customer.customerId },
              { label: "Tên Khách hàng", value: customer.fullName },
              { label: "Email", value: customer.email },
              { label: "Số điện thoại", value: customer.phone },
              { label: "Địa chỉ", value: customer.address },
              { label: "CCCD", value: customer.citizenId },
              {
                label: "Ngày cấp CCCD",
                value: new Date(
                  customer.citizenIdissuanceDate
                ).toLocaleDateString(),
              },
              { label: "Nơi cấp CCCD", value: customer.citizenIdsupplier },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="subtitle2" color="textSecondary">
                  {field.label}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  value={field.value}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ))}
          </Grid>
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

export default CustomerViewDialog;
