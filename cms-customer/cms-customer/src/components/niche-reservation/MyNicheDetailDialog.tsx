"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

interface MyNicheDetailDialogProps {
  isVisible: boolean;
  onClose: () => void;
  niche: any;
}
const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
    case "Complete":
      return "green";
    case "Pending":
    case "PendingRenewal":
    case "PendingCancelation":
      return "default";
    case "Canceled":
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
      return "Đang chờ ";
    case "Canceled":
      return "Đã hủy";
    case "Complete":
      return "Đã hoàn thành";

    case "PendingRenewal":
      return "Đang chờ gia hạn";
    case "PendingCancelation":
      return "Đang chờ hủy";
    default:
      return "Không xác định";
  }
};

const MyNicheDetailDialog: React.FC<MyNicheDetailDialogProps> = ({
  isVisible,
  onClose,
  niche,
}) => {
  const visitRegistrations = Array.isArray(niche?.visitRegistrations?.$values)
    ? niche.visitRegistrations.$values
    : niche?.visitRegistrations || [];

  const serviceOrders = Array.isArray(niche?.serviceOrders?.$values)
    ? niche.serviceOrders.$values
    : niche?.serviceOrders || [];

  const displayVisitRegistrations = visitRegistrations
    .sort((a: any, b: any) => +new Date(b.visitDate) - +new Date(a.visitDate))
    .slice(0, 3);
  const displayServiceOrders = serviceOrders
    .sort((a: any, b: any) => +new Date(b.orderDate) - +new Date(a.orderDate))
    .slice(0, 3);

  const formatDate = (date: string) => {
    return format(new Date(date), "HH:mm dd/MM/yyyy");
  };
  const formatDate2 = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  return (
    <Dialog open={isVisible} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết Ô chứa của bạn</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Thông tin chung
            </Typography>
            <Link href="/dashboard" passHref>
              <Button color="primary" variant="text">
                Xem chi tiết
              </Button>
            </Link>
          </Box>

          <Typography variant="body2" gutterBottom>
            <strong>Mã ô chứa:</strong> {niche?.nicheId || "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Địa chỉ ô chứa:</strong> {niche?.nicheAddress || "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Thông tin ô chứa:</strong>{" "}
            {niche?.nicheDescription || "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Tên người đã khuất:</strong> {niche?.fullName || "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Ngày bắt đầu hợp đồng:</strong>{" "}
            {niche?.startDate ? formatDate2(niche.startDate) : "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Ngày kết thúc hợp đồng:</strong>{" "}
            {niche?.endDate ? formatDate2(niche.endDate) : "N/A"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Trạng thái hợp đồng:</strong>
            <Badge variant={getStatusVariant(niche?.status)}>
              {getStatusText(niche?.status) || "Không có thông tin"}
            </Badge>
          </Typography>
        </Box>
        <Divider />
        <Box mt={2} mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Lịch sử viếng thăm
            </Typography>
            <Link href="/dashboard" passHref>
              <Button color="primary" variant="text">
                Xem chi tiết
              </Button>
            </Link>
          </Box>
          {visitRegistrations.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Ngày viếng</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Ghi chú</TableCell>
                    <TableCell align="center">Số người đi cùng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayVisitRegistrations.map(
                    (visit: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {formatDate(visit.visitDate)}
                        </TableCell>
                        <TableCell align="center">
                          <Badge variant={getStatusVariant(visit.status)}>
                            {getStatusText(visit.status) ||
                              "Không có thông tin"}
                          </Badge>
                        </TableCell>
                        <TableCell align="center">{visit.note}</TableCell>
                        <TableCell align="center">
                          {visit.accompanyingPeople}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Không có đăng ký viếng thăm nào.
            </Typography>
          )}
        </Box>
        <Box mt={2} mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Lịch sử đặt dịch vụ/sản phẩm
            </Typography>
            <Link href="/purchase" passHref>
              <Button color="primary" variant="text">
                Xem chi tiết
              </Button>
            </Link>
          </Box>
          {serviceOrders.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Ngày đặt hàng</TableCell>
                    <TableCell align="center">Tên dịch vụ</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Hình ảnh hoàn thành</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayServiceOrders.map((order: any, index: number) => (
                    <React.Fragment key={index}>
                      {order.serviceOrderDetails?.$values?.map(
                        (detail: any, detailIndex: number) => (
                          <TableRow key={detailIndex}>
                            <TableCell align="center">
                              {formatDate(order.orderDate)}
                            </TableCell>
                            <TableCell align="center">
                              {detail.serviceName}
                            </TableCell>
                            <TableCell align="center">
                              {detail.quantity}
                            </TableCell>
                            <TableCell align="center">
                              <Badge variant={getStatusVariant(detail.status)}>
                                {getStatusText(detail.status) ||
                                  "Không có thông tin"}
                              </Badge>
                            </TableCell>
                            <TableCell align="center">
                              {detail.completionImage && (
                                <Image
                                  src={detail.completionImage}
                                  alt="Completion"
                                  style={{ maxWidth: "100%" }}
                                  width={50}
                                  height={50}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Không có đơn đặt dịch vụ nào.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyNicheDetailDialog;
