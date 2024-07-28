"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddServiceOrderDialog from "./AddServiceOrderDialog";
import ViewServiceOrderDialog from "./ViewServiceOrderDialog";
import { styled } from "@mui/material/styles";
import viVN from "@/utils/viVN";
import { useServiceOrderContext } from "@/context/ServiceOrderContext"; // Import context

const CenteredTable = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-row": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-renderingZone": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-row--lastVisible": {
    maxHeight: "none !important",
  },
}));

const NoWrapTypography = styled(Typography)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const CenteredCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const ServiceRequestPage = () => {
  const {
    serviceOrders,
    fetchServiceOrders,
    addServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
  } = useServiceOrderContext();

  useEffect(() => {
    console.log("Service Orders fetched:", serviceOrders);
  }, [serviceOrders]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedServiceOrderId, setSelectedServiceOrderId] = useState<
    number | null
  >(null);

  const handleAddServiceRequest = () => {
    setAddDialogOpen(true);
  };

  const handleViewServiceRequest = (id: number) => {
    setSelectedServiceOrderId(id);
    setViewDialogOpen(true);
  };

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

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    fetchServiceOrders();
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    fetchServiceOrders();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      width: 70,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "serviceOrderCode",
      headerName: "Mã đơn",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "customerName", headerName: "Tên Khách hàng", width: 180 },
    {
      field: "formattedOrderDate",
      headerName: "Thời gian hẹn",
      width: 200,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "services",
      headerName: "Dịch vụ",
      width: 250,
      renderCell: (params) => (
        <NoWrapTypography variant="body2">
          {Array.isArray(params.value)
            ? params.value.map((service: any, idx: number) => (
                <span key={idx}>
                  {service.serviceName} (x{service.quantity})
                  {idx < params.value.length - 1 && ", "}
                </span>
              ))
            : "Không có dịch vụ"}
        </NoWrapTypography>
      ),
    },
    {
      field: "statuses",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <NoWrapTypography>
          {Array.isArray(params.value)
            ? params.value.map((status: any, idx: number) => (
                <Chip
                  key={idx}
                  label={getStatusLabel(status.status)}
                  color={getStatusColor(status.status)}
                  size="small"
                  style={{ marginRight: 4 }}
                />
              ))
            : "Không có trạng thái"}
        </NoWrapTypography>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 100,
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết đơn đặt dịch vụ">
            <IconButton
              color="primary"
              onClick={() =>
                handleViewServiceRequest(params.row.serviceOrderId)
              }
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </CenteredCell>
      ),
    },
  ];

  const rows = serviceOrders.map((serviceOrder, index) => ({
    id: index + 1,
    serviceOrderId: serviceOrder.serviceOrderId,
    serviceOrderCode: serviceOrder.serviceOrderCode,
    customerName: serviceOrder.customerName,
    formattedOrderDate: serviceOrder.formattedOrderDate,
    services: serviceOrder.serviceOrderDetails?.$values || [],
    statuses:
      serviceOrder.serviceOrderDetails?.$values.map(
        (detail: { status: any }) => ({
          status: detail.status,
        })
      ) || [],
  }));

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
      <Box display="flex" justifyContent="center" style={{ width: "100%" }}>
        <Paper
          elevation={3}
          style={{ padding: 20, width: "100%", maxWidth: 1200 }}
        >
          <CenteredTable
            rows={rows}
            columns={columns}
            autoHeight
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
          />
        </Paper>
      </Box>
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
