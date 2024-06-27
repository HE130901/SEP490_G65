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
import CustomerAPI from "@/services/customerService";
import { useToast } from "@/components/ui/use-toast";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("fullName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("customerId");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomerAPI.getAllCustomers();
        setCustomers(response.data.$values);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách khách hàng",
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleAddCustomer = () => {
    alert("Thêm mới khách hàng");
  };

  const handleViewCustomer = (id) => {
    alert(`Xem chi tiết khách hàng với ID: ${id}`);
  };

  const handleEditCustomer = (id) => {
    alert(`Sửa khách hàng với ID: ${id}`);
  };

  const handleDeleteCustomer = (id) => {
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
    if (orderBy === "fullName") {
      if (order === "asc") {
        return a.fullName.localeCompare(b.fullName);
      } else {
        return b.fullName.localeCompare(a.fullName);
      }
    } else if (orderBy === "customerId") {
      return order === "asc"
        ? a.customerId - b.customerId
        : b.customerId - a.customerId;
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
    if (searchColumn === "fullName") {
      return customer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "customerId") {
      return customer.customerId.toString().includes(searchTerm);
    } else if (searchColumn === "phone") {
      return customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
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
              <MenuItem value="fullName">Tên khách hàng</MenuItem>
              <MenuItem value="customerId">Mã khách hàng</MenuItem>
              <MenuItem value="phone">Số điện thoại</MenuItem>
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
                  active={orderBy === "customerId"}
                  direction={orderBy === "customerId" ? order : "asc"}
                  onClick={() => handleRequestSort("customerId")}
                >
                  Mã Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleRequestSort("fullName")}
                >
                  Tên Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === "address"}
                  direction={orderBy === "address" ? order : "asc"}
                  onClick={() => handleRequestSort("address")}
                >
                  Địa chỉ
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "citizenId"}
                  direction={orderBy === "citizenId" ? order : "asc"}
                  onClick={() => handleRequestSort("citizenId")}
                >
                  CCCD
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.customerId}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.citizenId}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewCustomer(customer.customerId)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditCustomer(customer.customerId)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCustomer(customer.customerId)}
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
