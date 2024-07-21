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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";
import Image from "next/image";
import UpdateCompletionImageDialog from "./UpdateCompletionImageDialog";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

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
  const [allServices, setAllServices] = useState<any[]>([]);
  const [newServiceId, setNewServiceId] = useState<number | "">("");
  const [newServiceQuantity, setNewServiceQuantity] = useState<number>(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [serviceOrderDetailToDelete, setServiceOrderDetailToDelete] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceOrderAPI.getAllServices();
        setAllServices(response.data.$values || response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ");
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceOrderId !== null) {
      const fetchServiceOrderDetails = async () => {
        try {
          const response = await ServiceOrderAPI.getServiceOrderDetails(
            serviceOrderId
          );
          setServiceOrder(response.data);
        } catch (error) {
          toast.error("Không thể tải chi tiết đơn đặt dịch vụ");
        }
      };

      fetchServiceOrderDetails();
    }
  }, [serviceOrderId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return "Đang chờ";
      case "Complete":
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
      case "Complete":
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

  const handleAddService = async () => {
    if (newServiceId !== null && newServiceId !== "") {
      try {
        await ServiceOrderAPI.addServiceToOrder(serviceOrderId, [
          { serviceID: newServiceId, quantity: newServiceQuantity },
        ]);
        toast.success("Đã thêm dịch vụ thành công");
        fetchServiceOrderDetails();
      } catch (error) {
        toast.error("Không thể thêm dịch vụ");
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
                      <TableCell>Tên dịch vụ</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hình ảnh xác nhận</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviceOrder.serviceOrderDetails.$values.map(
                      (detail: any, index: number) => (
                        <TableRow key={detail.serviceOrderDetailId}>
                          <TableCell>
                            {detail.service?.serviceName ?? "N/A"}
                          </TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(
                              (detail.service?.price ?? 0) * detail.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(detail.status)}
                              color={getStatusColor(detail.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Xác nhận">
                              <span>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleOpenUpdateDialog(
                                      detail.serviceOrderDetailId
                                    )
                                  }
                                  disabled={detail.status === "Complete"}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleRemoveService(
                                      detail.serviceOrderDetailId
                                    )
                                  }
                                  disabled={detail.status === "Complete"}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                    <TableRow>
                      <TableCell colSpan={2} variant="head">
                        Tổng cộng
                      </TableCell>
                      <TableCell variant="head" className="text-red-500">
                        {formatCurrency(calculateTotalPrice())}
                      </TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormControl margin="normal" style={{ flex: 2, marginRight: 8 }}>
                <InputLabel id="new-service-label">Dịch vụ</InputLabel>
                <Select
                  labelId="new-service-label"
                  value={newServiceId}
                  onChange={(e: SelectChangeEvent<number | "">) =>
                    setNewServiceId(e.target.value as number)
                  }
                  label="Dịch vụ"
                >
                  <MenuItem value="" disabled>
                    Chọn dịch vụ
                  </MenuItem>
                  {allServices.map((service) => (
                    <MenuItem key={service.serviceId} value={service.serviceId}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                label="Số lượng"
                name="quantity"
                type="number"
                value={newServiceQuantity}
                onChange={(e) => setNewServiceQuantity(Number(e.target.value))}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddService}
                style={{ flexShrink: 0 }}
              >
                Thêm dịch vụ
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
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
