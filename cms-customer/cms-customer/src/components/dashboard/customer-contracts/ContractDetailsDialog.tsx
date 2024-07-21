import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Grid,
  Tooltip,
} from "@mui/material";
import ContractAPI from "@/services/contractService";
import ExtendContractDialog from "./ContractRenewalDialog";
import LiquidateContractDialog from "./ContractTerminationDialog";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import DeleteIcon from "@mui/icons-material/Delete";

interface ContractDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number | null;
}

export default function ContractDetailsDialog({
  isOpen,
  onClose,
  contractId,
}: ContractDetailDialogProps) {
  const [contractDetails, setContractDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExtendDialogOpen, setExtendDialogOpen] = useState(false);
  const [isLiquidateDialogOpen, setLiquidateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const response = await ContractAPI.getContractDetail(contractId);
        console.log("API response:", response.data);
        setContractDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Không thể tải thông tin chi tiết của hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchContractDetails();
    }
  }, [isOpen, contractId]);

  const handleExtendClick = () => {
    console.log("Extend button clicked");
    setExtendDialogOpen(true);
  };

  const handleLiquidateClick = () => {
    console.log("Liquidate button clicked");
    setLiquidateDialogOpen(true);
  };

  if (!contractDetails) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Chi tiết hợp đồng</DialogTitle>
      <DialogContent className="a4-size">
        <Box p={3} className="print-a4">
          <Typography variant="h4" align="center" gutterBottom>
            HỢP ĐỒNG GỬI GIỮ TRO CỐT
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Mã hợp đồng: {contractDetails.contractId}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Ngày tháng: {contractDetails.startDate}
          </Typography>

          <Typography variant="h6" gutterBottom>
            BÊN A: Công ty An Bình Viên
          </Typography>
          <Typography>Địa chỉ: Hòa Lạc - Hà Nội</Typography>
          <Typography>Điện thoại: 0999.999.999</Typography>
          <Typography>Đại diện bởi: {contractDetails.staffName}</Typography>
          <Typography>Chức vụ: Nhân viên</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            BÊN B: {contractDetails.customerName}
          </Typography>
          <Typography>Địa chỉ: {contractDetails.customerAddress}</Typography>
          <Typography>
            Số điện thoại: {contractDetails.customerPhone}
          </Typography>
          <Typography>
            CMND/CCCD: {contractDetails.customerCitizenID}
          </Typography>
          <Typography>
            Ngày cấp: {contractDetails.citizenIdissuanceDate}
          </Typography>
          <Typography>Nơi cấp: {contractDetails.citizenIdsupplier}</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 1: MỤC ĐÍCH VÀ PHẠM VI HỢP ĐỒNG
          </Typography>
          <Typography>
            Hợp đồng này nhằm mục đích quy định việc gửi giữ tro cốt của{" "}
            {contractDetails.deceasedName} giữa Bên A và Bên B.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 2: THỜI HẠN GỬI GIỮ
          </Typography>
          <Typography>
            Thời hạn gửi giữ tro cốt là XX
            {contractDetails.type === "Gửi theo tháng" ? "tháng" : "năm"}, kể từ
            ngày {contractDetails.startDate} đến ngày {contractDetails.endDate}.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 3: DỊCH VỤ VÀ CHI PHÍ
          </Typography>
          <Typography>
            3.1. Bên A sẽ cung cấp dịch vụ gửi giữ tro cốt tại An Bình Viên (Hòa
            Lạc).
          </Typography>
          <Typography>
            3.2. Chi phí dịch vụ là{" "}
            {contractDetails.totalAmount
              ? contractDetails.totalAmount.toLocaleString()
              : 0}
            VND. Đã được thanh toán tại thời điểm ký hợp đồng.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
          </Typography>
          <Typography>4.1. Bên A có trách nhiệm:</Typography>
          <Typography>Bảo quản tro cốt theo đúng cam kết.</Typography>
          <Typography>
            Thông báo cho Bên B về bất kỳ thay đổi liên quan đến dịch vụ gửi
            giữ.
          </Typography>
          <Typography>4.2. Bên B có trách nhiệm:</Typography>
          <Typography>
            Cung cấp đầy đủ thông tin và giấy tờ liên quan đến việc gửi giữ tro
            cốt.
          </Typography>
          <Typography>
            Thanh toán đầy đủ và đúng hạn các khoản phí đã thỏa thuận.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 5: ĐIỀU KHOẢN CHUNG
          </Typography>
          <Typography>
            Các điều khoản và điều kiện khác của hợp đồng sẽ được thực hiện theo
            pháp luật hiện hành của Việt Nam. Mọi tranh chấp phát sinh từ hợp
            đồng này sẽ được giải quyết thông qua thương lượng và hòa giải.
            Trong trường hợp không giải quyết được, các bên có quyền khởi kiện
            tại Tòa án có thẩm quyền.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 6: KÝ KẾT HỢP ĐỒNG
          </Typography>
          <Typography>
            Hợp đồng này được lập thành hai bản có giá trị pháp lý như nhau, mỗi
            bên giữ một bản và có hiệu lực kể từ ngày ký.
          </Typography>

          <Box mt={4}>
            <Grid container>
              <Grid item xs={6}>
                <Typography>Đại diện Bên A</Typography>
                <Typography>{contractDetails.staffName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Đại diện Bên B</Typography>
                <Typography>{contractDetails.customerName}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" gutterBottom mt={4}>
            Ghi chú
          </Typography>
          {contractDetails.note}
        </Box>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Gia hạn hợp đồng">
          <Button onClick={handleExtendClick} disabled={loading}>
            <HistorySharpIcon /> Gia hạn
          </Button>
        </Tooltip>
        <Tooltip title="Thanh lý hợp đồng">
          <Button onClick={handleLiquidateClick} disabled={loading}>
            <DeleteIcon /> Thanh lý
          </Button>
        </Tooltip>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
      <ExtendContractDialog
        isOpen={isExtendDialogOpen}
        onClose={() => {
          console.log("Closing Extend Contract Dialog");
          setExtendDialogOpen(false);
        }}
        contractId={contractId}
      />
      <LiquidateContractDialog
        isOpen={isLiquidateDialogOpen}
        onClose={() => {
          console.log("Closing Liquidate Contract Dialog");
          setLiquidateDialogOpen(false);
        }}
        contractId={contractId}
      />
    </Dialog>
  );
}
