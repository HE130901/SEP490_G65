"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";
import AddServiceOrderDialog from "./AddServiceOrderDialog";
import ViewServiceOrderDialog from "./ViewServiceOrderDialog";

const ServiceRequestPage = () => {
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedServiceOrderId, setSelectedServiceOrderId] = useState<
    number | null
  >(null);

  const fetchServiceRequests = async () => {
    try {
      const response = await ServiceOrderAPI.getAllServiceOrders();
      setServiceRequests(response.data.$values || response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đặt chỗ");
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const handleAddServiceRequest = () => {
    setAddDialogOpen(true);
  };

  const handleViewServiceRequest = (id: number) => {
    setSelectedServiceOrderId(id);
    setViewDialogOpen(true);
  };

  const handleEditServiceRequest = (id: number) => {
    alert(`Sửa đơn đăng ký dùng dịch vụ với ID: ${id}`);
  };

  const handleDeleteServiceRequest = (id: number) => {
    alert(`Xóa đơn đăng ký dùng dịch vụ với ID: ${id}`);
  };

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

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    fetchServiceRequests();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    fetchServiceRequests();
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddServiceRequest}
        >
          Thêm mới đơn đăng ký dùng dịch vụ
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số thứ tự</TableCell>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Mã ô chứa</TableCell>
              <TableCell>Tên Khách hàng</TableCell>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceRequests.map((serviceRequest, index) => (
              <TableRow key={serviceRequest.serviceOrderId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{serviceRequest.serviceOrderId}</TableCell>
                <TableCell>{serviceRequest.nicheAddress}</TableCell>
                <TableCell>{serviceRequest.customerName}</TableCell>
                <TableCell>
                  {serviceRequest.serviceOrderDetails.$values.map(
                    (service: any, idx: number) => (
                      <div key={idx}>
                        {service.serviceName} (x{service.quantity})
                      </div>
                    )
                  )}
                </TableCell>
                <TableCell>
                  {serviceRequest.serviceOrderDetails.$values.map(
                    (service: any, idx: number) => (
                      <div key={idx} style={{ marginBottom: 4 }}>
                        <Chip
                          label={getStatusLabel(service.status)}
                          color={getStatusColor(service.status)}
                          size="small"
                        />
                      </div>
                    )
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleViewServiceRequest(serviceRequest.serviceOrderId)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() =>
                      handleEditServiceRequest(serviceRequest.serviceOrderId)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDeleteServiceRequest(serviceRequest.serviceOrderId)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddServiceOrderDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAddSuccess={handleCloseAddDialog}
      />
      <ViewServiceOrderDialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        serviceOrderId={selectedServiceOrderId}
      />
    </Box>
  );
};

export default ServiceRequestPage;
