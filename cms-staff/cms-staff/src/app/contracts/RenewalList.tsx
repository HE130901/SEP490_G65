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
} from "@mui/material";
import contractService from "@/services/contractService";

interface Renewal {
  contractId: number;
  contractRenewalId: number;
  contractCode: string;
  contractRenewCode: string;
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
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renewals.map((renewal) => (
                  <TableRow key={renewal.contractRenewalId}>
                    <TableCell>{renewal.contractRenewCode}</TableCell>
                    <TableCell>{renewal.endDate}</TableCell>
                    <TableCell>{renewal.amount.toLocaleString()} VND</TableCell>
                    <TableCell>{renewal.note}</TableCell>
                    <TableCell>{renewal.status}</TableCell>
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
