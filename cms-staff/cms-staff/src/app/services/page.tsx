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
import ServiceAdd from "./ServiceAdd";
import { formatVND } from "@/utils/formatCurrency";
import { useServiceContext } from "@/context/ServiceContext";
import { Service } from "@/context/interfaces";

import { viVN } from "@/utils/viVN";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Unavailable":
      return { label: "Đã hết hàng", color: "error" };
    case "Removed":
      return { label: "Đã dừng bán", color: "error" };
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
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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

const CenteredCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

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

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value);
  };

  // Hàm chuyển đổi chuỗi tiếng Việt về dạng không dấu
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredItems = services.filter((item) => {
    const searchTermLower = removeAccents(searchTerm.toLowerCase());

    const itemServiceName = removeAccents(item.serviceName.toLowerCase());
    const itemCategory = removeAccents(item.category.toLowerCase());
    const itemTag = removeAccents(item.tag.toLowerCase());

    if (searchColumn === "all") {
      return (
        itemServiceName.includes(searchTermLower) ||
        item.serviceId.toString().includes(searchTermLower) ||
        item.price.toString().includes(searchTermLower) ||
        itemCategory.includes(searchTermLower) ||
        itemTag.includes(searchTermLower)
      );
    } else if (searchColumn === "serviceName") {
      return itemServiceName.includes(searchTermLower);
    } else if (searchColumn === "serviceId") {
      return item.serviceId.toString().includes(searchTermLower);
    } else if (searchColumn === "price") {
      return item.price.toString().includes(searchTermLower);
    } else if (searchColumn === "category") {
      return itemCategory.includes(searchTermLower);
    } else if (searchColumn === "tag") {
      return itemTag.includes(searchTermLower);
    }
    return true;
  });

  const columns: GridColDef[] = [
    {
      field: "serviceId",
      headerName: "ID",
      width: 90,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "serviceName",
      headerName: "Tên",
      width: 220,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "price",
      headerName: "Giá (VND)",
      width: 170,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>{formatVND(params.value as number)}</CenteredCell>
      ),
    },
    {
      field: "category",
      headerName: "Phân loại",
      width: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "tag",
      headerName: "Thẻ",
      width: 130,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "servicePicture",
      headerName: "Ảnh",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>
          <Avatar
            src={params.row.servicePicture}
            alt={params.row.serviceName}
          />
        </CenteredCell>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const { label, color } = getStatusLabel(params.value);
        return (
          <CenteredCell>
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
          </CenteredCell>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết">
            <IconButton color="info" onClick={() => handleViewItem(params.row)}>
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
        </CenteredCell>
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
          onClick={handleAddItem}
        >
          Thêm mới
        </Button>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl variant="outlined" size="small" sx={{ marginRight: 2 }}>
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="serviceName">Tên</MenuItem>
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
            rows={filteredItems.map((items, index) => ({
              ...items,
              id: index + 1,
            }))}
            columns={columns}
            autoHeight
            localeText={viVN}
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
