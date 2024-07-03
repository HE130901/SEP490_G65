"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NicheReservation } from "./BookingRequestList";
import { Button } from "@/components/ui/button";

type DetailViewDialogProps = {
  open: boolean;
  onClose: () => void;
  record: NicheReservation | null;
};

export default function DetailViewDialog({
  open,
  onClose,
  record,
}: DetailViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết Đơn Đặt Chỗ</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            <strong>Mã đơn:</strong> {record.reservationId}
          </p>
          <p>
            <strong>Mã Ô:</strong> {record.nicheId}
          </p>
          <p>
            <strong>Ngày Tạo:</strong>{" "}
            {new Date(record.createdDate).toLocaleString("vi-VN")}
          </p>
          <p>
            <strong>Ngày Xác Nhận:</strong>{" "}
            {new Date(record.confirmationDate).toLocaleString("vi-VN")}
          </p>
          <p>
            <strong>Trạng Thái:</strong> {record.status}
          </p>
          <p>
            <strong>Địa Chỉ Ký:</strong> {record.signAddress}
          </p>
          <p>
            <strong>Số Điện Thoại:</strong> {record.phoneNumber}
          </p>
          <p>
            <strong>Ghi Chú:</strong> {record.note}
          </p>
          <p>
            <strong>Tên:</strong> {record.name}
          </p>
        </div>
        <Button onClick={onClose}>Đóng</Button>
      </DialogContent>
    </Dialog>
  );
}
