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
import { VisitRequest } from "./interfaces";

interface VisitDeleteProps {
  open: boolean;
  visitRequest: VisitRequest | null;
  onClose: () => void;
  onDelete: () => void;
}

const VisitDelete: React.FC<VisitDeleteProps> = ({
  open,
  visitRequest,
  onClose,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa đơn đăng ký viếng thăm</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa đơn đăng ký viếng thăm này không? Hành động
          này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={onDelete} color="error">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitDelete;