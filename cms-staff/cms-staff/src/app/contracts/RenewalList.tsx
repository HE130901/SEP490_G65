import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import contractService from "@/services/contractService";
import RenewalDetailDialog from "./RenewalDetailDialog";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
interface Renewal {
  contractId: number;
  contractRenewalId: number;
  contractCode: string;
  contractRenewCode: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  status: string;
  amount: number;
  note: string;
}

interface RenewalListDialogProps {
  open: boolean;
  handleClose: () => void;
  contractId: number;
}

const RenewalListDialog: React.FC<RenewalListDialogProps> = ({
  open,
  handleClose,
  contractId,
}) => {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [selectedRenewalId, setSelectedRenewalId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchRenewals = async () => {
      if (contractId) {
        try {
          const response = await contractService.getRenewalByContractId(
            contractId
          );
          setRenewals(response.$values || []);
        } catch (error) {
          console.error("Error fetching contract renewals:", error);
          setRenewals([]);
        }
      }
    };

    fetchRenewals();
  }, [contractId]);

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(daysLeft, 0);
  };

  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  const getStatusLabel = (
    status: string
  ): {
    label: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
  } => {
    switch (status) {
      case "Canceled":
        return { label: "Đã thanh lý", color: "error" };
      case "Expired":
        return { label: "Đã hết hạn", color: "error" };
      case "Active":
        return { label: "Còn hiệu lực", color: "success" };
      case "Extended":
        return { label: "Đã gia hạn", color: "success" };
      case "NearlyExpired":
        return { label: "Gần hết hạn", color: "warning" };
      case "PendingRenewal":
        return { label: "Chờ gia hạn", color: "warning" };
      case "PendingCancellation":
        return { label: "Chờ thanh lý", color: "warning" };
      default:
        return { label: status, color: "default" };
    }
  };

  const handleViewDetails = (renewalId: number) => {
    setSelectedRenewalId(renewalId);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Danh Sách Hợp Đồng Gia Hạn</DialogTitle>
      <DialogContent>
        {renewals.length === 0 ? (
          <Typography variant="body1">
            Không có gia hạn nào cho hợp đồng này.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Mã Gia hạn</TableCell>
                  <TableCell align="center">Ngày bắt đầu</TableCell>
                  <TableCell align="center">Ngày kết thúc</TableCell>
                  <TableCell align="center">Còn lại (ngày)</TableCell>
                  <TableCell align="center">Số tiền</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renewals.map((renewal) => (
                  <TableRow key={renewal.contractRenewalId}>
                    <TableCell align="center">
                      {renewal.contractRenewCode}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateToDDMMYYYY(renewal.createdDate)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDateToDDMMYYYY(renewal.endDate)}
                    </TableCell>
                    <TableCell align="center">
                      {calculateDaysLeft(renewal.endDate)}
                    </TableCell>
                    <TableCell align="center">
                      {renewal.amount.toLocaleString()} VND
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(renewal.status).label}
                        color={getStatusLabel(renewal.status).color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleViewDetails(renewal.contractRenewalId)
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Đóng
        </Button>
      </DialogActions>

      <RenewalDetailDialog
        isOpen={!!selectedRenewalId}
        onClose={() => setSelectedRenewalId(null)}
        renewalId={selectedRenewalId}
      />
    </Dialog>
  );
};

export default RenewalListDialog;
