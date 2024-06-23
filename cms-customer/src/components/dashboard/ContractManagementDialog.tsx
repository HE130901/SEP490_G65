"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContractManagementDialog({
  isOpen,
  onClose,
  onSubmit,
  container,
  action,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action === "extend" ? "Gia Hạn Hợp Đồng" : "Thanh Lý Hợp Đồng"}
          </DialogTitle>
          <DialogDescription>
            {action === "extend"
              ? "Điền thông tin để gia hạn hợp đồng."
              : "Điền thông tin để thanh lý hợp đồng."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              containerName: container.name,
              extendedDate:
                action === "extend" ? formData.get("extendedDate") : undefined,
              terminatedDate:
                action === "terminate"
                  ? formData.get("terminatedDate")
                  : undefined,
            };
            onSubmit(data);
            e.target.reset();
          }}
        >
          {action === "extend" && (
            <div className="mt-4">
              <Label htmlFor="extendedDate">Ngày Gia Hạn</Label>
              <Input id="extendedDate" name="extendedDate" type="date" />
            </div>
          )}
          {action === "terminate" && (
            <div className="mt-4">
              <Label htmlFor="terminatedDate">Ngày Thanh Lý</Label>
              <Input id="terminatedDate" name="terminatedDate" type="date" />
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="submit">Lưu</Button>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
