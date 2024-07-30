import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import contractService from "@/services/contractService";
import RenewalListDialog from "./RenewalList";
import { SelectChangeEvent } from "@mui/material";

const formatDateToYYYYMMDD = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatDateToDDMMYYYY = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const calculateNewEndDate = (
  startDate: string,
  duration: string,
  type: string
): string => {
  if (!startDate || !duration || isNaN(parseInt(duration, 10))) return "N/A";

  const date = new Date(startDate);
  if (type === "Gửi theo tháng") {
    date.setMonth(date.getMonth() + parseInt(duration, 10));
  } else if (type === "Gửi theo năm") {
    date.setFullYear(date.getFullYear() + parseInt(duration, 10));
  }

  if (isNaN(date.getTime())) return "N/A";

  return formatDateToYYYYMMDD(date);
};

const calculateCost = (type: string, duration: number): number => {
  if (type === "Gửi theo tháng") {
    return duration * 200000;
  } else if (type === "Gửi theo năm") {
    if (duration <= 2) return 2000000;
    if (duration <= 5) return 3500000;
    if (duration <= 9) return 5000000;
    return 7000000;
  }
  return 0;
};

const RenewalDialog: React.FC<any> = ({ open, handleClose, contractId }) => {
  const [contract, setContract] = useState<any | null>(null);
  const [duration, setDuration] = useState<string>("");
  const [renewalDate, setRenewalDate] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [listDialogOpen, setListDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchContract = async () => {
      if (contractId) {
        const fetchedContract = await contractService.getContractById(
          contractId
        );
        setContract(fetchedContract);
        setRenewalDate(fetchedContract.endDate);
      }
    };
    fetchContract();
  }, [contractId]);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDuration(value);
    if (type) {
      setNewEndDate(calculateNewEndDate(renewalDate, value, type));
      setCost(calculateCost(type, parseInt(value, 10)));
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setType(value);
    if (duration) {
      setNewEndDate(calculateNewEndDate(renewalDate, duration, value));
      setCost(calculateCost(value, parseInt(duration, 10)));
    }
  };

  const handleRenewalDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setRenewalDate(value);
    if (type && duration) {
      setNewEndDate(calculateNewEndDate(value, duration, type));
    }
  };

  const handleSubmit = async () => {
    if (contract) {
      try {
        const formattedNewEndDate = formatDateToYYYYMMDD(new Date(newEndDate));
        if (formattedNewEndDate === "N/A") {
          console.error("Ngày kết thúc mới không hợp lệ");
          return;
        }

        const response = await contractService.renewContract(
          contract.contractId,
          formattedNewEndDate,
          cost
        );
        handleClose();
      } catch (error) {
        console.error("Failed to renew contract:", error);
      }
    }
  };

  const handleOpenListDialog = () => {
    setListDialogOpen(true);
  };

  const handleCloseListDialog = () => {
    setListDialogOpen(false);
  };

  if (!contract) {
    return null;
  }

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
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Gia Hạn Hợp Đồng</span>
            <Button
              onClick={handleOpenListDialog}
              color="secondary"
              variant="outlined"
            >
              Lịch sử gia hạn
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="body1">
              <strong>Mã hợp đồng:</strong> {contract.contractCode}
            </Typography>
            <Typography variant="body1">
              <strong>Ngày bắt đầu:</strong>{" "}
              {formatDateToDDMMYYYY(contract.startDate)}
            </Typography>
            <Typography variant="body1">
              <strong>Ngày kết thúc:</strong>{" "}
              {formatDateToDDMMYYYY(contract.endDate)}
            </Typography>
            <Typography variant="body1">
              <strong>Trạng thái HĐ hiện tại:</strong>
              <Chip
                label={getStatusLabel(contract.status).label}
                color={getStatusLabel(contract.status).color}
                size="small"
              />
            </Typography>
          </Box>
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>Loại Gia Hạn</InputLabel>
              <Select
                value={type}
                onChange={handleTypeChange}
                label="Loại Gia Hạn"
              >
                <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mt={2}>
            <TextField
              label="Thời gian (tháng hoặc năm)"
              type="number"
              value={duration}
              onChange={handleDurationChange}
              fullWidth
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Ngày bắt đầu"
              type="date"
              value={renewalDate}
              onChange={handleRenewalDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Ngày kết thúc mới:</strong>{" "}
              {newEndDate ? formatDateToDDMMYYYY(newEndDate) : "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Chi phí:</strong> {cost.toLocaleString()} VND
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Đóng
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <RenewalListDialog
        open={listDialogOpen}
        handleClose={handleCloseListDialog}
        contractId={contractId}
      />
    </>
  );
};

export default RenewalDialog;
