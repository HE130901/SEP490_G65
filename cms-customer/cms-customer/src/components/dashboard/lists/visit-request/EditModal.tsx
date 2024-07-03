"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { VisitRegistration } from "./VisitRegistrationList";

type EditModalProps = {
  record: VisitRegistration;
  onSave: (updatedRecord: VisitRegistration) => void;
  onClose: () => void;
};

const EditModal = ({ record, onSave, onClose }: EditModalProps) => {
  const [updatedRecord, setUpdatedRecord] = useState(record);

  const handleChange = (field: keyof VisitRegistration, value: any) => {
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
          <DialogTitle>Chỉnh sửa Đơn đăng ký viếng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ngày Hẹn</label>
            <input
              type="datetime-local"
              value={new Date(updatedRecord.visitDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                handleChange("visitDate", new Date(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Số Người Đi Cùng</label>
            <input
              type="number"
              value={updatedRecord.accompanyingPeople}
              onChange={(e) =>
                handleChange("accompanyingPeople", parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ghi Chú</label>
            <textarea
              value={updatedRecord.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
