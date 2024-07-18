"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface MyNicheDetailDialogProps {
  isVisible: boolean;
  onClose: () => void;
  niche: any;
}

const MyNicheDetailDialog: React.FC<MyNicheDetailDialogProps> = ({
  isVisible,
  onClose,
  niche,
}) => {
  return (
    <Dialog open={isVisible} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết Ô chứa của bạn</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Tên Ô chứa:
        </Typography>
        <Typography variant="body1" gutterBottom>
          Mô tả:
        </Typography>
        {/* Hiển thị các chi tiết khác của niche tại đây */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyNicheDetailDialog;
