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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import VisitRequestAPI from "@/services/visitRequestService";
import { useToast } from "@/components/ui/use-toast";

const VisitRequestPage = () => {
  const [visitRequests, setVisitRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("note");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("visitId");
  const { toast } = useToast();

  useEffect(() => {
    const fetchVisitRequests = async () => {
      try {
        const response = await VisitRequestAPI.getAllVisitRequests();
        setVisitRequests(response.data.$values);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách đơn đăng ký viếng thăm",
        });
      }
    };

    fetchVisitRequests();
  }, [toast]);

  const handleAddVisitRequest = () => {
    alert("Thêm mới đơn đăng ký viếng thăm");
  };

  const handleViewVisitRequest = (id) => {
    alert(`Xem chi tiết đơn đăng ký viếng thăm với ID: ${id}`);
  };

  const handleEditVisitRequest = (id) => {
    alert(`Sửa đơn đăng ký viếng thăm với ID: ${id}`);
  };

  const handleDeleteVisitRequest = (id) => {
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
    if (orderBy === "visitId") {
      return order === "asc" ? a.visitId - b.visitId : b.visitId - a.visitId;
    } else if (orderBy === "nicheId") {
      return order === "asc" ? a.nicheId - b.nicheId : b.nicheId - a.nicheId;
    } else if (orderBy === "status") {
      return order === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else if (orderBy === "createdDate") {
      return order === "asc"
        ? new Date(a.createdDate) - new Date(b.createdDate)
        : new Date(b.createdDate) - new Date(a.createdDate);
    } else if (orderBy === "visitDate") {
      return order === "asc"
        ? new Date(a.visitDate) - new Date(b.visitDate)
        : new Date(b.visitDate) - new Date(a.visitDate);
    } else if (orderBy === "note") {
      return order === "asc"
        ? a.note.localeCompare(b.note)
        : b.note.localeCompare(a.note);
    }
    return 0;
  });

  const filteredVisitRequests = sortedVisitRequests.filter((visitRequest) => {
    if (searchColumn === "note") {
      return visitRequest.note.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "status") {
      return visitRequest.status
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
              <MenuItem value="note">Ghi chú</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
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
                  active={orderBy === "visitId"}
                  direction={orderBy === "visitId" ? order : "asc"}
                  onClick={() => handleRequestSort("visitId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "visitId"}
                  direction={orderBy === "visitId" ? order : "asc"}
                  onClick={() => handleRequestSort("visitId")}
                >
                  Mã đơn
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nicheId"}
                  direction={orderBy === "nicheId" ? order : "asc"}
                  onClick={() => handleRequestSort("nicheId")}
                >
                  Mã ô chứa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdDate"}
                  direction={orderBy === "createdDate" ? order : "asc"}
                  onClick={() => handleRequestSort("createdDate")}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "visitDate"}
                  direction={orderBy === "visitDate" ? order : "asc"}
                  onClick={() => handleRequestSort("visitDate")}
                >
                  Ngày viếng thăm
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
              <TableCell>Ghi chú</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVisitRequests.map((visitRequest, index) => (
              <TableRow key={visitRequest.visitId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{visitRequest.visitId}</TableCell>
                <TableCell>{visitRequest.nicheId}</TableCell>
                <TableCell>
                  {new Date(visitRequest.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(visitRequest.visitDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      visitRequest.status === "Đang chờ duyệt"
                        ? "Đang chờ"
                        : visitRequest.status === "Đã duyệt"
                        ? "Đã duyệt"
                        : "Đã hủy"
                    }
                    color={
                      visitRequest.status === "Đang chờ duyệt"
                        ? "warning"
                        : visitRequest.status === "Đã duyệt"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>{visitRequest.note}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewVisitRequest(visitRequest.visitId)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditVisitRequest(visitRequest.visitId)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDeleteVisitRequest(visitRequest.visitId)
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

export default VisitRequestPage;
