"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/api/axios-config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { useStateContext } from "@/context/state-context";

export default function VisitScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  containers = [],
}) {
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accompanyingPeople, setAccompanyingPeople] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = {
      customerId: user.customerId, // Use the actual customer ID
      nicheId: formData.get("containerId"),
      visitDate: selectedDate.toISOString(),
      note: formData.get("note"),
      accompanyingPeople: accompanyingPeople,
    };

    try {
      await axiosInstance.post("/api/VisitRegistrations", data);
      setLoading(false);
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error("Error registering visit:", err);
      setError("Đăng ký lịch viếng thất bại.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
              <Select id="containerId" name="containerId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ô chứa" />
                </SelectTrigger>
                <SelectContent>
                  {containers.length > 0 ? (
                    containers.map((container) => (
                      <SelectItem
                        key={container.nicheId}
                        value={container.nicheId.toString()}
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
              <DatePicker
                id="visitDateTime"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Ensure the date is at least tomorrow
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
              max="20" // Validate maximum number of accompanying people
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
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
