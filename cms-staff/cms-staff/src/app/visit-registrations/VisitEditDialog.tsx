// src/components/VisitEditDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { VisitDialogProps, VisitRegistrationDto } from "./interfaces";

const VisitEditDialog: React.FC<VisitDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  const [formData, setFormData] = useState<VisitRegistrationDto | null>(null);

  useEffect(() => {
    if (visit) {
      setFormData({ ...visit });
    }
  }, [visit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleSave = async () => {
    if (formData) {
      try {
        await axiosInstance.put(
          `/api/VisitRegistrations/${formData.visitId}`,
          formData
        );
        toast.success("Visit registration updated successfully");
        onClose();
      } catch (error) {
        toast.error("Failed to update visit registration");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Visit Registration</DialogTitle>
      <DialogContent>
        {formData && (
          <>
            <TextField
              margin="dense"
              label="Visit Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Accompanying People"
              type="number"
              fullWidth
              variant="outlined"
              name="accompanyingPeople"
              value={formData.accompanyingPeople}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Note"
              type="text"
              fullWidth
              variant="outlined"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitEditDialog;
