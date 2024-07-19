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
import VisitAPI from "@/services/visitService"; // Import the service to fetch niches
import { toast } from "react-toastify";
import { useStateContext } from "@/context/StateContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Niche {
  nicheId: number;
  nicheName: string;
}

interface VisitScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const VisitScheduleDialog: React.FC<VisitScheduleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user, fetchVisitRegistrations } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [nicheLoading, setNicheLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accompanyingPeople, setAccompanyingPeople] = useState(0);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [nicheID, setNicheID] = useState<number | "">(1);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      customerId: user.customerId,
      nicheId: nicheID,
      visitDate: selectedDate.toISOString(),
      note: (e.target as any).note.value,
      accompanyingPeople: accompanyingPeople,
    };

    console.log("[VisitScheduleDialog] Submitting visit schedule:", data);

    try {
      await VisitAPI.create(data);
      toast.success("Đăng ký lịch viếng thành công!"); // Success notification
      console.log(
        "[VisitScheduleDialog] Visit schedule submitted successfully"
      );
      if (user && user.customerId) {
        await fetchVisitRegistrations(user.customerId);
        console.log(
          "[VisitScheduleDialog] Fetching updated visit registrations"
        );
      }
      onSubmit();
      onClose();
    } catch (err) {
      console.error("[VisitScheduleDialog] Error registering visit:", err);
      setError("Đăng ký lịch viếng thất bại.");
      toast.error("Đăng ký lịch viếng thất bại."); // Failure notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đăng Ký Lịch Viếng Thăm</DialogTitle>
      <DialogContent>
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
                  {niche.nicheName}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Ngày hẹn"
            type="datetime-local"
            fullWidth
            value={selectedDate.toISOString().slice(0, 16)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            label="Số Người Đi Cùng"
            type="number"
            fullWidth
            value={accompanyingPeople}
            onChange={(e) => setAccompanyingPeople(parseInt(e.target.value))}
            margin="normal"
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
