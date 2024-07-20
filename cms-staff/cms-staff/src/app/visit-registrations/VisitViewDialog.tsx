// src/components/VisitViewDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { VisitDialogProps } from "./interfaces";

const VisitViewDialog: React.FC<VisitDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>View Visit Registration</DialogTitle>
      <DialogContent>
        <Typography>Visit ID: {visit?.visitId}</Typography>
        <Typography>Customer Name: {visit?.customerName}</Typography>
        <Typography>Staff Name: {visit?.staffName}</Typography>
        <Typography>Niche Address: {visit?.nicheAddress}</Typography>
        <Typography>
          Created Date: {new Date(visit?.createdDate || "").toLocaleString()}
        </Typography>
        <Typography>
          Visit Date: {new Date(visit?.visitDate || "").toLocaleString()}
        </Typography>
        <Typography>Status: {visit?.status}</Typography>
        <Typography>
          Accompanying People: {visit?.accompanyingPeople}
        </Typography>
        <Typography>Note: {visit?.note}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitViewDialog;
