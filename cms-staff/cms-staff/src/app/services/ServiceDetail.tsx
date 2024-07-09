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
import { Service } from "./interfaces";

interface ServiceDetailProps {
  service: Service | null;
  onClose: () => void;
  open: boolean;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onClose,
  open,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết dịch vụ</DialogTitle>
      <DialogContent dividers>
        {service ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <Avatar
                src={service.servicePicture}
                alt={service.serviceName}
                variant="rounded"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="h5" gutterBottom>
                {service.serviceName}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                {service.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Giá: {service.price.toLocaleString()} VND
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phân loại: {service.category}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Thẻ: {service.tag}
              </Typography>
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
