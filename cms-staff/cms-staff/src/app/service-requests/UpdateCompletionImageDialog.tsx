"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";

const UpdateCompletionImageDialog = ({
  open,
  onClose,
  serviceOrderDetailId,
  onUpdateSuccess,
}: {
  open: boolean;
  onClose: () => void;
  serviceOrderDetailId: number | null;
  onUpdateSuccess: () => void;
}) => {
  const [completionImage, setCompletionImage] = useState("");

  const handleSubmit = async () => {
    if (serviceOrderDetailId === null) return;

    const data = {
      serviceOrderDetailID: serviceOrderDetailId,
      completionImage,
    };

    console.log("Submitting update with data:", data); // Debug log

    try {
      await ServiceOrderAPI.updateCompletionImage(data);
      toast.success("Hình ảnh hoàn thành đã được cập nhật");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating completion image:", error); // Debug log
      toast.error("Không thể cập nhật hình ảnh hoàn thành");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật hình ảnh hoàn thành</DialogTitle>
      <DialogContent>
        <Box mb={2} mt={2}>
          <TextField
            label="Link hình ảnh hoàn thành"
            fullWidth
            value={completionImage}
            onChange={(e) => setCompletionImage(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCompletionImageDialog;
