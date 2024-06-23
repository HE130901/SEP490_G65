"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ContainerDetailsDialog({ isOpen, onClose, container }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chi Tiết Ô Chứa</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-md font-bold mb-1">Thông Tin Người Đã Mất</h4>
            <p>{container?.deceasedInfo}</p>
          </div>
          <div>
            <h4 className="text-md font-bold mb-1">Thông Tin Hợp Đồng</h4>
            <p>{container?.contractInfo}</p>
          </div>
          <div>
            <h4 className="text-md font-bold mb-1">Thông Tin Dịch Vụ Đã Đặt</h4>
            <p>{container?.serviceInfo}</p>
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
}
