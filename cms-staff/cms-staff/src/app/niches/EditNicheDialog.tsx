// src/components/EditNicheDialog.tsx
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
        toast.success("Niche updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error("Unable to update niche");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Niche</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          niche && (
            <Box>
              <TextField
                fullWidth
                label="Niche Description"
                value={nicheDescription}
                onChange={(e) => setNicheDescription(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                margin="normal"
              />
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNicheDialog;
