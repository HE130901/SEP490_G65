"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
  Tooltip,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import VisitRegistrationAPI from "@/services/visitRegistrationService";
import { useToast } from "@/components/ui/use-toast";
import AddVisitRequestDialog from "./VisitRegistrationAdd";
import ViewVisitRequestDialog from "./VisitRegistrationDetail";
import EditVisitRequestDialog from "./VisitRegistrationEdit";
import DeleteVisitRequestDialog from "./VisitRegistrationDelete";
import { VisitRequest } from "./interfaces";

const VisitRegistrationPage: React.FC = () => {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("visitId");
  const { toast } = useToast();
  const [selectedVisitRequest, setSelectedVisitRequest] =
    useState<VisitRequest | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchVisitRequests = async () => {
      try {
        const response = await VisitRegistrationAPI.getAllVisitRegistrations();
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
    setAddDialogOpen(true);
  };

  const handleViewVisitRequest = (visitRequest: VisitRequest) => {
    setSelectedVisitRequest(visitRequest);
    setViewDialogOpen(true);
  };

  const handleEditVisitRequest = (visitRequest: VisitRequest) => {
    setSelectedVisitRequest(visitRequest);
    setEditDialogOpen(true);
  };

  const handleDeleteVisitRequest = (visitRequest: VisitRequest) => {
    setSelectedVisitRequest(visitRequest);
    setDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedVisitRequest(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedVisitRequest(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedVisitRequest(null);
  };

  const handleDeleteConfirmed = () => {
    // Add delete logic here
    setDeleteDialogOpen(false);
    setSelectedVisitRequest(null);
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value as string);
  };

  const handleRequestSort = (property: string) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedVisitRequests = visitRequests.sort((a, b) => {
    if (orderBy === "visitId") {
      return order === "asc"
        ? Number(a.visitId) - Number(b.visitId)
        : Number(b.visitId) - Number(a.visitId);
    } else if (orderBy === "nicheId") {
      return order === "asc"
        ? Number(a.nicheId) - Number(b.nicheId)
        : Number(b.nicheId) - Number(a.nicheId);
    } else if (orderBy === "status") {
      return order === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    } else if (orderBy === "createdDate") {
      return order === "asc"
        ? a.createdDate && b.createdDate
          ? new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
          : 0
        : a.createdDate && b.createdDate
        ? new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        : 0;
    } else if (orderBy === "visitDate") {
      return order === "asc"
        ? new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
        : new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
    } else if (orderBy === "note") {
      return order === "asc"
        ? a.note.localeCompare(b.note)
        : b.note.localeCompare(a.note);
    }
    return 0;
  });

  const filteredVisitRequests = sortedVisitRequests.filter((visitRequest) => {
    if (searchColumn === "all") {
      return (
        visitRequest.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitRequest.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitRequest.visitId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        visitRequest.nicheId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    } else if (searchColumn === "note") {
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
              onChange={(event: SelectChangeEvent<string>) =>
                handleSearchColumnChange(event)
              }
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
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
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "visitId"}
                  direction={orderBy === "visitId" ? order : "asc"}
                  onClick={() => handleRequestSort("visitId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "visitId"}
                  direction={orderBy === "visitId" ? order : "asc"}
                  onClick={() => handleRequestSort("visitId")}
                >
                  Mã đơn
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "nicheId"}
                  direction={orderBy === "nicheId" ? order : "asc"}
                  onClick={() => handleRequestSort("nicheId")}
                >
                  Mã ô chứa
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "createdDate"}
                  direction={orderBy === "createdDate" ? order : "asc"}
                  onClick={() => handleRequestSort("createdDate")}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "visitDate"}
                  direction={orderBy === "visitDate" ? order : "asc"}
                  onClick={() => handleRequestSort("visitDate")}
                >
                  Ngày viếng thăm
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Địa chỉ</TableCell>
              <TableCell align="center">Ghi chú</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVisitRequests.map((visitRequest, index) => (
              <TableRow key={visitRequest.visitId}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{visitRequest.visitId}</TableCell>
                <TableCell align="center">{visitRequest.nicheId}</TableCell>
                <TableCell align="center">
                  {new Date(
                    visitRequest.createdDate ?? ""
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {new Date(visitRequest.visitDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
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
                <TableCell align="center">
                  <Tooltip title={visitRequest.signAddress}>
                    <span className="truncate">{visitRequest.signAddress}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={visitRequest.note}>
                    <span className="truncate">{visitRequest.note}</span>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewVisitRequest(visitRequest)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditVisitRequest(visitRequest)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteVisitRequest(visitRequest)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddVisitRequestDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      />
      <ViewVisitRequestDialog
        open={viewDialogOpen}
        visitRequest={selectedVisitRequest}
        onClose={handleViewDialogClose}
      />
      <EditVisitRequestDialog
        open={editDialogOpen}
        visitRequest={selectedVisitRequest}
        onClose={handleEditDialogClose}
      />
      <DeleteVisitRequestDialog
        open={deleteDialogOpen}
        visitRequest={selectedVisitRequest}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default VisitRegistrationPage;
