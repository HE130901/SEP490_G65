// src/components/ViewNicheDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface NicheHistoryDto {
  contractId: number;
  startDate: string;
  endDate: string;
}

interface NicheDtoForStaff {
  nicheId: number;
  nicheName: string;
  customerName?: string;
  deceasedName?: string;
  nicheHistories: { $values: NicheHistoryDto[] };
  status?: string;
}

const ViewNicheDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  nicheId: number | null;
}> = ({ open, onClose, nicheId }) => {
  const [niche, setNiche] = useState<NicheDtoForStaff | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nicheId !== null) {
      const fetchNicheDetails = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/api/StaffNiches/${nicheId}`
          );
          setNiche(response.data);
        } catch (error) {
          toast.error("Unable to fetch niche details");
        } finally {
          setLoading(false);
        }
      };

      fetchNicheDetails();
    }
  }, [nicheId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Niche Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          niche && (
            <Box>
              <Typography variant="h6">
                Niche Name: {niche.nicheName}
              </Typography>
              <Typography>
                Customer Name: {niche.customerName ?? "N/A"}
              </Typography>
              <Typography>
                Deceased Name: {niche.deceasedName ?? "N/A"}
              </Typography>
              <Typography>Status: {niche.status ?? "N/A"}</Typography>
              <Typography variant="h6" mt={2}>
                Contract History:
              </Typography>
              {niche.nicheHistories.$values.length > 0 ? (
                niche.nicheHistories.$values.map((history) => (
                  <Box key={history.contractId} mb={1}>
                    <Typography>Contract ID: {history.contractId}</Typography>
                    <Typography>Start Date: {history.startDate}</Typography>
                    <Typography>End Date: {history.endDate}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No history</Typography>
              )}
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewNicheDialog;
