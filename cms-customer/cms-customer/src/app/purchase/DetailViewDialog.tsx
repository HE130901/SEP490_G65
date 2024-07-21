import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
} from "@mui/material";
import { ServiceOrder } from "./ServiceOrderList";
import Image from "next/image";

interface DetailViewDialogProps {
  record: ServiceOrder | null;
  onClose: () => void;
}

const DetailViewDialog: React.FC<DetailViewDialogProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  return (
    <Dialog open={!!record} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết đơn đặt hàng</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Mã đơn hàng:</strong> {record.serviceOrderId}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(record.createdDate).toLocaleString()}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày hẹn:</strong>{" "}
          {new Date(record.orderDate).toLocaleString()}
        </DialogContentText>
        <DialogContentText>
          <strong>Địa chỉ ô chứa:</strong> {record.nicheAddress}
        </DialogContentText>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dịch vụ/Sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hình ảnh xác nhận</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.serviceOrderDetails.$values.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.serviceName}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={detail.status === "Pending" ? "standard" : "dot"}
                    >
                      {detail.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {detail.completionImage ? (
                      <Image
                        width={100}
                        height={100}
                        src={detail.completionImage}
                        alt="Completion"
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailViewDialog;
