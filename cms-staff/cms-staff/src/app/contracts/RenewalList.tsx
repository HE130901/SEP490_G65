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
} from "@mui/material";
import contractService from "@/services/contractService";

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

  useEffect(() => {
    const fetchRenewals = async () => {
      if (contractId) {
        try {
          const response = await contractService.getRenewalByContractId(
            contractId
          );
          // Đảm bảo response không bị undefined hoặc lỗi
          setRenewals(response.$values || []);
        } catch (error) {
          console.error("Error fetching contract renewals:", error);
          setRenewals([]); // Cài đặt danh sách rỗng nếu có lỗi
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
                  <TableCell>Mã Gia hạn</TableCell>
                  <TableCell>Ngày bắt đầu </TableCell>
                  <TableCell>Ngày kết thúc </TableCell>
                  <TableCell>Còn lại (ngày) </TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renewals.map((renewal) => (
                  <TableRow key={renewal.contractRenewalId}>
                    <TableCell>{renewal.contractRenewCode}</TableCell>
                    <TableCell>{renewal.startDate}</TableCell>
                    <TableCell>{renewal.endDate}</TableCell>
                    <TableCell>{calculateDaysLeft(renewal.endDate)}</TableCell>
                    <TableCell>{renewal.amount.toLocaleString()} VND</TableCell>
                    <TableCell>
                      {" "}
                      <Chip
                        label={getStatusLabel(renewal.status).label}
                        color={getStatusLabel(renewal.status).color}
                        size="small"
                      />
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
    </Dialog>
  );
};

export default RenewalListDialog;
