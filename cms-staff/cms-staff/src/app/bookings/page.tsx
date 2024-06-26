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

const BookingRequestPage = () => {
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      code: "BR001",
      nicheCode: "N001",
      customerName: "Nguyễn Văn A",
      phoneNumber: "0123456789",
      appointmentDate: "2023-07-01",
      contractAddress: "123 Đường A, TP. HCM",
      status: "Pending",
    },
    {
      id: 2,
      code: "BR002",
      nicheCode: "N002",
      customerName: "Trần Thị B",
      phoneNumber: "0987654321",
      appointmentDate: "2023-07-02",
      contractAddress: "456 Đường B, TP. HCM",
      status: "Completed",
    },
    // Thêm dữ liệu đơn đăng ký đặt chỗ ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("customerName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const handleAddBookingRequest = () => {
    // Logic để thêm mới đơn đăng ký đặt chỗ
    alert("Thêm mới đơn đăng ký đặt chỗ");
  };

  const handleViewBookingRequest = (id) => {
    // Logic để xem chi tiết đơn đăng ký đặt chỗ
    alert(`Xem chi tiết đơn đăng ký đặt chỗ với ID: ${id}`);
  };

  const handleEditBookingRequest = (id) => {
    // Logic để sửa đơn đăng ký đặt chỗ
    alert(`Sửa đơn đăng ký đặt chỗ với ID: ${id}`);
  };

  const handleDeleteBookingRequest = (id) => {
    // Logic để xóa đơn đăng ký đặt chỗ
    alert(`Xóa đơn đăng ký đặt chỗ với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBookingRequests = bookingRequests.sort((a, b) => {
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
    } else if (orderBy === "appointmentDate") {
      if (order === "asc") {
        return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      } else {
        return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      }
    } else if (orderBy === "contractAddress") {
      if (order === "asc") {
        return a.contractAddress.localeCompare(b.contractAddress);
      } else {
        return b.contractAddress.localeCompare(a.contractAddress);
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

  const filteredBookingRequests = sortedBookingRequests.filter(
    (bookingRequest) => {
      if (searchColumn === "customerName") {
        return bookingRequest.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "code") {
        return bookingRequest.code
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
          onClick={handleAddBookingRequest}
        >
          Thêm mới đơn đăng ký đặt chỗ
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
                  STT
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
                  active={orderBy === "appointmentDate"}
                  direction={orderBy === "appointmentDate" ? order : "asc"}
                  onClick={() => handleRequestSort("appointmentDate")}
                >
                  Ngày hẹn
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "contractAddress"}
                  direction={orderBy === "contractAddress" ? order : "asc"}
                  onClick={() => handleRequestSort("contractAddress")}
                >
                  Địa chỉ ký HĐ
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
            {filteredBookingRequests.map((bookingRequest, index) => (
              <TableRow key={bookingRequest.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{bookingRequest.code}</TableCell>
                <TableCell>{bookingRequest.nicheCode}</TableCell>
                <TableCell>{bookingRequest.customerName}</TableCell>
                <TableCell>{bookingRequest.phoneNumber}</TableCell>
                <TableCell>{bookingRequest.appointmentDate}</TableCell>
                <TableCell>{bookingRequest.contractAddress}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      bookingRequest.status === "Pending"
                        ? "Đang chờ"
                        : bookingRequest.status === "Completed"
                        ? "Hoàn thành"
                        : "Đã hủy"
                    }
                    color={
                      bookingRequest.status === "Pending"
                        ? "warning"
                        : bookingRequest.status === "Completed"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewBookingRequest(bookingRequest.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditBookingRequest(bookingRequest.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDeleteBookingRequest(bookingRequest.id)
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

export default BookingRequestPage;
