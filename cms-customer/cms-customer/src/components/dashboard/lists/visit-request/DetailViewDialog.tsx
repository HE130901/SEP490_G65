"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisitRegistration } from "./VisitRegistrationList";

type DetailViewDialogProps = {
  record: VisitRegistration | null;
  onClose: () => void;
};

const DetailViewDialog: React.FC<DetailViewDialogProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi Tiết Đơn Đăng Ký Viếng</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <strong>Mã đơn:</strong> {record.visitId}
          </div>
          <div>
            <strong>Mã Ô:</strong> {record.nicheId}
          </div>
          <div>
            <strong>Ngày Tạo:</strong>{" "}
            {new Date(record.createdDate).toLocaleString()}
          </div>
          <div>
            <strong>Ngày Hẹn:</strong>{" "}
            {new Date(record.visitDate).toLocaleString()}
          </div>
          <div>
            <strong>Trạng Thái:</strong> {record.status}
          </div>
          <div>
            <strong>Số Người Đi Cùng:</strong> {record.accompanyingPeople}
          </div>
          <div>
            <strong>Ghi Chú:</strong> {record.note}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailViewDialog;
