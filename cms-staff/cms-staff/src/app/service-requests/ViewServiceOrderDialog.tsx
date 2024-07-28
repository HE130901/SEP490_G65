"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import Image from "next/image";
import styled from "@emotion/styled";
import UpdateCompletionImageDialog from "./UpdateCompletionImageDialog";
import ServiceOrderAPI from "@/services/serviceOrderService";

const CenteredTableCell = styled(TableCell)`
  text-align: center;
`;

const ViewServiceOrderDialog = ({
  open,
  onClose,
  serviceOrderId,
}: {
  open: boolean;
  onClose: () => void;
  serviceOrderId: number | null;
}) => {
  const [serviceOrder, setServiceOrder] = useState<any>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedServiceOrderDetailId, setSelectedServiceOrderDetailId] =
    useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [serviceOrderDetailToDelete, setServiceOrderDetailToDelete] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchServiceOrderDetails = async () => {
      if (serviceOrderId !== null) {
        try {
          const response = await ServiceOrderAPI.getServiceOrderDetails(
            serviceOrderId
          );
          setServiceOrder(response.data);
        } catch (error) {
          toast.error("Không thể tải chi tiết đơn đặt dịch vụ");
        }
      }
    };

    fetchServiceOrderDetails();
  }, [serviceOrderId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return "Đang chờ";
      case "Completed":
        return "Hoàn thành";
      case "Canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      case "Canceled":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const calculateTotalPrice = () => {
    return serviceOrder?.serviceOrderDetails.$values.reduce(
      (total: number, detail: any) =>
        total + (detail.service?.price ?? 0) * detail.quantity,
      0
    );
  };

  const handleOpenUpdateDialog = (serviceOrderDetailId: number) => {
    setSelectedServiceOrderDetailId(serviceOrderDetailId);
    setUpdateDialogOpen(true);
  };

  const fetchServiceOrderDetails = async () => {
    if (serviceOrderId !== null) {
      try {
        const response = await ServiceOrderAPI.getServiceOrderDetails(
          serviceOrderId
        );
        setServiceOrder(response.data);
      } catch (error) {
        toast.error("Không thể tải chi tiết đơn đặt dịch vụ");
      }
    }
  };

  const handleRemoveService = async (serviceOrderDetailId: number) => {
    setServiceOrderDetailToDelete(serviceOrderDetailId);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveService = async () => {
    if (serviceOrderDetailToDelete !== null) {
      try {
        await ServiceOrderAPI.removeServiceFromOrder(
          serviceOrderDetailToDelete
        );
        toast.success("Đã xóa dịch vụ thành công");
        fetchServiceOrderDetails();
        setConfirmDialogOpen(false);
      } catch (error) {
        toast.error("Không thể xóa dịch vụ");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn đăng ký dùng dịch vụ</DialogTitle>
      <DialogContent>
        {serviceOrder ? (
          <Box>
            <Box mb={2}>
              <Typography variant="h6">
                Thông tin: Mã đơn hàng {serviceOrderId}{" "}
              </Typography>
              <Typography>
                Tên khách hàng: {serviceOrder.customerFullName}{" "}
              </Typography>
              <Typography>
                Địa chỉ ô chứa: {"Tòa nhà "} {serviceOrder.niche.building}
                {" - "}
                {serviceOrder.niche.floor} {" - "} {serviceOrder.niche.area}{" "}
                {" - Ô chứa số "}
                {serviceOrder.niche.nicheName}
              </Typography>
              <Typography>
                Thời gian tạo:{" "}
                {new Date(serviceOrder.createdDate).toLocaleString()}
              </Typography>
              <Typography>
                Thời gian đặt:{" "}
                {new Date(serviceOrder.orderDate).toLocaleString()}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="h6">Chi tiết dịch vụ</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <CenteredTableCell>Tên dịch vụ</CenteredTableCell>
                      <CenteredTableCell>Giá</CenteredTableCell>
                      <CenteredTableCell>Số lượng</CenteredTableCell>
                      <CenteredTableCell>Trạng thái</CenteredTableCell>
                      <CenteredTableCell>Hình ảnh xác nhận</CenteredTableCell>
                      <CenteredTableCell>Hành động</CenteredTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceOrder.serviceOrderDetails.$values.map(
                      (detail: any) => (
                        <TableRow key={detail.serviceOrderDetailId}>
                          <CenteredTableCell>
                            {detail.service?.serviceName ?? "N/A"}
                          </CenteredTableCell>
                          <CenteredTableCell>
                            {formatCurrency(
                              (detail.service?.price ?? 0) * detail.quantity
                            )}
                          </CenteredTableCell>
                          <CenteredTableCell>
                            {detail.quantity}
                          </CenteredTableCell>
                          <CenteredTableCell>
                            <Chip
                              label={getStatusLabel(detail.status)}
                              color={getStatusColor(detail.status)}
                              size="small"
                            />
                          </CenteredTableCell>
                          <CenteredTableCell>
                            {detail.completionImage ? (
                              <Image
                                src={detail.completionImage}
                                alt="Completion"
                                height={50}
                                width={50}
                              />
                            ) : (
                              "N/A"
                            )}
                          </CenteredTableCell>
                          <CenteredTableCell>
                            <Tooltip title="Xác nhận hoàn thành với hình ảnh">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleOpenUpdateDialog(
                                    detail.serviceOrderDetailId
                                  )
                                }
                                disabled={detail.status === "Completed"}
                              >
                                Xác nhận
                              </Button>
                            </Tooltip>
                          </CenteredTableCell>
                        </TableRow>
                      )
                    )}
                    <TableRow>
                      <CenteredTableCell
                        colSpan={1}
                        variant="head"
                        className="text-red-500"
                      >
                        Tổng cộng
                      </CenteredTableCell>
                      <CenteredTableCell
                        variant="head"
                        className="text-red-500"
                      >
                        {formatCurrency(calculateTotalPrice())}
                      </CenteredTableCell>
                      <CenteredTableCell colSpan={3}></CenteredTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
      <UpdateCompletionImageDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        serviceOrderDetailId={selectedServiceOrderDetailId}
        onUpdateSuccess={() => {
          setUpdateDialogOpen(false);
          fetchServiceOrderDetails();
        }}
      />
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa dịch vụ này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
          <Button onClick={confirmRemoveService} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ViewServiceOrderDialog;
