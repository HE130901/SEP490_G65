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
import { SelectChangeEvent } from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import CustomerAPI from "@/services/customerService";
import { useToast } from "@/components/ui/use-toast";
import CustomerViewDialog from "./CustomerDetail";
import CustomerEditDialog from "./CustomerEdit";
import { Customer } from "./interfaces";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("fullName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Customer>("customerId");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property: keyof Customer) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCustomers = customers.sort((a, b) => {
    if (orderBy === "fullName") {
      return order === "asc"
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName);
    } else if (orderBy === "customerId") {
      return order === "asc"
        ? a.customerId - b.customerId
        : b.customerId - a.customerId;
    } else if (orderBy === "phone") {
      return order === "asc"
        ? a.phone.localeCompare(b.phone)
        : b.phone.localeCompare(a.phone);
    } else if (orderBy === "email") {
      return order === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (orderBy === "address") {
      return order === "asc"
        ? a.address.localeCompare(b.address)
        : b.address.localeCompare(a.address);
    } else if (orderBy === "citizenId") {
      return order === "asc"
        ? a.citizenId.localeCompare(b.citizenId)
        : b.citizenId.localeCompare(a.citizenId);
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
    } else if (searchColumn === "email") {
      return customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "address") {
      return customer.address.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "citizenId") {
      return customer.citizenId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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
        <Box display="flex" alignItems="center" ml="auto">
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
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="address">Địa chỉ</MenuItem>
              <MenuItem value="citizenId">CCCD</MenuItem>
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
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "customerId"}
                  direction={orderBy === "customerId" ? order : "asc"}
                  onClick={() => handleRequestSort("customerId")}
                >
                  Mã Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleRequestSort("fullName")}
                >
                  Tên Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "phone"}
                  direction={orderBy === "phone" ? order : "asc"}
                  onClick={() => handleRequestSort("phone")}
                >
                  Số điện thoại
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "address"}
                  direction={orderBy === "address" ? order : "asc"}
                  onClick={() => handleRequestSort("address")}
                >
                  Địa chỉ
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "citizenId"}
                  direction={orderBy === "citizenId" ? order : "asc"}
                  onClick={() => handleRequestSort("citizenId")}
                >
                  CCCD
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell align="center">{customer.customerId}</TableCell>
                <TableCell align="center">{customer.fullName}</TableCell>
                <TableCell align="center">{customer.email}</TableCell>
                <TableCell align="center">{customer.phone}</TableCell>
                <TableCell align="center">{customer.address}</TableCell>
                <TableCell align="center">{customer.citizenId}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomerViewDialog
        open={viewDialogOpen}
        customer={selectedCustomer}
        onClose={handleViewDialogClose}
      />
      <CustomerEditDialog
        open={editDialogOpen}
        customer={selectedCustomer}
        onClose={handleEditDialogClose}
      />
    </Box>
  );
};

export default CustomerPage;
