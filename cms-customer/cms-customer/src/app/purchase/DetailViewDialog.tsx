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
  TextField,
} from "@mui/material";
import { ServiceOrder } from "./ServiceOrderList";
import Image from "next/image";

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
        <Button
          onClick={() => setIsEditOpen(true)}
          color="primary"
          variant="contained"
          disabled={hasCompleteStatus}
        >
          Sửa ngày hẹn
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
      <DialogContent>
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
