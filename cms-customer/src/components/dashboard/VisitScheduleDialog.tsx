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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VisitScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  containers = [], // Default to an empty array if not provided
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đăng Ký Lịch Viếng Thăm</DialogTitle>
          <DialogDescription>
            Điền thông tin để đăng ký lịch viếng.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              containerName: formData.get("containerName"),
              visitDateTime: formData.get("visitDateTime"),
              note: formData.get("note"),
            };
            onSubmit(data);
            e.target.reset();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="containerName">Ô Chứa</Label>
              <Select id="containerName" name="containerName">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ô chứa" />
                </SelectTrigger>
                <SelectContent>
                  {containers.length > 0 ? (
                    containers.map((container) => (
                      <SelectItem
                        key={container.nicheId}
                        value={container.nicheName}
                      >
                        {container.nicheName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Không có dữ liệu</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="visitDateTime">Ngày Giờ Viếng Thăm</Label>
              <Input
                id="visitDateTime"
                name="visitDateTime"
                type="datetime-local"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="note">Ghi Chú</Label>
            <Textarea id="note" name="note" rows={3} />
          </div>
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
