// src/components/VisitDeleteDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { VisitDialogProps } from "./interfaces";

const VisitDeleteDialog: React.FC<VisitDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  const handleDelete = async () => {
    if (visit) {
      try {
        await axiosInstance.delete(`/api/VisitRegistrations/${visit.visitId}`);
        toast.success("Visit registration deleted successfully");
        onClose();
      } catch (error) {
        toast.error("Failed to delete visit registration");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Từ chối đơn đăng ký</DialogTitle>
      <DialogContent>
        <Typography>Bạn có xác nhận từ chối đơn đăng ký này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleDelete} variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitDeleteDialog;
