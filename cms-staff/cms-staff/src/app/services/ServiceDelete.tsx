"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import ServiceAPI from "@/services/serviceService";
import { Service } from "./interfaces";
import { ToastContainer, toast } from "react-toastify";

interface ServiceDeleteProps {
  service: Service | null;
  onClose: () => void;
  onDelete: (serviceId: number) => void;
  open: boolean;
}

const ServiceDelete: React.FC<ServiceDeleteProps> = ({
  service,
  onClose,
  onDelete,
  open,
}) => {
  const handleDelete = async () => {
    if (!service) return;
    try {
      await ServiceAPI.deleteService(service.serviceId);
      toast.success("Xóa dịch vụ thành công");
      onDelete(service.serviceId);
      onClose();
    } catch (error) {
      toast.error("Xóa dịch vụ thất bại");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa dịch vụ</DialogTitle>
      <DialogContent dividers>
        <Typography>Bạn có chắc chắn muốn xóa dịch vụ này?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleDelete} color="primary">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDelete;
