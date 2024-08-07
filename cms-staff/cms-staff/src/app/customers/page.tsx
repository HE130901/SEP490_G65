"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import CustomerViewDialog from "./CustomerDetail";
import CustomerEditDialog from "./CustomerEdit";

import { viVN } from "@/utils/viVN";
import { SelectChangeEvent } from "@mui/material";
import { useCustomers } from "@/context/CustomerContext";
import { Customer } from "@/context/interfaces";

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

const CustomerPage: React.FC = () => {
  const { customers, fetchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers(); // Fetch data on initial load
  }, []);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.customerId);
    setViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.customerId);
    setEditDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedCustomerId(null);
    fetchCustomers(); // Fetch dữ liệu sau khi đóng dialog
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCustomerId(null);
    fetchCustomers(); // Fetch dữ liệu sau khi đóng dialog
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value);
  };

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };
  const filteredCustomers = customers.filter((customer) => {
    const searchTermLower = removeAccents(searchTerm.toLowerCase());
    if (searchColumn === "all") {
      return (
        customer.fullName.toLowerCase().includes(searchTermLower) ||
        customer.customerId.toString().includes(searchTerm) ||
        customer.phone.toLowerCase().includes(searchTermLower) ||
        customer.email.toLowerCase().includes(searchTermLower) ||
        customer.address.toLowerCase().includes(searchTermLower) ||
        customer.citizenId.toLowerCase().includes(searchTermLower)
      );
    } else if (searchColumn === "fullName") {
      return customer.fullName.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "customerId") {
      return customer.customerId.toString().includes(searchTerm);
    } else if (searchColumn === "phone") {
      return customer.phone.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "email") {
      return customer.email.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "address") {
      return customer.address.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "citizenId") {
      return customer.citizenId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const columns: GridColDef[] = [
    {
      field: "customerId",
      headerName: "Mã KH",
      width: 140,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fullName",
      headerName: "Tên KH",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "phone",
      headerName: "SĐT",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "citizenId",
      headerName: "CCCD",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="info"
              onClick={() => handleViewCustomer(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="secondary"
              onClick={() => handleEditCustomer(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = filteredCustomers.map((item) => ({
    ...item,
    id: item.customerId,
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
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl variant="outlined" size="small" sx={{ marginRight: 2 }}>
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="fullName">Tên khách hàng</MenuItem>
              <MenuItem value="customerId">Mã khách hàng</MenuItem>
              <MenuItem value="phone">Số điện thoại</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="address">Địa chỉ</MenuItem>
              <MenuItem value="citizenId">CCCD</MenuItem>
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
            rows={rows}
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
      <CustomerViewDialog
        open={viewDialogOpen}
        customerId={selectedCustomerId}
        onClose={handleViewDialogClose}
      />
      <CustomerEditDialog
        open={editDialogOpen}
        customerId={selectedCustomerId}
        onClose={handleEditDialogClose}
      />
    </Box>
  );
};

export default CustomerPage;
