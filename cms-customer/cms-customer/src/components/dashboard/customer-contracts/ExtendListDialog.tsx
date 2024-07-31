import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  CircularProgress,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { format, addMonths } from "date-fns";
import { vi } from "date-fns/locale";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import { z } from "zod";
import { toast } from "react-toastify";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
];

const today = new Date();
const maxDate = addMonths(today, 1);

const appointmentSchema = z.object({
  appointmentDate: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      return date >= today && date <= maxDate;
    },
    {
      message:
        "Thời gian hẹn phải trong vòng 1 tháng kể từ thời điểm hiện tại.",
    }
  ),
  selectedAddress: z
    .string()
    .nonempty({ message: "Vui lòng chọn địa điểm ký hợp đồng." }),
});

interface ContractRenewalDto {
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

interface ExtendListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number | null;
  contractStatus: string | null;
}

export default function ExtendListDialog({
  isOpen,
  onClose,
  contractId,
  contractStatus,
}: ExtendListDialogProps) {
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(
    predefinedAddresses[0]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    appointmentDate?: string;
    selectedAddress?: string;
  }>({});
  const [renewals, setRenewals] = useState<ContractRenewalDto[]>([]);

  const handleExtend = async () => {
    try {
      appointmentSchema.parse({ appointmentDate, selectedAddress });

      const note = `Hẹn ký gia hạn hợp đồng tại ${selectedAddress} vào ngày ${formatDateToVietnamese(
        new Date(appointmentDate)
      )}`;

      setLoading(true);
      await axiosInstance.post(`/api/Contracts/renew`, {
        contractId,
        note,
        confirmationDate: new Date(appointmentDate).toISOString(),
        signAddress: selectedAddress,
      });
      toast.success("Đăng ký lịch hẹn gia hạn thành công.");
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          appointmentDate?: string;
          selectedAddress?: string;
        } = {};
        err.errors.forEach((error) => {
          if (error.path.includes("appointmentDate")) {
            fieldErrors.appointmentDate = error.message;
          } else if (error.path.includes("selectedAddress")) {
            fieldErrors.selectedAddress = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error extending contract:", err);
        toast.error("Không thể hẹn gia hạn hợp đồng.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateToVietnamese = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  useEffect(() => {
    if (isOpen && contractId) {
      const fetchRenewals = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/Contracts/${contractId}/renewals`
          );
          setRenewals(response.data.$values);
        } catch (error) {
          console.error("Error fetching contract renewals:", error);
        }
      };

      fetchRenewals();
    }
  }, [isOpen, contractId]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gia hạn hợp đồng</DialogTitle>
      <DialogContent dividers>
        {renewals.length === 0 ? (
          <></>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Lịch sử gia hạn mã hợp đồng: {renewals[0].contractCode}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">STT</TableCell>
                    <TableCell align="center">Mã HĐ gia hạn</TableCell>
                    <TableCell align="center">Ngày bắt đầu</TableCell>
                    <TableCell align="center">Ngày kết thúc</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Giá trị HĐ</TableCell>
                    <TableCell align="center">Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renewals.map((renewal, index) => (
                    <TableRow key={renewal.contractRenewalId}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">
                        {renewal.contractRenewCode}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateToVietnamese(new Date(renewal.createdDate))}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateToVietnamese(new Date(renewal.endDate))}
                      </TableCell>
                      <TableCell align="center">{renewal.status}</TableCell>
                      <TableCell align="center">
                        {renewal.amount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell align="center">{renewal.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {contractStatus === "NearlyExpired" || contractStatus === "Expired" ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={!!errors.selectedAddress}
              >
                <FormLabel component="legend">
                  Địa điểm hẹn ký gia hạn hợp đồng
                </FormLabel>
                <RadioGroup
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  {predefinedAddresses.map((address) => (
                    <FormControlLabel
                      key={address}
                      value={address}
                      control={<Radio />}
                      label={address}
                    />
                  ))}
                </RadioGroup>
                {errors.selectedAddress && (
                  <FormHelperText>{errors.selectedAddress}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày hẹn"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: format(today, "yyyy-MM-dd"),
                  max: format(maxDate, "yyyy-MM-dd"),
                }}
                error={!!errors.appointmentDate}
                helperText={errors.appointmentDate && errors.appointmentDate}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography mt={2} color="red">
            Hiện tại chưa đến thời gian có thể gia hạn hợp đồng.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        <Button
          onClick={handleExtend}
          variant="contained"
          color="primary"
          disabled={
            loading ||
            (contractStatus !== "NearlyExpired" && contractStatus !== "Expired")
          }
          startIcon={
            loading ? <CircularProgress size={20} /> : <HistorySharpIcon />
          }
        >
          Hẹn ký gia hạn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
