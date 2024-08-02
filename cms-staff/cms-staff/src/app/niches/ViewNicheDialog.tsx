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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import ContractDetailsDialog from "@/app/contracts/ContractDetail";
import { Visibility } from "@mui/icons-material";

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
  status: string;
}

function formatDate(dateString: any) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

const ViewNicheDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  nicheId: number | null;
}> = ({ open, onClose, nicheId }) => {
  const [niche, setNiche] = useState<NicheDtoForStaff | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const [contractDialogOpen, setContractDialogOpen] = useState(false);

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Active":
        return { label: "Đang hoạt động", color: "info" };
      case "Unavailable":
        return { label: "Không khả dụng", color: "default" };
      case "Available":
        return { label: "Còn trống", color: "success" };
      case "Booked":
        return { label: "Đã được đặt", color: "warning" };
      default:
        return { label: status, color: "default" };
    }
  };

  const handleOpenContractDialog = (contractId: number) => {
    setSelectedContractId(contractId);
    setContractDialogOpen(true);
  };

  const handleCloseContractDialog = () => {
    setContractDialogOpen(false);
    setSelectedContractId(null);
  };

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
              <Typography>
                Trạng thái ô chứa:{" "}
                <Chip
                  label={getStatusLabel(niche.status).label}
                  color={
                    getStatusLabel(niche.status).color as
                      | "info"
                      | "error"
                      | "primary"
                      | "secondary"
                      | "success"
                      | "warning"
                      | "default"
                  }
                />
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mt={2}>
                Lịch sử hợp đồng:
              </Typography>
              {niche.nicheHistories.$values.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Mã hợp đồng</TableCell>
                        <TableCell align="center">Ngày bắt đầu</TableCell>
                        <TableCell align="center">Ngày kết thúc</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {niche.nicheHistories.$values.map((history) => (
                        <TableRow key={history.contractId}>
                          <TableCell align="center">
                            {history.contractCode}
                          </TableCell>
                          <TableCell align="center">
                            {formatDate(history.startDate)}
                          </TableCell>
                          <TableCell align="center">
                            {formatDate(history.endDate)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleOpenContractDialog(history.contractId)
                              }
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
      {selectedContractId !== null && (
        <ContractDetailsDialog
          isOpen={contractDialogOpen}
          onClose={handleCloseContractDialog}
          contractId={selectedContractId}
        />
      )}
    </Dialog>
  );
};

export default ViewNicheDialog;
