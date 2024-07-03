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
import BookingAPI from "@/services/bookingService";
import { useToast } from "@/components/ui/use-toast";
import AddBookingRequestDialog from "./AddBookingRequestDialog";
import ViewBookingRequestDialog from "./ViewBookingRequestDialog";
import EditBookingRequestDialog from "./EditBookingRequestDialog";
import DeleteBookingRequestDialog from "./DeleteBookingRequestDialog";

const BookingRequestPage = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("reservationId");
  const { toast } = useToast();
  const [selectedBookingRequest, setSelectedBookingRequest] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await BookingAPI.getAllBookings();
        setBookingRequests(response.data.$values);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách đơn đặt chỗ",
        });
      }
    };

    fetchBookingRequests();
  }, [toast]);

  const handleAddBookingRequest = () => {
    setAddDialogOpen(true);
  };

  const handleViewBookingRequest = (bookingRequest) => {
    setSelectedBookingRequest(bookingRequest);
    setViewDialogOpen(true);
  };

  const handleEditBookingRequest = (bookingRequest) => {
    setSelectedBookingRequest(bookingRequest);
    setEditDialogOpen(true);
  };

  const handleDeleteBookingRequest = (bookingRequest) => {
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

  const handleDeleteConfirmed = () => {
    // Add delete logic here
    setDeleteDialogOpen(false);
    setSelectedBookingRequest(null);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBookingRequests = bookingRequests.sort((a, b) => {
    if (orderBy === "reservationId") {
      return order === "asc"
        ? a.reservationId - b.reservationId
        : b.reservationId - a.reservationId;
    } else if (orderBy === "nicheId") {
      return order === "asc" ? a.nicheId - b.nicheId : b.nicheId - a.nicheId;
    } else if (orderBy === "signAddress") {
      return order === "asc"
        ? a.signAddress.localeCompare(b.signAddress)
        : b.signAddress.localeCompare(a.signAddress);
    } else if (orderBy === "phoneNumber") {
      return order === "asc"
        ? a.phoneNumber.localeCompare(b.phoneNumber)
        : b.phoneNumber.localeCompare(a.phoneNumber);
    } else if (orderBy === "createdDate") {
      return order === "asc"
        ? new Date(a.createdDate) - new Date(b.createdDate)
        : new Date(b.createdDate) - new Date(a.createdDate);
    } else if (orderBy === "confirmationDate") {
      return order === "asc"
        ? new Date(a.confirmationDate) - new Date(b.confirmationDate)
        : new Date(b.confirmationDate) - new Date(a.confirmationDate);
    } else if (orderBy === "status") {
      return order === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const filteredBookingRequests = sortedBookingRequests.filter(
    (bookingRequest) => {
      if (searchColumn === "all") {
        return (
          bookingRequest.signAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.phoneNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.reservationId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bookingRequest.nicheId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      } else if (searchColumn === "signAddress") {
        return bookingRequest.signAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "phoneNumber") {
        return bookingRequest.phoneNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "reservationId") {
        return bookingRequest.reservationId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchColumn === "nicheId") {
        return bookingRequest.nicheId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    }
  );

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
              <MenuItem value="signAddress">Địa chỉ</MenuItem>
              <MenuItem value="phoneNumber">Số điện thoại</MenuItem>
              <MenuItem value="reservationId">Mã đơn</MenuItem>
              <MenuItem value="nicheId">Mã ô chứa</MenuItem>
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
                  direction={orderBy === "reservationId" ? order : "asc"}
                  onClick={() => handleRequestSort("reservationId")}
                >
                  STT
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "reservationId"}
                  direction={orderBy === "reservationId" ? order : "asc"}
                  onClick={() => handleRequestSort("reservationId")}
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
                  active={orderBy === "confirmationDate"}
                  direction={orderBy === "confirmationDate" ? order : "asc"}
                  onClick={() => handleRequestSort("confirmationDate")}
                >
                  Ngày xác nhận
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "signAddress"}
                  direction={orderBy === "signAddress" ? order : "asc"}
                  onClick={() => handleRequestSort("signAddress")}
                >
                  Địa chỉ
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "phoneNumber"}
                  direction={orderBy === "phoneNumber" ? order : "asc"}
                  onClick={() => handleRequestSort("phoneNumber")}
                >
                  Số điện thoại
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
              <TableCell align="center">Ghi chú</TableCell>
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
                <TableCell align="center">{bookingRequest.nicheId}</TableCell>
                <TableCell align="center">
                  {new Date(bookingRequest.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {new Date(
                    bookingRequest.confirmationDate
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  {bookingRequest.signAddress}
                </TableCell>
                <TableCell align="center">
                  {bookingRequest.phoneNumber}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      bookingRequest.status === "pending"
                        ? "Đang chờ"
                        : bookingRequest.status === "confirmed"
                        ? "Xác nhận"
                        : "Đã hủy"
                    }
                    color={
                      bookingRequest.status === "pending"
                        ? "warning"
                        : bookingRequest.status === "confirmed"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell align="center">{bookingRequest.note}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewBookingRequest(bookingRequest)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditBookingRequest(bookingRequest)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteBookingRequest(bookingRequest)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddBookingRequestDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      />
      <ViewBookingRequestDialog
        open={viewDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleViewDialogClose}
      />
      <EditBookingRequestDialog
        open={editDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleEditDialogClose}
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

export default BookingRequestPage;
