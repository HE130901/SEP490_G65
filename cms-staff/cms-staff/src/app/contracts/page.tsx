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

const ContractPage = () => {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      code: "HD001",
      nicheCode: "N001",
      customerName: "Nguyễn Văn A",
      signDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Active",
    },
    {
      id: 2,
      code: "HD002",
      nicheCode: "N002",
      customerName: "Trần Thị B",
      signDate: "2023-02-01",
      endDate: "2024-02-01",
      status: "Expired",
    },
    // Thêm dữ liệu hợp đồng ở đây
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("customerName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("code");

  const handleAddContract = () => {
    // Logic để thêm mới hợp đồng
    alert("Thêm mới hợp đồng");
  };

  const handleViewContract = (id) => {
    // Logic để xem chi tiết hợp đồng
    alert(`Xem chi tiết hợp đồng với ID: ${id}`);
  };

  const handleEditContract = (id) => {
    // Logic để sửa hợp đồng
    alert(`Sửa hợp đồng với ID: ${id}`);
  };

  const handleDeleteContract = (id) => {
    // Logic để xóa hợp đồng
    alert(`Xóa hợp đồng với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedContracts = contracts.sort((a, b) => {
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
    } else if (orderBy === "signDate") {
      if (order === "asc") {
        return new Date(a.signDate) - new Date(b.signDate);
      } else {
        return new Date(b.signDate) - new Date(a.signDate);
      }
    } else if (orderBy === "endDate") {
      if (order === "asc") {
        return new Date(a.endDate) - new Date(b.endDate);
      } else {
        return new Date(b.endDate) - new Date(a.endDate);
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

  const filteredContracts = sortedContracts.filter((contract) => {
    if (searchColumn === "customerName") {
      return contract.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchColumn === "code") {
      return contract.code.toLowerCase().includes(searchTerm.toLowerCase());
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
          onClick={handleAddContract}
        >
          Thêm mới hợp đồng
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
              <MenuItem value="code">Mã Hợp đồng</MenuItem>
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
                  Mã Hợp đồng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nicheCode"}
                  direction={orderBy === "nicheCode" ? order : "asc"}
                  onClick={() => handleRequestSort("nicheCode")}
                >
                  Mã Ô chứa
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
                  active={orderBy === "signDate"}
                  direction={orderBy === "signDate" ? order : "asc"}
                  onClick={() => handleRequestSort("signDate")}
                >
                  Ngày ký hợp đồng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "endDate"}
                  direction={orderBy === "endDate" ? order : "asc"}
                  onClick={() => handleRequestSort("endDate")}
                >
                  Ngày kết thúc
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
            {filteredContracts.map((contract, index) => (
              <TableRow key={contract.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contract.code}</TableCell>
                <TableCell>{contract.nicheCode}</TableCell>
                <TableCell>{contract.customerName}</TableCell>
                <TableCell>{contract.signDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      contract.status === "Active" ? "Còn hiệu lực" : "Quá hạn"
                    }
                    color={contract.status === "Active" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewContract(contract.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditContract(contract.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteContract(contract.id)}
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

export default ContractPage;
