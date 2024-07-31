import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationDialog({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Xác nhận hủy</DialogTitle>
      <DialogContent dividers>
        <p>Hành động này không thể hoàn tác</p>
        <p>Bạn có chắc chắn muốn hủy đơn đăng ký này không?</p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
