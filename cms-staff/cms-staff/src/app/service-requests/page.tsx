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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
import { useServiceOrderContext } from "@/context/ServiceOrderContext";
import { formatISO, parseISO, isWithinInterval } from "date-fns";

// Helper functions
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const getCurrentMonthStartDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

const getCurrentMonthEndDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate(); // Last day of the current month
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(
    2,
    "0"
  )}`;
};

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
    fetchServiceOrders();
  }, [fetchServiceOrders]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedServiceOrderId, setSelectedServiceOrderId] = useState<
    number | null
  >(null);

  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState<
    keyof (typeof serviceOrders)[0] | "all"
  >("createdDate");

  const [fromDate, setFromDate] = useState(getCurrentMonthStartDate());
  const [toDate, setToDate] = useState(getCurrentMonthEndDate());

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

  const filteredServiceOrders = serviceOrders.filter((order) => {
    // Apply date range filter
    let dateFiltered = true;
    if (
      fromDate &&
      toDate &&
      (searchColumn === "createdDate" || searchColumn === "orderDate")
    ) {
      const dateToCheck = parseISO(order[searchColumn]);
      const from = parseISO(fromDate);
      const to = parseISO(toDate);
      const adjustedTo = new Date(to.getTime() + 86400000); // Add 24 hours

      dateFiltered = isWithinInterval(dateToCheck, {
        start: from,
        end: adjustedTo,
      });
    }

    // Apply text search filter
    let textFiltered = true;
    if (searchText) {
      textFiltered =
        searchColumn === "all"
          ? Object.values(order).some((value) =>
              String(value).toLowerCase().includes(searchText.toLowerCase())
            )
          : String(order[searchColumn])
              .toLowerCase()
              .includes(searchText.toLowerCase());
    }

    return dateFiltered && textFiltered;
  });

  const columns: GridColDef[] = [
    {
      field: "serviceOrderCode",
      headerName: "Mã đơn",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "customerName",
      headerName: "Tên Khách hàng",
      width: 180,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "createdDate",
      headerName: "Ngày tạo",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>{formatDateToDDMMYYYY(params.value)}</CenteredCell>
      ),
    },
    {
      field: "orderDate",
      headerName: "Ngày hẹn",
      width: 100,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>{formatDateToDDMMYYYY(params.value)}</CenteredCell>
      ),
    },
    {
      field: "services",
      headerName: "Dịch vụ",
      width: 260,
      headerClassName: "super-app-theme--header",
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
      width: 220,
      headerClassName: "super-app-theme--header",
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
      width: 130,
      headerClassName: "super-app-theme--header",
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

  const rows = filteredServiceOrders.map((serviceOrder, index) => ({
    id: serviceOrder.serviceOrderId,
    stt: index + 1,
    serviceOrderId: serviceOrder.serviceOrderId,
    serviceOrderCode: serviceOrder.serviceOrderCode,
    customerName: serviceOrder.customerName,
    orderDate: serviceOrder.orderDate,
    createdDate: serviceOrder.createdDate,
    services: serviceOrder.serviceOrderDetails?.$values || [],
    statuses:
      serviceOrder.serviceOrderDetails?.$values.map(
        (detail: { status: any }) => ({
          status: detail.status,
        })
      ) || [],
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(176, 178, 181)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        style={{ width: "100%", maxWidth: 1200 }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddServiceRequest}
        >
          Thêm mới đơn đăng ký dùng dịch vụ
        </Button>
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: 8 }}
          >
            <InputLabel id="search-column-label">Chọn cột</InputLabel>
            <Select
              labelId="search-column-label"
              id="search-column"
              value={searchColumn}
              onChange={(e) =>
                setSearchColumn(
                  e.target.value as keyof (typeof serviceOrders)[0] | "all"
                )
              }
              label="Chọn cột"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="serviceOrderCode">Mã đơn</MenuItem>
              <MenuItem value="customerName">Tên Khách hàng</MenuItem>
              <MenuItem value="createdDate">Ngày tạo</MenuItem>
              <MenuItem value="orderDate">Ngày hẹn</MenuItem>
            </Select>
          </FormControl>
          {searchColumn === "createdDate" || searchColumn === "orderDate" ? (
            <Box display="flex" alignItems="center">
              <TextField
                type="date"
                label="Từ ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ marginRight: 8 }}
              />
              <TextField
                type="date"
                label="Đến ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Box>
          ) : (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Paper
          elevation={3}
          style={{ padding: 4, width: "100%", maxWidth: 1200 }}
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
              columns: {
                columnVisibilityModel: {},
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
