// ConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ConfirmDialogProps } from "./types";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  handleClose,
  handleConfirm,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
