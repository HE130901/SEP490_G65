"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import NicheAPI from "@/services/nicheService";
import VisitAPI from "@/services/visitService";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "@/context/StateContext";
import { z } from "zod";
import { addMonths, format } from "date-fns";

interface Niche {
  nicheId: number;
  nicheAddress: string;
}

interface VisitScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const today = new Date();
const maxDate = addMonths(today, 3);

const visitSchema = z.object({
  appointmentDate: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      return date >= today && date <= maxDate;
    },
    {
      message:
        "Thời gian hẹn phải trong vòng 3 tháng kể từ thời điểm hiện tại.",
    }
  ),
  accompanyingPeople: z
    .number()
    .min(0, "Số người đi cùng phải lớn hơn hoặc bằng 0."),
  note: z.string().optional(),
});

const VisitScheduleDialog: React.FC<VisitScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user, fetchVisitRegistrations } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [nicheLoading, setNicheLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [accompanyingPeople, setAccompanyingPeople] = useState(0);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [nicheID, setNicheID] = useState<number | "">(1);
  const [formErrors, setFormErrors] = useState<{
    appointmentDate?: string;
    accompanyingPeople?: string;
  }>({});

  useEffect(() => {
    const fetchNiches = async () => {
      setNicheLoading(true);
      try {
        const response = await NicheAPI.getNichesForCustomer();
        setNiches(response.data.$values);
      } catch (error) {
        toast.error("Failed to fetch niches. Please try again later.");
      } finally {
        setNicheLoading(false);
      }
    };

    if (isOpen) {
      fetchNiches();
    }
  }, [isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDate = new Date(e.target.value);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setSelectedDate(utcDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      customerId: user.customerId,
      nicheId: nicheID,
      visitDate: selectedDate,
      note: (e.target as any).note.value,
      accompanyingPeople: accompanyingPeople,
    };

    try {
      visitSchema.parse({
        appointmentDate: data.visitDate,
        accompanyingPeople: data.accompanyingPeople,
      });
      await VisitAPI.create(data);
      toast.success("Đăng ký lịch viếng thành công!");
      if (user && user.customerId) {
        await fetchVisitRegistrations(user.customerId);
      }
      onSubmit();
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          appointmentDate?: string;
          accompanyingPeople?: string;
        } = {};
        err.errors.forEach((error) => {
          if (error.path.includes("appointmentDate")) {
            fieldErrors.appointmentDate = error.message;
          } else if (error.path.includes("accompanyingPeople")) {
            fieldErrors.accompanyingPeople = error.message;
          }
        });
        setFormErrors(fieldErrors);
      } else {
        console.error("[VisitScheduleDialog] Error registering visit:", err);
        setError("Đăng ký lịch viếng thất bại.");
        toast.error("Đăng ký lịch viếng thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đăng Ký Lịch Viếng Thăm</DialogTitle>
      <DialogContent>
        <ToastContainer position="bottom-right" />
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Ô chứa"
            value={nicheID}
            onChange={(e) => setNicheID(Number(e.target.value))}
            fullWidth
            margin="normal"
            disabled={nicheLoading}
          >
            {nicheLoading ? (
              <MenuItem disabled value="">
                <CircularProgress size={24} />
              </MenuItem>
            ) : (
              niches.map((niche) => (
                <MenuItem key={niche.nicheId} value={niche.nicheId}>
                  {niche.nicheAddress}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Ngày hẹn"
            type="datetime-local"
            fullWidth
            value={selectedDate ? selectedDate.slice(0, 16) : ""}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!formErrors.appointmentDate}
            helperText={formErrors.appointmentDate}
            inputProps={{
              min: format(today, "yyyy-MM-dd'T'HH:mm"),
              max: format(maxDate, "yyyy-MM-dd'T'HH:mm"),
            }}
          />
          <TextField
            label="Số Người Đi Cùng"
            type="number"
            fullWidth
            value={accompanyingPeople}
            onChange={(e) => setAccompanyingPeople(parseInt(e.target.value))}
            margin="normal"
            error={!!formErrors.accompanyingPeople}
            helperText={formErrors.accompanyingPeople}
          />
          <TextField
            label="Ghi Chú"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            name="note"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <DialogActions>
            <Button onClick={onClose} color="primary" disabled={loading}>
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VisitScheduleDialog;
