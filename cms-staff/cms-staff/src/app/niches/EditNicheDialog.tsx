import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface NicheDtoForStaff {
  nicheId: number;
  nicheName: string;
  nicheDescription?: string;
  status?: string;
}

const EditNicheDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  nicheId: number | null;
  onSuccess: () => void;
}> = ({ open, onClose, nicheId, onSuccess }) => {
  const [niche, setNiche] = useState<NicheDtoForStaff | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicheDescription, setNicheDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (nicheId !== null) {
      const fetchNicheDetails = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/api/StaffNiches/${nicheId}`
          );
          setNiche(response.data);
          setNicheDescription(response.data.nicheDescription ?? "");
          setStatus(response.data.status ?? "");
        } catch (error) {
          toast.error("Unable to fetch niche details");
        } finally {
          setLoading(false);
        }
      };

      fetchNicheDetails();
    }
  }, [nicheId]);

  const handleSave = async () => {
    if (nicheId !== null) {
      try {
        await axiosInstance.put(`/api/StaffNiches/${nicheId}`, {
          nicheDescription,
          status,
        });
        toast.success("Cập nhật thông tin thành công");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error("Lỗi khi cập nhật");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sửa thông tin ô chứa</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          niche && (
            <Box>
              <TextField
                fullWidth
                label="Mô tả"
                value={nicheDescription}
                onChange={(e) => setNicheDescription(e.target.value)}
                margin="normal"
              />
              {status !== "Active" && status !== "Booked" && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as string)}
                    label="Trạng thái"
                  >
                    <MenuItem value="Unavailable">Không khả dụng</MenuItem>
                    <MenuItem value="Available">Còn trống</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNicheDialog;
