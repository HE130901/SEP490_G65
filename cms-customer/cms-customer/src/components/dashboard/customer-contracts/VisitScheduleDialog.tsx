"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VisitRegistrationAPI from "@/services/visitService";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface VisitScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedContainer: any;
}

export default function VisitScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  selectedContainer,
}: VisitScheduleDialogProps) {
  const { user, fetchVisitRegistrations } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accompanyingPeople, setAccompanyingPeople] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    console.log("Selected Container:", selectedContainer); // Debugging log
  }, [selectedContainer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      customerId: user.customerId,
      nicheId: selectedContainer.nicheId,
      visitDate: selectedDate.toISOString(),
      note,
      accompanyingPeople,
    };

    console.log("Form data being submitted:", data); // Debugging log

    try {
      const response = await VisitRegistrationAPI.create(data);
      console.log("API response:", response); // Debugging log
      if (user && user.customerId) {
        await fetchVisitRegistrations(user.customerId);
      }
      toast.success("Đăng ký lịch viếng thành công!");
      onSubmit();
      onClose();
    } catch (err) {
      console.error("API error:", err); // Debugging log
      toast.error("Đăng ký lịch viếng thất bại.");
      setError("Đăng ký lịch viếng thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đăng Ký Lịch Viếng Thăm</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Điền thông tin để đăng ký lịch viếng.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Ô Chứa"
              value={selectedContainer.nicheName}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <Box>
              <Typography gutterBottom>Ngày Giờ Viếng Thăm</Typography>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
                showTimeSelect
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                dateFormat="Pp"
                className="w-full"
                customInput={<TextField fullWidth />}
              />
            </Box>
            <TextField
              label="Số Người Đi Cùng"
              type="number"
              value={accompanyingPeople}
              onChange={(e) => setAccompanyingPeople(parseInt(e.target.value))}
              inputProps={{ min: 0, max: 20 }}
              fullWidth
              required
            />
            <TextField
              label="Ghi Chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            {error && <Typography color="error">{error}</Typography>}
          </Box>
          <DialogActions>
            <Button onClick={onClose} variant="outlined" disabled={loading}>
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
