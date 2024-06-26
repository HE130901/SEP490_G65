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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([
    { id: 1, code: "KH001", name: "Nguyễn Văn A", phone: "0901234567" },
    { id: 2, code: "KH002", name: "Trần Thị B", phone: "0907654321" },
    // Thêm dữ liệu khách hàng ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("name");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const handleAddCustomer = () => {
    // Logic để thêm mới khách hàng
    alert("Thêm mới khách hàng");
  };

  const handleViewCustomer = (id) => {
    // Logic để xem chi tiết khách hàng
    alert(`Xem chi tiết khách hàng với ID: ${id}`);
  };

  const handleEditCustomer = (id) => {
    // Logic để sửa khách hàng
    alert(`Sửa khách hàng với ID: ${id}`);
  };

  const handleDeleteCustomer = (id) => {
    // Logic để xóa khách hàng
    alert(`Xóa khách hàng với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCustomers = customers.sort((a, b) => {
    if (orderBy === "name") {
      if (order === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    } else if (orderBy === "code") {
      if (order === "asc") {
        return a.code.localeCompare(b.code);
      } else {
        return b.code.localeCompare(a.code);
      }
    } else if (orderBy === "phone") {
      if (order === "asc") {
        return a.phone.localeCompare(b.phone);
      } else {
        return b.phone.localeCompare(a.phone);
      }
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter((customer) => {
    if (searchColumn === "name") {
      return customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "code") {
      return customer.code.toLowerCase().includes(searchTerm.toLowerCase());
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
          onClick={handleAddCustomer}
        >
          Thêm mới khách hàng
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
              <MenuItem value="name">Tên</MenuItem>
              <MenuItem value="code">Mã Khách hàng</MenuItem>
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
                  Mã Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Tên Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "phone"}
                  direction={orderBy === "phone" ? order : "asc"}
                  onClick={() => handleRequestSort("phone")}
                >
                  Số điện thoại
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customer.code}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewCustomer(customer.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditCustomer(customer.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCustomer(customer.id)}
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

export default CustomerPage;
