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
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const ServiceProductPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      code: "SP001",
      name: "Dịch vụ 1",
      price: 50000,
      imageUrl: "/images/service1.jpg",
      category: "Dịch vụ",
      status: "Available",
    },
    {
      id: 2,
      code: "PR001",
      name: "Sản phẩm 1",
      price: 100000,
      imageUrl: "/images/product1.jpg",
      category: "Sản phẩm",
      status: "Out of Stock",
    },
    // Thêm dữ liệu dịch vụ và sản phẩm ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("name");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const handleAddItem = () => {
    // Logic để thêm mới dịch vụ hoặc sản phẩm
    alert("Thêm mới dịch vụ hoặc sản phẩm");
  };

  const handleViewItem = (id) => {
    // Logic để xem chi tiết dịch vụ hoặc sản phẩm
    alert(`Xem chi tiết dịch vụ hoặc sản phẩm với ID: ${id}`);
  };

  const handleEditItem = (id) => {
    // Logic để sửa dịch vụ hoặc sản phẩm
    alert(`Sửa dịch vụ hoặc sản phẩm với ID: ${id}`);
  };

  const handleDeleteItem = (id) => {
    // Logic để xóa dịch vụ hoặc sản phẩm
    alert(`Xóa dịch vụ hoặc sản phẩm với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedItems = items.sort((a, b) => {
    if (orderBy === "code") {
      if (order === "asc") {
        return a.code.localeCompare(b.code);
      } else {
        return b.code.localeCompare(a.code);
      }
    } else if (orderBy === "name") {
      if (order === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    } else if (orderBy === "price") {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    } else if (orderBy === "category") {
      if (order === "asc") {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
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

  const filteredItems = sortedItems.filter((item) => {
    if (searchColumn === "name") {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "code") {
      return item.code.toLowerCase().includes(searchTerm.toLowerCase());
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
          onClick={handleAddItem}
        >
          Thêm mới
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
              <MenuItem value="code">Mã</MenuItem>
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
                  Mã
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Tên
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={() => handleRequestSort("price")}
                >
                  Giá
                </TableSortLabel>
              </TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={() => handleRequestSort("category")}
                >
                  Phân loại
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
            {filteredItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price.toLocaleString()} VND</TableCell>
                <TableCell>
                  <Avatar alt={item.name} src={item.imageUrl} />
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      item.status === "Available" ? "Còn hàng" : "Hết hàng"
                    }
                    color={item.status === "Available" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewItem(item.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditItem(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
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

export default ServiceProductPage;
