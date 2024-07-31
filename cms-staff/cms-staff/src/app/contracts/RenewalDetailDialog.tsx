"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import renewalService from "@/services/renewalService";
import { useReactToPrint } from "react-to-print";

interface RenewalDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  renewalId: number | null;
}

const RenewalDetailDialog: React.FC<RenewalDetailDialogProps> = ({
  isOpen,
  onClose,
  renewalId,
}) => {
  const [renewalDetails, setRenewalDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  useEffect(() => {
    const fetchRenewalDetails = async () => {
      if (!renewalId) return;

      setLoading(true);
      try {
        const data = await renewalService.getRenewalById(renewalId);
        setRenewalDetails(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching renewal details:", err);
        setError("Không thể tải thông tin chi tiết của gia hạn.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRenewalDetails();
    }
  }, [isOpen, renewalId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading || !renewalDetails) {
    return;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Chi tiết gia hạn hợp đồng</DialogTitle>
      <DialogContent dividers>
        <Box ref={contentRef} p={3}>
          <Typography variant="h4" align="center" gutterBottom>
            GIA HẠN HỢP ĐỒNG GỬI GIỮ TRO CỐT
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Mã gia hạn: {renewalDetails.contractRenewCode}
          </Typography>
          <Typography variant="body1" align="left" gutterBottom>
            Hôm nay, ngày {new Date().toLocaleDateString("vi-VN")}, tại An Bình
            Viên (Hòa Lạc) chúng tôi gồm có:
          </Typography>

          <Typography variant="h6" gutterBottom>
            BÊN A: Công ty An Bình Viên
          </Typography>
          <Typography>Điện thoại: 0999.999.999</Typography>
          <Typography>Địa chỉ: Hòa Lạc - Hà Nội</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            BÊN B: {renewalDetails.customerName}
          </Typography>
          <Typography>
            Đang sử dụng ô chứa tại: {renewalDetails.nicheAddress}
          </Typography>
          <Typography>
            Với mã hợp đồng: {renewalDetails.contractCode}
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 1: THỜI HẠN GIA HẠN
          </Typography>
          <Typography>
            Thời hạn gia hạn cho hợp đồng {renewalDetails.contractCode} từ ngày{" "}
            {new Date().toLocaleDateString("vi-VN")} đến ngày{" "}
            {new Date(renewalDetails.endDate).toLocaleDateString("vi-VN")}.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 2: CHI PHÍ GIA HẠN
          </Typography>
          <Typography>
            2.1. Chi phí gia hạn là{" "}
            {renewalDetails.totalAmount.toLocaleString()} VND, đã được thanh
            toán tại thời điểm ký gia hạn.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 3: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
          </Typography>
          <Typography>3.1. Bên A có trách nhiệm:</Typography>
          <Typography>Bảo quản tro cốt theo đúng cam kết.</Typography>
          <Typography>
            Thông báo cho Bên B về bất kỳ thay đổi liên quan đến dịch vụ gửi
            giữ.
          </Typography>
          <Typography>3.2. Bên B có trách nhiệm:</Typography>
          <Typography>
            Cung cấp đầy đủ thông tin và giấy tờ liên quan đến việc gửi giữ tro
            cốt.
          </Typography>
          <Typography>
            Thanh toán đầy đủ và đúng hạn các khoản phí đã thỏa thuận.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 4: ĐIỀU KHOẢN CHUNG
          </Typography>
          <Typography>
            Các điều khoản và điều kiện khác của gia hạn sẽ được thực hiện theo
            pháp luật hiện hành của Việt Nam. Mọi tranh chấp phát sinh từ gia
            hạn này sẽ được giải quyết thông qua thương lượng và hòa giải. Trong
            trường hợp không giải quyết được, các bên có quyền khởi kiện tại Tòa
            án có thẩm quyền.
          </Typography>

          <Box mt={4}>
            <Grid container>
              <Grid item xs={6}>
                <Typography>Đại diện Bên A</Typography>
                <Typography>Công ty An Bình Viên</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Đại diện Bên B</Typography>
                <Typography>{renewalDetails.customerName}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handlePrint} color="primary" variant="contained">
          In hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenewalDetailDialog;
