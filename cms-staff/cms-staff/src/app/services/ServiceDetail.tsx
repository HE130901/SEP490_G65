"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";

const ServiceDetail = ({ service, onClose, open }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chi tiết dịch vụ</DialogTitle>
      <DialogContent dividers>
        {service ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Avatar
                src={service.servicePicture}
                alt={service.serviceName}
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Tên: {service.serviceName}</Typography>
              <Typography variant="body1">
                Mô tả: {service.description}
              </Typography>
              <Typography variant="body1">
                Giá: {service.price.toLocaleString()} VND
              </Typography>
              <Typography variant="body1">
                Phân loại: {service.category}
              </Typography>
              <Typography variant="body1">Thẻ: {service.tag}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDetail;
