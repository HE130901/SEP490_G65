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
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforeGetContent: () => {
      if (!contentRef.current) {
        return Promise.reject("No content to print");
      }
      return Promise.resolve();
    },
  });

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const data = await ContractAPI.getContractById(contractId);
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

  if (loading || !contractDetails) {
    return null; // Or return a loading indicator
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Chi tiết hợp đồng</DialogTitle>
      <DialogContent className="a4-size" dividers>
        <Box ref={contentRef} px={8} className="print-a4">
          <Typography
            variant="body1"
            component="div"
            align="center"
            gutterBottom
          >
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
          </Typography>
          <Typography variant="body1" component="div" align="center">
            <strong>
              <em>Độc lập - Tự do - Hạnh phúc</em>
            </strong>
          </Typography>
          <Typography variant="body1" component="div" align="center">
            ---------------------
          </Typography>
          <Typography variant="h4" align="center" gutterBottom pt={4}>
            <strong>HỢP ĐỒNG GỬI GIỮ TRO CỐT</strong>
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Mã hợp đồng: <strong>{contractDetails.contractCode}</strong>
          </Typography>
          <Typography variant="body1" align="left" gutterBottom pt={4}>
            Hôm nay, ngày{" "}
            <strong>
              {new Date(contractDetails.startDate).toLocaleDateString("vi-VN")}
            </strong>
            , tại <strong>Công ty An Bình Viên</strong> chúng tôi gồm có:
          </Typography>
          <Box mt={4}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  <strong>BÊN A: {contractDetails.customerName}</strong>
                </Typography>
                <Typography>
                  <strong> Số CMND/CCCD: </strong>
                  {contractDetails.customerCitizenID}
                </Typography>
                <Typography>
                  <strong> Ngày cấp: </strong>
                  {new Date(
                    contractDetails.citizenIdissuanceDate
                  ).toLocaleDateString("vi-VN")}
                </Typography>
                <Typography>
                  <strong> Nơi cấp:</strong> {contractDetails.citizenIdsupplier}
                </Typography>
                <Typography>
                  <strong> Số điện thoại: </strong>
                  {contractDetails.customerPhone}
                </Typography>
                <Typography>
                  <strong> Địa chỉ: </strong>
                  {contractDetails.customerAddress}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  <strong>BÊN B: Công ty An Bình Viên</strong>
                </Typography>
                <Typography>
                  <strong> Mã số thuế: </strong> 0101010101
                </Typography>

                <Typography>
                  <strong> Số điện thoại:</strong> 0999.999.999
                </Typography>
                <Typography>
                  <strong>Địa chỉ:</strong> số 123 - Hòa Lạc - TP. Hà Nội
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4}>
            {" "}
            <Typography variant="h6" gutterBottom>
              <strong>ĐIỀU 1: MỤC ĐÍCH VÀ PHẠM VI HỢP ĐỒNG</strong>
            </Typography>
            <Box>
              {/* <Typography variant="h6" gutterBottom>
                <strong>
                  <>Thông tin người mất</>
                </strong>
              </Typography> */}
              <Typography>
                <strong>Tên người mất:</strong> {contractDetails.deceasedName}{" "}
              </Typography>
              <Typography>
                <strong>Quan hệ với bên A: </strong>
                {contractDetails.deceasedRelationshipWithCustomer}
              </Typography>
              <Typography>
                <strong>Số CMND/CCCD: </strong>
                {contractDetails.deceasedCitizenID}
              </Typography>
              <Typography>
                <strong> Số giấy chứng tử: </strong>
                {contractDetails.deceasedDeathCertificateNumber}
              </Typography>
              <Typography>
                <strong> Nơi cấp giấy chứng tử: </strong>
                {contractDetails.deceasedDeathCertificateSupplier}
              </Typography>
              <Typography>
                <strong>Ngày sinh: </strong>

                {new Date(
                  contractDetails.deceasedDateOfBirth
                ).toLocaleDateString("vi-VN")}
              </Typography>
              <Typography>
                <strong>Ngày mất: </strong>
                {new Date(
                  contractDetails.deceasedDateOfDeath
                ).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>
            <Typography pt={2}>
              Hợp đồng này nhằm mục đích quy định việc gửi giữ tro cốt của{" "}
              <strong>{contractDetails.deceasedName}</strong> giữa{" "}
              <strong>Bên A</strong> và <strong>Bên B</strong>, tại ô chứa mã số{" "}
              <strong>{contractDetails.nicheCode}</strong> ({" "}
              {contractDetails.nicheName}) tại{" "}
              <strong>An Bình Viên (Hòa Lạc)</strong> .
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom pt={2}>
            <strong>ĐIỀU 2: THỜI HẠN GỬI GIỮ</strong>
          </Typography>
          <Typography>
            Thời hạn gửi giữ tro cốt là{" "}
            <strong>{contractDetails.duration}</strong>, kể từ ngày{" "}
            <strong>
              {new Date(contractDetails.startDate).toLocaleDateString("vi-VN")}
            </strong>{" "}
            đến ngày{" "}
            <strong>
              {new Date(contractDetails.endDate).toLocaleDateString("vi-VN")}
            </strong>
            .
          </Typography>

          <Typography variant="h6" gutterBottom pt={2}>
            <strong>ĐIỀU 3: DỊCH VỤ VÀ CHI PHÍ</strong>
          </Typography>
          <Typography>
            3.1. <strong>Bên B</strong> sẽ cung cấp dịch vụ gửi giữ tro cốt tại
            An Bình Viên (Hòa Lạc).
          </Typography>
          <Typography>
            3.2. Chi phí dịch vụ là{" "}
            <strong>
              {contractDetails.totalAmount
                ? contractDetails.totalAmount.toLocaleString()
                : 0}{" "}
              VND
            </strong>
            . Đã được thanh toán tại thời điểm ký hợp đồng.
          </Typography>

          <Typography variant="h6" gutterBottom pt={2}>
            <strong>ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</strong>
          </Typography>
          <Typography>
            4.1. <strong>Bên B</strong> có trách nhiệm:
          </Typography>
          <Typography>
            Bảo quản tro cốt theo đúng cam kết. Thông báo cho{" "}
            <strong>Bên A</strong> về bất kỳ thay đổi liên quan đến dịch vụ gửi
            giữ.
          </Typography>
          <Typography>
            4.2. <strong>Bên A</strong> có trách nhiệm:
          </Typography>
          <Typography>
            Cung cấp đầy đủ thông tin và giấy tờ liên quan đến việc gửi giữ tro
            cốt.
          </Typography>
          <Typography>
            Thanh toán đầy đủ và đúng hạn các khoản phí đã thỏa thuận.
          </Typography>

          <Typography variant="h6" gutterBottom pt={2}>
            <strong>ĐIỀU 5: ĐIỀU KHOẢN CHUNG</strong>
          </Typography>
          <Typography>
            Các điều khoản và điều kiện khác của hợp đồng sẽ được thực hiện theo
            pháp luật hiện hành của Việt Nam. Mọi tranh chấp phát sinh từ hợp
            đồng này sẽ được giải quyết thông qua thương lượng và hòa giải.
            Trong trường hợp không giải quyết được, các bên có quyền khởi kiện
            tại Tòa án có thẩm quyền.
          </Typography>

          <Typography variant="h6" gutterBottom pt={2}>
            <strong>ĐIỀU 6: KÝ KẾT HỢP ĐỒNG</strong>
          </Typography>
          <Typography>
            Hợp đồng này được lập thành hai bản có giá trị pháp lý như nhau, mỗi
            bên giữ một bản và có hiệu lực kể từ ngày ký.
          </Typography>

          <Box mt={4}>
            <Grid container>
              <Grid item xs={6} textAlign={"center"}>
                <Typography>
                  {" "}
                  <strong>Đại diện Bên A</strong>
                </Typography>
                <Typography>
                  <>{contractDetails.customerName}</>
                </Typography>
                <Typography>
                  {" "}
                  <em>(Đã ký)</em>
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={"center"}>
                <Typography>
                  {" "}
                  <strong>Đại diện Bên B</strong>{" "}
                </Typography>
                <Typography>Giám đốc AN BÌNH VIÊN</Typography>
                <Typography>
                  {" "}
                  <em>(Đã ký)</em>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>
        <Button onClick={handlePrint} color="primary" variant="contained">
          In hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
