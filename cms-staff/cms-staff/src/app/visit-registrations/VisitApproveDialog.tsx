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

const VisitApproveDialog: React.FC<VisitDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  const handleApprove = async () => {
    if (visit) {
      try {
        await axiosInstance.put(
          `/api/VisitRegistrations/approve/${visit.visitId}`
        );
        toast.success("Visit registration approved successfully");
        onClose();
      } catch (error) {
        toast.error("Failed to approve visit registration");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận đơn đăng ký</DialogTitle>
      <DialogContent>
        <Typography>Bạn có xác nhận duyệt đơn đăng ký này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleApprove} variant="contained" color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitApproveDialog;
