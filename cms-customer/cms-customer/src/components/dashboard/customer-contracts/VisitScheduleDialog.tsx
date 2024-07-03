// src/components/VisitScheduleDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { useStateContext } from "@/context/StateContext";
import { Button } from "@/components/ui/button";

export default function VisitScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedContainer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedContainer: any;
}) {
  const { user, fetchVisitRegistrations } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accompanyingPeople, setAccompanyingPeople] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      customerId: user.customerId,
      nicheId: selectedContainer.nicheId,
      visitDate: selectedDate.toISOString(),
      note: formData.get("note"),
      accompanyingPeople: accompanyingPeople,
    };

    try {
      await axiosInstance.post("/api/VisitRegistrations", data);
      if (user && user.customerId) {
        await fetchVisitRegistrations(user.customerId);
      }
      onSubmit();
      onClose();
    } catch (err) {
      setError("Đăng ký lịch viếng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đăng Ký Lịch Viếng Thăm</DialogTitle>
          <DialogDescription>
            Điền thông tin để đăng ký lịch viếng.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="containerId">Ô Chứa</Label>
              <Input
                id="containerId"
                name="containerId"
                value={selectedContainer.nicheName}
                readOnly
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="visitDateTime">Ngày Giờ Viếng Thăm</Label>
              <DatePicker
                id="visitDateTime"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
                showTimeSelect
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                dateFormat="Pp"
                className="w-full rounded border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="accompanyingPeople">Số Người Đi Cùng</Label>
            <Input
              id="accompanyingPeople"
              name="accompanyingPeople"
              type="number"
              min="0"
              max="20"
              value={accompanyingPeople}
              onChange={(e) => setAccompanyingPeople(parseInt(e.target.value))}
              required
              className="w-full"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="note">Ghi Chú</Label>
            <Textarea id="note" name="note" rows={3} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button variant="outline" onClick={onClose} disabled={loading}>
              Quay lại
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
