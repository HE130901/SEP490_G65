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
  TextField,
} from "@mui/material";
import { ServiceOrder } from "./ServiceOrderList";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface DetailViewDialogProps {
  record: ServiceOrder | null;
  onClose: () => void;
  onSave: (record: ServiceOrder) => void;
}

const DetailViewDialog: React.FC<DetailViewDialogProps> = ({
  record,
  onClose,
  onSave,
}) => {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [orderDate, setOrderDate] = React.useState<string>(
    record ? record.orderDate : ""
  );

  React.useEffect(() => {
    if (record) {
      setOrderDate(record.orderDate);
    }
  }, [record]);

  const handleEditSave = () => {
    if (record) {
      onSave({ ...record, orderDate });
      setIsEditOpen(false);
    }
  };

  if (!record) return null;

  const hasCompleteStatus = record.serviceOrderDetails.$values.some(
    (detail) => detail.status === "Complete"
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
      case "Signed":
      case "Completed":
        return "green";
      case "Pending":
        return "default";
      case "Canceled":
      case "Expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Approved":
        return "Đã duyệt";
      case "Pending":
        return "Đang thực hiện";
      case "Canceled":
        return "Đã hủy";
      case "Expired":
        return "Đã hết hạn";
      case "Signed":
        return "Đã ký hợp đồng";
      case "Completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  return (
    <Dialog open={!!record} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết đơn đặt hàng</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <strong>Mã đơn hàng:</strong> {record.serviceOrderCode}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(record.createdDate).toLocaleString()}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày hẹn:</strong> {new Date(orderDate).toLocaleString()}
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
                    <Badge variant={getStatusVariant(detail.status)}>
                      {getStatusText(detail.status) || "Không có thông tin"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {detail.completionImage ? (
                      <Image
                        width={50}
                        height={50}
                        src={detail.completionImage}
                        alt="Completion"
                        className="rounded"
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
        <Button onClick={onClose} variant="outlined" color="primary">
          Đóng
        </Button>
      </DialogActions>
      <EditDateDialog
        record={record}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
      />
    </Dialog>
  );
};

interface EditDateDialogProps {
  record: ServiceOrder | null;
  open: boolean;
  onClose: () => void;
  onSave: (record: ServiceOrder) => void;
}

const EditDateDialog: React.FC<EditDateDialogProps> = ({
  record,
  open,
  onClose,
  onSave,
}) => {
  const [orderDate, setOrderDate] = React.useState<string>(
    record ? record.orderDate : ""
  );

  React.useEffect(() => {
    if (record) {
      setOrderDate(record.orderDate);
    }
  }, [record]);

  const handleSave = () => {
    if (record) {
      onSave({ ...record, orderDate });
      onClose();
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa ngày hẹn</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <strong>Mã đơn hàng:</strong> {record.serviceOrderId}
        </DialogContentText>
        <TextField
          label="Ngày hẹn"
          type="datetime-local"
          fullWidth
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy bỏ
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailViewDialog;
