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

const VisitRequestPage = () => {
  const [visitRequests, setVisitRequests] = useState([
    {
      id: 1,
      code: "VR001",
      nicheCode: "N001",
      customerName: "Nguyễn Văn A",
      phoneNumber: "0123456789",
      appointmentTime: "2023-07-01T10:00",
      status: "Pending",
    },
    {
      id: 2,
      code: "VR002",
      nicheCode: "N002",
      customerName: "Trần Thị B",
      phoneNumber: "0987654321",
      appointmentTime: "2023-07-02T11:00",
      status: "Completed",
    },
    // Thêm dữ liệu đơn đăng ký viếng thăm ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("customerName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const handleAddVisitRequest = () => {
    // Logic để thêm mới đơn đăng ký viếng thăm
    alert("Thêm mới đơn đăng ký viếng thăm");
  };

  const handleViewVisitRequest = (id) => {
    // Logic để xem chi tiết đơn đăng ký viếng thăm
    alert(`Xem chi tiết đơn đăng ký viếng thăm với ID: ${id}`);
  };

  const handleEditVisitRequest = (id) => {
    // Logic để sửa đơn đăng ký viếng thăm
    alert(`Sửa đơn đăng ký viếng thăm với ID: ${id}`);
  };

  const handleDeleteVisitRequest = (id) => {
    // Logic để xóa đơn đăng ký viếng thăm
    alert(`Xóa đơn đăng ký viếng thăm với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedVisitRequests = visitRequests.sort((a, b) => {
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
    } else if (orderBy === "phoneNumber") {
      if (order === "asc") {
        return a.phoneNumber.localeCompare(b.phoneNumber);
      } else {
        return b.phoneNumber.localeCompare(a.phoneNumber);
      }
    } else if (orderBy === "appointmentTime") {
      if (order === "asc") {
        return new Date(a.appointmentTime) - new Date(b.appointmentTime);
      } else {
        return new Date(b.appointmentTime) - new Date(a.appointmentTime);
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

  const filteredVisitRequests = sortedVisitRequests.filter((visitRequest) => {
    if (searchColumn === "customerName") {
      return visitRequest.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchColumn === "code") {
      return visitRequest.code.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

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
          onClick={handleAddVisitRequest}
        >
          Thêm mới đơn đăng ký viếng thăm
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
                  Mã ô
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={orderBy === "phoneNumber" ? order : "asc"}
                  onClick={() => handleRequestSort("phoneNumber")}
                >
                  Số điện thoại
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "appointmentTime"}
                  direction={orderBy === "appointmentTime" ? order : "asc"}
                  onClick={() => handleRequestSort("appointmentTime")}
                >
                  Thời gian hẹn
                </TableSortLabel>
              </TableCell>
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
            {filteredVisitRequests.map((visitRequest, index) => (
              <TableRow key={visitRequest.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{visitRequest.code}</TableCell>
                <TableCell>{visitRequest.nicheCode}</TableCell>
                <TableCell>{visitRequest.customerName}</TableCell>
                <TableCell>{visitRequest.phoneNumber}</TableCell>
                <TableCell>{visitRequest.appointmentTime}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      visitRequest.status === "Pending"
                        ? "Đang chờ"
                        : visitRequest.status === "Completed"
                        ? "Hoàn thành"
                        : "Đã hủy"
                    }
                    color={
                      visitRequest.status === "Pending"
                        ? "warning"
                        : visitRequest.status === "Completed"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewVisitRequest(visitRequest.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditVisitRequest(visitRequest.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteVisitRequest(visitRequest.id)}
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

export default VisitRequestPage;
