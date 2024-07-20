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
      <DialogTitle>Delete Visit Registration</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this visit registration?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitDeleteDialog;
