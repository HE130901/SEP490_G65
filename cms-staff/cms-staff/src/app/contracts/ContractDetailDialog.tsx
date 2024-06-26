import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const ContractDetailDialog = ({ open, handleClose, contract }) => {
  if (!contract) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Chi tiết hợp đồng</DialogTitle>
      <DialogContent>
        <Box p={3} style={{ width: "100%", height: "100%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            HỢP ĐỒNG GỬI GIỮ TRO CỐT
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Số: {contract.code}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Ngày tháng: {contract.startDate}
          </Typography>

          <Typography variant="h6" gutterBottom>
            BÊN A: Công ty An Bình Viên
          </Typography>
          <Typography>Địa chỉ: [Địa chỉ của công ty]</Typography>
          <Typography>Điện thoại: [Số điện thoại công ty]</Typography>
          <Typography>Đại diện bởi: [Tên người đại diện]</Typography>
          <Typography>Chức vụ: [Chức vụ người đại diện]</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            BÊN B: {contract.customerName}
          </Typography>
          <Typography>Địa chỉ: {contract.address}</Typography>
          <Typography>Số điện thoại: {contract.phone}</Typography>
          <Typography>CMND/CCCD: {contract.idNumber}</Typography>
          <Typography>Ngày cấp: {contract.idDate}</Typography>
          <Typography>Nơi cấp: {contract.idPlace}</Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 1: MỤC ĐÍCH VÀ PHẠM VI HỢP ĐỒNG
          </Typography>
          <Typography>
            Hợp đồng này nhằm mục đích quy định việc gửi giữ tro cốt của{" "}
            {contract.deceasedName} giữa Bên A và Bên B.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 2: THỜI HẠN GỬI GIỮ
          </Typography>
          <Typography>
            Thời hạn gửi giữ tro cốt là {contract.duration}{" "}
            {contract.type === "Gửi theo tháng" ? "tháng" : "năm"}, kể từ ngày{" "}
            {contract.startDate} đến ngày {contract.endDate}.
          </Typography>

          <Typography variant="h6" gutterBottom mt={4}>
            ĐIỀU 3: DỊCH VỤ VÀ CHI PHÍ
          </Typography>
          <Typography>
            3.1. Bên A sẽ cung cấp dịch vụ gửi giữ tro cốt tại [địa điểm gửi
            giữ] với các điều kiện và dịch vụ sau:
          </Typography>
          <Typography>[Mô tả chi tiết dịch vụ và các điều kiện]</Typography>
          <Typography>
            3.2. Chi phí dịch vụ là{" "}
            {contract.cost ? contract.cost.toLocaleString() : 0} VND, được thanh
            toán theo định kỳ [khoảng thời gian thanh toán].
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
                <Typography>[Tên người ký]</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Đại diện Bên B</Typography>
                <Typography>{contract.customerName}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" gutterBottom mt={4}>
            Ghi chú
          </Typography>
          {contract.notes && contract.notes.length > 0 ? (
            contract.notes.map((note, index) => (
              <Typography key={index} variant="body2" gutterBottom>
                - {note}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" gutterBottom>
              Không có ghi chú.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractDetailDialog;
