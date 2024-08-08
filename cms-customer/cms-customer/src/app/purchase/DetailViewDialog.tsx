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
  Divider,
} from "@mui/material";
import { ServiceOrder } from "./ServiceOrderList";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import ImageViewDialog from "./ImageViewDialog"; // Import the new ImageViewDialog component

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
  const [isImageViewOpen, setIsImageViewOpen] = React.useState(false); // State for image view dialog
  const [selectedImage, setSelectedImage] = React.useState<string>(""); // State for selected image
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

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageViewOpen(true);
  };

  if (!record) return null;

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const totalAmount = record.serviceOrderDetails.$values.reduce(
    (total, detail) => total + detail.price * detail.quantity,
    0
  );

  return (
    <Dialog open={!!record} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết đơn đặt hàng</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <strong>Mã đơn hàng:</strong> {record.serviceOrderCode}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày tạo:</strong>{" "}
          {dayjs(record.createdDate).format("DD/MM/YYYY")}
        </DialogContentText>
        <DialogContentText>
          <strong>Ngày hẹn:</strong> {dayjs(orderDate).format("DD/MM/YYYY")}
        </DialogContentText>
        <DialogContentText>
          <strong>Tên người mất:</strong> {record.deceasedName}
        </DialogContentText>
        <DialogContentText>
          <strong>Địa chỉ ô chứa:</strong> {record.nicheAddress}
        </DialogContentText>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Dịch vụ/Sản phẩm</TableCell>
                <TableCell align="center">Giá</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hình ảnh xác nhận</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.serviceOrderDetails.$values.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{detail.serviceName}</TableCell>
                  <TableCell align="center">
                    {formatCurrency(detail.price)}
                  </TableCell>
                  <TableCell align="center">{detail.quantity}</TableCell>
                  <TableCell align="center">
                    <Badge variant={getStatusVariant(detail.status)}>
                      {getStatusText(detail.status) || "Không có thông tin"}
                    </Badge>
                  </TableCell>
                  <TableCell align="center">
                    {detail.completionImage ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          detail.completionImage &&
                          handleImageClick(detail.completionImage)
                        }
                      >
                        <Image
                          width={50}
                          height={50}
                          src={detail.completionImage}
                          alt="Completion"
                          className="rounded"
                        />
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  align="right"
                  colSpan={5}
                  sx={{ fontWeight: "bold", color: "red" }}
                >
                  Tổng tiền: {"    "}
                  {formatCurrency(totalAmount)}
                </TableCell>
              </TableRow>
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
      <ImageViewDialog
        open={isImageViewOpen}
        imageSrc={selectedImage}
        onClose={() => setIsImageViewOpen(false)}
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
