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
  Box,
} from "@mui/material";
import NicheAPI from "@/services/nicheService";
import { toast } from "react-toastify";

interface Niche {
  nicheId: number;
  nicheName: string;
}

interface SelectNicheAndDateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nicheID: number, orderDate: string) => void;
}

const SelectNicheAndDateDialog: React.FC<SelectNicheAndDateDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nicheID, setNicheID] = useState<number>(1); // Default niche ID
  const [orderDate, setOrderDate] = useState<string>("");
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const response = await NicheAPI.getNichesForCustomer();
        setNiches(response.data.$values); // Extract niches from $values
      } catch (error) {
        toast.error("Failed to fetch niches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNiches();
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(nicheID, orderDate);
    toast.success("Đặt đơn hàng thành công!");
    onClose();
  };

  const handleClose = () => {
    setNicheID(1);
    setOrderDate("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Chọn ô chứa và ngày hẹn</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="150px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              select
              label="Ô chứa"
              value={nicheID}
              onChange={(e) => setNicheID(Number(e.target.value))}
              fullWidth
              margin="normal"
            >
              {niches.map((niche) => (
                <MenuItem key={niche.nicheId} value={niche.nicheId}>
                  {niche.nicheName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Ngày hẹn"
              type="datetime-local"
              fullWidth
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Hủy bỏ
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectNicheAndDateDialog;
