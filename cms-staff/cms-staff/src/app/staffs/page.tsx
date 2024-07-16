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
  Chip,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import EmployeeAPI from "@/services/employeeService";
import { useToast } from "@/components/ui/use-toast";
import EmployeeDetail from "./EmployeeDetail";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeDelete from "./EmployeeDelete";
import EmployeeAdd from "./EmployeeAdd";

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employeeId");
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await EmployeeAPI.getAllEmployees();
        setEmployees(response.data.$values); // Assuming the API response has the data in "$values"
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách nhân viên",
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  const handleAddItem = () => {
    setAddOpen(true);
  };

  const handleViewItem = (employee) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  const handleEditItem = (employee) => {
    setSelectedEmployee(employee);
    setEditOpen(true);
  };

  const handleDeleteItem = (employee) => {
    setSelectedEmployee(employee);
    setDeleteOpen(true);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedItems = employees.sort((a, b) => {
    if (orderBy === "employeeId") {
      return order === "asc"
        ? a.employeeId - b.employeeId
        : b.employeeId - a.employeeId;
    } else if (orderBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (orderBy === "position") {
      return order === "asc"
        ? a.position.localeCompare(b.position)
        : b.position.localeCompare(a.position);
    } else if (orderBy === "department") {
      return order === "asc"
        ? a.department.localeCompare(b.department)
        : b.department.localeCompare(a.department);
    }
    return 0;
  });

  const filteredItems = sortedItems.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    if (searchColumn === "all") {
      return (
        item.name.toLowerCase().includes(searchTermLower) ||
        item.employeeId.toString().includes(searchTermLower) ||
        item.position.toLowerCase().includes(searchTermLower) ||
        item.department.toLowerCase().includes(searchTermLower)
      );
    } else if (searchColumn === "name") {
      return item.name.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "employeeId") {
      return item.employeeId.toString().includes(searchTermLower);
    } else if (searchColumn === "position") {
      return item.position.toLowerCase().includes(searchTermLower);
    } else if (searchColumn === "department") {
      return item.department.toLowerCase().includes(searchTermLower);
    }
    return true;
  });

  const handleCloseView = () => {
    setSelectedEmployee(null);
    setViewOpen(false);
  };

  const handleCloseEdit = () => {
    setSelectedEmployee(null);
    setEditOpen(false);
  };

  const handleCloseDelete = () => {
    setSelectedEmployee(null);
    setDeleteOpen(false);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
  };

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
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="name">Tên</MenuItem>
              <MenuItem value="employeeId">ID</MenuItem>
              <MenuItem value="position">Chức vụ</MenuItem>
              <MenuItem value="department">Phòng ban</MenuItem>
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
                  active={orderBy === "employeeId"}
                  direction={orderBy === "employeeId" ? order : "asc"}
                  onClick={() => handleRequestSort("employeeId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "employeeId"}
                  direction={orderBy === "employeeId" ? order : "asc"}
                  onClick={() => handleRequestSort("employeeId")}
                >
                  ID
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
                  active={orderBy === "position"}
                  direction={orderBy === "position" ? order : "asc"}
                  onClick={() => handleRequestSort("position")}
                >
                  Chức vụ
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "department"}
                  direction={orderBy === "department" ? order : "asc"}
                  onClick={() => handleRequestSort("department")}
                >
                  Phòng ban
                </TableSortLabel>
              </TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={item.employeeId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.employeeId}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>
                  <Avatar alt={item.name} src={item.profilePicture} />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewItem(item)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditItem(item)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EmployeeDetail
        employee={selectedEmployee}
        onClose={handleCloseView}
        open={viewOpen}
      />
      <EmployeeEdit
        employee={selectedEmployee}
        onClose={handleCloseEdit}
        open={editOpen}
        onSave={(updatedEmployee) => {
          setEmployees(
            employees.map((item) =>
              item.employeeId === updatedEmployee.employeeId
                ? updatedEmployee
                : item
            )
          );
          handleCloseEdit();
        }}
      />
      <EmployeeDelete
        employee={selectedEmployee}
        onClose={handleCloseDelete}
        open={deleteOpen}
        onDelete={(employeeId) => {
          setEmployees(
            employees.filter((item) => item.employeeId !== employeeId)
          );
          handleCloseDelete();
        }}
      />
      <EmployeeAdd
        open={addOpen}
        onClose={handleCloseAdd}
        onAdd={(newEmployee) => {
          setEmployees([...employees, newEmployee]);
          handleCloseAdd();
        }}
      />
    </Box>
  );
};

export default EmployeeManagementPage;
