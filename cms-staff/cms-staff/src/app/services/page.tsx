// ServiceProductPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Paper,
  Avatar,
  Chip,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import ServiceDetail from "./ServiceDetail";
import ServiceEdit from "./ServiceEdit";
import ServiceDelete from "./ServiceDelete";
import ServiceAdd from "./ServiceAdd";
import { formatVND } from "@/utils/formatCurrency";
import { useServiceContext } from "@/context/ServiceContext";
import { Service } from "@/context/interfaces";
import viVN from "@/utils/viVN";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Unavailable":
      return { label: "Đã hết hàng", color: "error" };

    case "Available":
      return { label: "Sẵn sàng", color: "success" };
    case "Others":
      return { label: "Khác", color: "warning" };

    default:
      return { label: status, color: "default" };
  }
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
    justifyContent: "center",
    overflow: "visible",
    textOverflow: "unset",
    padding: theme.spacing(1),
    wordBreak: "break-word",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
}));

const ServiceProductPage: React.FC = () => {
  const { services, addService, updateService, deleteService, fetchServices } =
    useServiceContext();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");

  useEffect(() => {
    fetchServices(); // Fetch data on initial load
  }, []);

  const handleAddItem = () => {
    setAddOpen(true);
  };

  const handleViewItem = (service: Service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  const handleEditItem = (service: Service) => {
    setSelectedService(service);
    setEditOpen(true);
  };

  const handleDeleteItem = (service: Service) => {
    setSelectedService(service);
    setDeleteOpen(true);
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value);
  };

  const filteredItems = services.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchColumn === "all") {
      return (
        item.serviceName.toLowerCase().includes(searchTermLower) ||
        item.serviceId.toString().includes(searchTermLower) ||
        item.price.toString().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower) ||
        item.tag.toLowerCase().includes(searchTermLower)
      );
    } else if (searchColumn === "serviceName") {
      return item.serviceName.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "serviceId") {
      return item.serviceId.toString().includes(searchTermLower);
    } else if (searchColumn === "price") {
      return item.price.toString().includes(searchTermLower);
    } else if (searchColumn === "category") {
      return item.category.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "tag") {
      return item.tag.toLowerCase().includes(searchTermLower);
    }
    return true;
  });

  const columns: GridColDef[] = [
    { field: "serviceId", headerName: "ID", width: 80 },
    { field: "serviceName", headerName: "Tên", width: 200 },
    {
      field: "price",
      headerName: "Giá (VND)",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {formatVND(params.value as number)}
        </Box>
      ),
    },
    { field: "category", headerName: "Phân loại", width: 120 },
    { field: "tag", headerName: "Thẻ", width: 120 },
    {
      field: "servicePicture",
      headerName: "Ảnh",
      width: 150,
      renderCell: (params) => (
        <Avatar src={params.row.servicePicture} alt={params.row.serviceName} />
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        const { label, color } = getStatusLabel(params.value);
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Chip
              label={label}
              color={
                color as
                  | "info"
                  | "error"
                  | "primary"
                  | "secondary"
                  | "success"
                  | "warning"
                  | "default"
              }
            />
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="primary"
              onClick={() => handleViewItem(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="secondary"
              onClick={() => handleEditItem(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Xóa">
            <IconButton
              color="error"
              onClick={() => handleDeleteItem(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
  ];

  const rows = filteredItems.map((item) => ({
    ...item,
    id: item.serviceId,
  }));

  const handleCloseView = () => {
    setSelectedService(null);
    setViewOpen(false);
  };

  const handleCloseEdit = () => {
    setSelectedService(null);
    setEditOpen(false);
  };

  const handleCloseDelete = () => {
    setSelectedService(null);
    setDeleteOpen(false);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
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
          onClick={handleAddItem}
        >
          Thêm mới
        </Button>
        <Box display="flex" alignItems="center">
          <FormControl variant="outlined" size="small" sx={{ marginRight: 2 }}>
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="serviceName">Tên</MenuItem>
              <MenuItem value="serviceId">ID</MenuItem>
              <MenuItem value="price">Giá</MenuItem>
              <MenuItem value="category">Phân loại</MenuItem>
              <MenuItem value="tag">Thẻ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" style={{ width: "100%" }}>
        <Paper
          elevation={3}
          style={{ padding: 20, width: "100%", maxWidth: 1200 }}
        >
          <CenteredTable
            rows={filteredItems.map((items, index) => ({
              ...items,
              id: index + 1,
            }))}
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
      <ServiceDetail
        service={selectedService}
        onClose={handleCloseView}
        open={viewOpen}
      />
      <ServiceEdit
        service={selectedService}
        onClose={handleCloseEdit}
        open={editOpen}
        onSave={(updatedService) => {
          updateService(updatedService);
          handleCloseEdit();
        }}
      />
      <ServiceDelete
        service={selectedService}
        onClose={handleCloseDelete}
        open={deleteOpen}
        onDelete={(serviceId) => {
          deleteService(serviceId);
          handleCloseDelete();
        }}
      />
      <ServiceAdd
        open={addOpen}
        onClose={handleCloseAdd}
        onAdd={(newService) => {
          addService(newService);
          handleCloseAdd();
        }}
      />
    </Box>
  );
};

export default ServiceProductPage;
