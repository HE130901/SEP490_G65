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
  contractCode: string;
  startDate: string;
  endDate: string;
}

interface NicheDtoForStaff {
  nicheId: number;
  nicheName: string;
  nicheCode: string;
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thông tin ô chứa</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          niche && (
            <Box>
              <Typography variant="h6">Mã ô chứa: {niche.nicheCode}</Typography>
              <Typography>
                Tên khách hàng: {niche.customerName ?? "N/A"}
              </Typography>
              <Typography>
                Tên người quá cố: {niche.deceasedName ?? "N/A"}
              </Typography>
              <Typography>Trạng thái: {niche.status ?? "N/A"}</Typography>
              <Typography variant="h6" mt={2}>
                Lịch sử hợp đồng:
              </Typography>
              {niche.nicheHistories.$values.length > 0 ? (
                niche.nicheHistories.$values.map((history) => (
                  <Box key={history.contractId} mb={1}>
                    <Typography>
                      Mã hợp đồng : {history.contractCode}
                    </Typography>
                    <Typography>Ngày bắt đầu: {history.startDate}</Typography>
                    <Typography>Ngày kết thúc: {history.endDate}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>Không có lịch sử</Typography>
              )}
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewNicheDialog;
