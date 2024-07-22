"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmationDialog = ({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy</DialogTitle>
        </DialogHeader>
        <p>Bạn có chắc chắn muốn hủy đơn đăng ký này không?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Đóng
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xác nhận hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
