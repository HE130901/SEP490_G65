"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { NicheReservation } from "./BookingRequestList";

type EditModalProps = {
  record: NicheReservation;
  onSave: (updatedRecord: NicheReservation) => void;
  onClose: () => void;
};

export default function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [updatedRecord, setUpdatedRecord] = useState(record);

  const handleChange = (field: keyof NicheReservation, value: any) => {
    setUpdatedRecord({ ...updatedRecord, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(updatedRecord);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Đơn Đặt Chỗ</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin đơn đặt chỗ</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="confirmationDate">Ngày Xác Nhận</Label>
            <Input
              type="datetime-local"
              value={new Date(updatedRecord.confirmationDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                handleChange("confirmationDate", new Date(e.target.value))
              }
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="signAddress">Địa Chỉ Ký</Label>
            <Input
              type="text"
              value={updatedRecord.signAddress}
              onChange={(e) => handleChange("signAddress", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="note">Ghi Chú</Label>
            <Textarea
              value={updatedRecord.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
