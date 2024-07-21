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
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "react-toastify";
import AddBookingRequestDialog from "./NicheReservationAdd";
import ViewBookingRequestDialog from "./NicheReservationDetail";
import EditBookingRequestDialog from "./NicheReservationEdit";
import DeleteBookingRequestDialog from "./NicheReservationDelete";

const NicheReservationPage = (props: any) => {
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("reservationId");
  const [selectedBookingRequest, setSelectedBookingRequest] = useState<
    any | null
  >(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchBookingRequests = async () => {
    try {
      const response = await NicheReservationAPI.getAllNicheReservations();
      if (Array.isArray(response.data)) {
        setBookingRequests(response.data);
      } else {
        setBookingRequests(response.data.$values);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đặt chỗ");
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const handleAddBookingRequest = () => {
    setAddDialogOpen(true);
  };

  const handleViewBookingRequest = async (id: number) => {
    try {
      const response = await NicheReservationAPI.getNicheReservationDetails(id);
      setSelectedBookingRequest(response.data);
      setViewDialogOpen(true);
    } catch (error) {
      toast.error("Không thể tải chi tiết đơn đăng ký đặt chỗ");
    }
  };

  const handleEditBookingRequest = (bookingRequest: any) => {
    setSelectedBookingRequest(bookingRequest);
    setEditDialogOpen(true);
  };

  const handleDeleteBookingRequest = (bookingRequest: any) => {
    setSelectedBookingRequest(bookingRequest);
    setDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedBookingRequest(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBookingRequest(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedBookingRequest(null);
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (selectedBookingRequest) {
        await NicheReservationAPI.deleteNicheReservation(
          selectedBookingRequest.reservationId
        );
      }
      toast.success("Đã xoá đơn đăng ký đặt chỗ thành công");
      fetchBookingRequests();
      setDeleteDialogOpen(false);
      setSelectedBookingRequest(null);
    } catch (error) {
      toast.error("Không thể xoá đơn đăng ký đặt chỗ");
    }
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value as string);
  };

  const handleRequestSort = (property: string) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBookingRequests = bookingRequests.sort((a, b) => {
    if (orderBy === "reservationId") {
      return order === "asc"
        ? a.reservationId - b.reservationId
        : b.reservationId - a.reservationId;
    } else if (orderBy === "nicheAddress") {
      return order === "asc"
        ? (a.nicheAddress || "").localeCompare(b.nicheAddress || "")
        : (b.nicheAddress || "").localeCompare(a.nicheAddress || "");
    } else if (orderBy === "phoneNumber") {
      return order === "asc"
        ? (a.phoneNumber || "").localeCompare(b.phoneNumber || "")
        : (b.phoneNumber || "").localeCompare(a.phoneNumber || "");
    } else if (orderBy === "createdDate") {
      return order === "asc"
        ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    } else if (orderBy === "confirmationDate") {
      return order === "asc"
        ? new Date(a.confirmationDate).getTime() -
            new Date(b.confirmationDate).getTime()
        : new Date(b.confirmationDate).getTime() -
            new Date(a.confirmationDate).getTime();
    } else if (orderBy === "status") {
      return order === "asc"
        ? (a.status || "").localeCompare(b.status || "")
        : (b.status || "").localeCompare(a.status || "");
    }
    return 0;
  });

  const filteredBookingRequests = sortedBookingRequests.filter(
    (bookingRequest) => {
      if (searchColumn === "all") {
        return (
          bookingRequest.nicheAddress
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.phoneNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.reservationId
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.createdDate
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.confirmationDate
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.status
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      } else if (searchColumn === "nicheAddress") {
        return bookingRequest.nicheAddress
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "phoneNumber") {
        return bookingRequest.phoneNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "reservationId") {
        return bookingRequest.reservationId
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "createdDate") {
        return new Date(bookingRequest.createdDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "confirmationDate") {
        return new Date(bookingRequest.confirmationDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "status") {
        return bookingRequest.status
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    }
  );

  const getStatusChip = (status: string) => {
    let color: "default" | "error" | "warning" = "default";
    let label = "";
    let sx = {};

    switch (status) {
      case "Canceled":
        color = "error";
        label = "Đã hủy";
        break;
      case "Approved":
        label = "Đã duyệt";
        sx = { backgroundColor: "green", color: "white" };
        break;
      default:
        color = "warning";
        label = "Chờ duyệt";
        break;
    }

    return <Chip label={label} color={color} sx={sx} />;
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
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="nicheAddress">Địa chỉ</MenuItem>
              <MenuItem value="phoneNumber">Số điện thoại</MenuItem>
              <MenuItem value="reservationId">Mã đơn</MenuItem>
              <MenuItem value="createdDate">Ngày tạo</MenuItem>
              <MenuItem value="confirmationDate">Ngày xác nhận</MenuItem>
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
                  active={orderBy === "reservationId"}
                  direction={
                    orderBy === "reservationId"
                      ? (order as "desc" | "asc")
                      : "asc"
                  }
                  onClick={() => handleRequestSort("reservationId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "reservationId"}
                  direction={
                    orderBy === "reservationId"
                      ? (order as "desc" | "asc")
                      : undefined
                  }
                  onClick={() => handleRequestSort("reservationId")}
                >
                  Mã đơn
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "nicheAddress"}
                  direction={
                    orderBy === "nicheAddress"
                      ? (order as "desc" | "asc")
                      : undefined
                  }
                  onClick={() => handleRequestSort("nicheAddress")}
                >
                  Địa chỉ ô chứa
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "createdDate"}
                  direction={
                    orderBy === "createdDate"
                      ? (order as "desc" | "asc")
                      : undefined
                  }
                  onClick={() => handleRequestSort("createdDate")}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "confirmationDate"}
                  direction={
                    orderBy === "confirmationDate"
                      ? (order as "desc" | "asc")
                      : undefined
                  }
                  onClick={() => handleRequestSort("confirmationDate")}
                >
                  Ngày hẹn
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={
                    orderBy === "phoneNumber"
                      ? (order as "asc" | "desc")
                      : undefined
                  }
                  onClick={() => handleRequestSort("phoneNumber")}
                >
                  Số điện thoại
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={
                    orderBy === "status" ? (order as "desc" | "asc") : undefined
                  }
                  onClick={() => handleRequestSort("status")}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookingRequests.map((bookingRequest, index) => (
              <TableRow key={bookingRequest.reservationId}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">
                  {bookingRequest.reservationId}
                </TableCell>
                <TableCell align="center">
                  {bookingRequest.nicheAddress}
                </TableCell>
                <TableCell align="center">
                  {new Date(bookingRequest.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {new Date(
                    bookingRequest.confirmationDate
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {bookingRequest.phoneNumber}
                </TableCell>
                <TableCell align="center">
                  {getStatusChip(bookingRequest.status)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleViewBookingRequest(bookingRequest.reservationId)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEditBookingRequest(bookingRequest)}
                      disabled={bookingRequest.status === "Canceled"}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hủy đơn">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteBookingRequest(bookingRequest)}
                      disabled={
                        bookingRequest.status === "Approved" ||
                        bookingRequest.status === "Canceled"
                      }
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddBookingRequestDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onAddSuccess={fetchBookingRequests}
      />
      <ViewBookingRequestDialog
        open={viewDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleViewDialogClose}
        onConfirmSuccess={fetchBookingRequests}
      />
      <EditBookingRequestDialog
        open={editDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleEditDialogClose}
        onUpdateSuccess={fetchBookingRequests}
      />
      <DeleteBookingRequestDialog
        open={deleteDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default NicheReservationPage;
