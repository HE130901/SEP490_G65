"use client";
import ContractAPI from "@/services/contractService";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const data = await ContractAPI.getContractById(contractId);
        console.log("API response:", data);
        setContractDetails(data);
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

  if (error) {
    return <p>{error}</p>;
  }

  if (!contractDetails) {
    return null; // Hoặc hiển thị thông báo thích hợp
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Chi tiết hợp đồng
        <Divider />
      </DialogTitle>
      <DialogContent className="a4-size">
        <Box p={3} className="print-a4">
          <Typography variant="h4" align="center" gutterBottom>
            HỢP ĐỒNG GỬI GIỮ TRO CỐT
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Mã hợp đồng : {contractDetails.contractCode}
          </Typography>
          <Typography variant="body1" align="left" gutterBottom>
            Hôm nay, ngày{" "}
            {new Date(contractDetails.startDate).toLocaleDateString("vi-VN")} ,
            tại An Bình Viên (Hòa Lạc) chúng tôi gồm có:
          </Typography>

          <Typography variant="h6" gutterBottom>
            BÊN A: Công ty An Bình Viên
          </Typography>
          <Typography>Đại diện bởi: {contractDetails.staffName}</Typography>
          <Typography>Chức vụ: Nhân viên</Typography>
          <Typography>Điện thoại: 0999.999.999</Typography>
          <Typography>Địa chỉ: Hòa Lạc - Hà Nội</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            BÊN B: {contractDetails.customerName}
          </Typography>
          <Typography>
            CMND/CCCD: {contractDetails.customerCitizenID}
          </Typography>
          <Typography>
            Ngày cấp:{" "}
            {new Date(contractDetails.citizenIdissuanceDate).toLocaleDateString(
              "vi-VN"
            )}
          </Typography>
          <Typography>Nơi cấp: {contractDetails.citizenIdsupplier}</Typography>
          <Typography>
            Số điện thoại: {contractDetails.customerPhone}
          </Typography>

          <Typography>Địa chỉ: {contractDetails.customerAddress}</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            THÔNG TIN NGƯỜI MẤT
          </Typography>
          <Typography>Tên người mất: {contractDetails.deceasedName}</Typography>
          <Typography>
            CMND/CCCD: {contractDetails.deceasedCitizenID}
          </Typography>
          <Typography>
            Ngày sinh:{" "}
            {new Date(contractDetails.deceasedDateOfBirth).toLocaleDateString(
              "vi-VN"
            )}
          </Typography>
          <Typography>
            Ngày mất:{" "}
            {new Date(contractDetails.deceasedDateOfDeath).toLocaleDateString(
              "vi-VN"
            )}
          </Typography>
          <Typography>
            Số giấy chứng tử: {contractDetails.deceasedDeathCertificateNumber}
          </Typography>
          <Typography>
            Nơi cấp giấy chứng tử:{" "}
            {contractDetails.deceasedDeathCertificateSupplier}
          </Typography>
          <Typography>
            Quan hệ với bên B:{" "}
            {contractDetails.deceasedRelationshipWithCustomer}
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 1: MỤC ĐÍCH VÀ PHẠM VI HỢP ĐỒNG
          </Typography>
          <Typography>
            Hợp đồng này nhằm mục đích quy định việc gửi giữ tro cốt của{" "}
            {contractDetails.deceasedName} giữa Bên A và Bên B. <br></br> Tại ô
            chứa mã số: {contractDetails.nicheCode} ({contractDetails.nicheName}
            {""}) tại An Bình Viên (Hòa Lạc).
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 2: THỜI HẠN GỬI GIỮ
          </Typography>
          <Typography>
            Thời hạn gửi giữ tro cốt là {contractDetails.duration}, kể từ ngày{" "}
            {new Date(contractDetails.startDate).toLocaleDateString("vi-VN")}{" "}
            đến ngày{" "}
            {new Date(contractDetails.endDate).toLocaleDateString("vi-VN")}.
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
              : 0}{" "}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
