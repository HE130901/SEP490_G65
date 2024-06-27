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
import ServiceAPI from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import ServiceDetail from "./ServiceDetail";
import ServiceEdit from "./ServiceEdit";
import ServiceDelete from "./ServiceDelete";
import ServiceAdd from "./ServiceAdd";

const ServiceProductPage = () => {
  const [items, setItems] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("serviceName");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serviceId");
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceAPI.getAllServices();
        setItems(response.data.$values); // Assuming the API response has the data in "$values"
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách dịch vụ",
        });
      }
    };

    fetchServices();
  }, [toast]);

  const handleAddItem = () => {
    setAddOpen(true);
  };

  const handleViewItem = (service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  const handleEditItem = (service) => {
    setSelectedService(service);
    setEditOpen(true);
  };

  const handleDeleteItem = (service) => {
    setSelectedService(service);
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

  const sortedItems = items.sort((a, b) => {
    if (orderBy === "serviceId") {
      return order === "asc"
        ? a.serviceId - b.serviceId
        : b.serviceId - a.serviceId;
    } else if (orderBy === "serviceName") {
      return order === "asc"
        ? a.serviceName.localeCompare(b.serviceName)
        : b.serviceName.localeCompare(a.serviceName);
    } else if (orderBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    } else if (orderBy === "category") {
      return order === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  const filteredItems = sortedItems.filter((item) => {
    if (searchColumn === "serviceName") {
      return item.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "serviceId") {
      return item.serviceId.toString().includes(searchTerm);
    }
    return true;
  });

  const handleCloseView = () => {
    setSelectedService(null);
    setViewOpen(false);
  };

  const handleCloseEdit = () => {
    setSelectedService(null);
    setEditOpen(false);
  };

  const handleCloseDelete = () => {
    setSelectedService(null);
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
              <MenuItem value="serviceName">Tên</MenuItem>
              <MenuItem value="serviceId">ID</MenuItem>
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
                  active={orderBy === "serviceId"}
                  direction={orderBy === "serviceId" ? order : "asc"}
                  onClick={() => handleRequestSort("serviceId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "serviceId"}
                  direction={orderBy === "serviceId" ? order : "asc"}
                  onClick={() => handleRequestSort("serviceId")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "serviceName"}
                  direction={orderBy === "serviceName" ? order : "asc"}
                  onClick={() => handleRequestSort("serviceName")}
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
              <TableCell>Thẻ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={item.serviceId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.serviceId}</TableCell>
                <TableCell>{item.serviceName}</TableCell>
                <TableCell>{item.price.toLocaleString()} VND</TableCell>
                <TableCell>
                  <Avatar alt={item.serviceName} src={item.servicePicture} />
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.tag}</TableCell>
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
      <ServiceDetail
        service={selectedService}
        onClose={handleCloseView}
        open={viewOpen}
      />
      <ServiceEdit
        service={selectedService}
        onClose={handleCloseEdit}
        open={editOpen}
        onSave={(updatedService) => {
          setItems(
            items.map((item) =>
              item.serviceId === updatedService.serviceId
                ? updatedService
                : item
            )
          );
          handleCloseEdit();
        }}
      />
      <ServiceDelete
        service={selectedService}
        onClose={handleCloseDelete}
        open={deleteOpen}
        onDelete={(serviceId) => {
          setItems(items.filter((item) => item.serviceId !== serviceId));
          handleCloseDelete();
        }}
      />
      <ServiceAdd
        open={addOpen}
        onClose={handleCloseAdd}
        onAdd={(newService) => {
          setItems([...items, newService]);
          handleCloseAdd();
        }}
      />
    </Box>
  );
};

export default ServiceProductPage;
