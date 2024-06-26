"use client";

import React, { useState } from "react";
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const ServiceRequestPage = () => {
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      code: "SR001",
      nicheCode: "N001",
      customerName: "Nguyễn Văn A",
      services: [
        { name: "Dịch vụ 1", quantity: 2 },
        { name: "Dịch vụ 2", quantity: 1 },
      ],
      status: "Pending",
    },
    {
      id: 2,
      code: "SR002",
      nicheCode: "N002",
      customerName: "Trần Thị B",
      services: [{ name: "Dịch vụ 3", quantity: 1 }],
      status: "Completed",
    },
    // Thêm dữ liệu đơn đăng ký dùng dịch vụ ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("customerName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const handleAddServiceRequest = () => {
    // Logic để thêm mới đơn đăng ký dùng dịch vụ
    alert("Thêm mới đơn đăng ký dùng dịch vụ");
  };

  const handleViewServiceRequest = (id) => {
    // Logic để xem chi tiết đơn đăng ký dùng dịch vụ
    alert(`Xem chi tiết đơn đăng ký dùng dịch vụ với ID: ${id}`);
  };

  const handleEditServiceRequest = (id) => {
    // Logic để sửa đơn đăng ký dùng dịch vụ
    alert(`Sửa đơn đăng ký dùng dịch vụ với ID: ${id}`);
  };

  const handleDeleteServiceRequest = (id) => {
    // Logic để xóa đơn đăng ký dùng dịch vụ
    alert(`Xóa đơn đăng ký dùng dịch vụ với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedServiceRequests = serviceRequests.sort((a, b) => {
    if (orderBy === "code") {
      if (order === "asc") {
        return a.code.localeCompare(b.code);
      } else {
        return b.code.localeCompare(a.code);
      }
    } else if (orderBy === "nicheCode") {
      if (order === "asc") {
        return a.nicheCode.localeCompare(b.nicheCode);
      } else {
        return b.nicheCode.localeCompare(a.nicheCode);
      }
    } else if (orderBy === "customerName") {
      if (order === "asc") {
        return a.customerName.localeCompare(b.customerName);
      } else {
        return b.customerName.localeCompare(a.customerName);
      }
    } else if (orderBy === "status") {
      if (order === "asc") {
        return a.status.localeCompare(b.status);
      } else {
        return b.status.localeCompare(a.status);
      }
    }
    return 0;
  });

  const filteredServiceRequests = sortedServiceRequests.filter(
    (serviceRequest) => {
      if (searchColumn === "customerName") {
        return serviceRequest.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "code") {
        return serviceRequest.code
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    }
  );

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
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            sx={{ minWidth: 120, marginRight: 2 }}
          >
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="customerName">Tên khách hàng</MenuItem>
              <MenuItem value="code">Mã đơn</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                >
                  Số thứ tự
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "code"}
                  direction={orderBy === "code" ? order : "asc"}
                  onClick={() => handleRequestSort("code")}
                >
                  Mã đơn
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nicheCode"}
                  direction={orderBy === "nicheCode" ? order : "asc"}
                  onClick={() => handleRequestSort("nicheCode")}
                >
                  Mã ô chứa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : "asc"}
                  onClick={() => handleRequestSort("customerName")}
                >
                  Tên Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServiceRequests.map((serviceRequest, index) => (
              <TableRow key={serviceRequest.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{serviceRequest.code}</TableCell>
                <TableCell>{serviceRequest.nicheCode}</TableCell>
                <TableCell>{serviceRequest.customerName}</TableCell>
                <TableCell>
                  {serviceRequest.services.map((service, idx) => (
                    <div key={idx}>
                      {service.name} (x{service.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      serviceRequest.status === "Pending"
                        ? "Đang chờ"
                        : serviceRequest.status === "Completed"
                        ? "Hoàn thành"
                        : "Đã hủy"
                    }
                    color={
                      serviceRequest.status === "Pending"
                        ? "warning"
                        : serviceRequest.status === "Completed"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewServiceRequest(serviceRequest.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditServiceRequest(serviceRequest.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDeleteServiceRequest(serviceRequest.id)
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
    </Box>
  );
};

export default ServiceRequestPage;
