"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Tooltip, Chip, Paper } from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ConfirmIcon,
  CancelOutlined as CancelOutlinedIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import NicheReservationAPI from "@/services/nicheReservationService";
import AddBookingRequestDialog from "./NicheReservationAdd";
import ViewBookingRequestDialog from "./NicheReservationDetail";
import DeleteBookingRequestDialog from "./NicheReservationDelete";
import ConfirmBookingRequestDialog from "./NicheReservationConfirm";
import viVN from "@/utils/viVN";

const CenteredTable = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-row": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-renderingZone": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-row--lastVisible": {
    maxHeight: "none !important",
  },
}));

const CenteredCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Canceled":
      return "Đã hủy";
    case "Approved":
      return "Đã duyệt";
    default:
      return "Chờ duyệt";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Canceled":
      return "error";
    case "Approved":
      return "success";
    default:
      return "warning";
  }
};

const NicheReservationPage = () => {
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBookingRequest, setSelectedBookingRequest] = useState<
    any | null
  >(null);

  const fetchBookingRequests = async () => {
    try {
      const response = await NicheReservationAPI.getAllNicheReservations();
      setBookingRequests(response.data.$values || response.data);
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

  const handleConfirmBookingRequest = (bookingRequest: any) => {
    setSelectedBookingRequest(bookingRequest);
    setConfirmDialogOpen(true);
  };

  const handleDeleteBookingRequest = (bookingRequest: any) => {
    setSelectedBookingRequest(bookingRequest);
    setDeleteDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    fetchBookingRequests();
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    fetchBookingRequests();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    fetchBookingRequests();
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    fetchBookingRequests();
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

  const handleConfirmConfirmed = async () => {
    try {
      if (selectedBookingRequest) {
        await NicheReservationAPI.confirmNicheReservation(
          selectedBookingRequest.reservationId
        );
      }
      toast.success("Đơn đăng ký đã được xác nhận thành công");
      fetchBookingRequests();
      setConfirmDialogOpen(false);
      setSelectedBookingRequest(null);
    } catch (error) {
      toast.error("Không thể xác nhận đơn đăng ký");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      width: 80,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "reservationId",
      headerName: "Mã đơn",
      width: 80,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "nicheAddress",
      headerName: "Địa chỉ ô chứa",
      width: 200,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "name", headerName: "Tên khách hàng", width: 180 },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "formattedConfirmationDate",
      headerName: "Ngày hẹn",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 180,
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="primary"
              onClick={() => handleViewBookingRequest(params.row.reservationId)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xác nhận">
            <IconButton
              color="success"
              onClick={() => handleConfirmBookingRequest(params.row)}
              disabled={
                params.row.status === "Canceled" ||
                params.row.status === "Approved"
              }
            >
              <ConfirmIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Từ chối">
            <IconButton
              color="error"
              onClick={() => handleDeleteBookingRequest(params.row)}
              disabled={
                params.row.status === "Approved" ||
                params.row.status === "Canceled"
              }
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Tooltip>
        </CenteredCell>
      ),
    },
  ];

  const rows = bookingRequests.map((bookingRequest, index) => ({
    id: index + 1,
    reservationId: bookingRequest.reservationId,
    nicheAddress: bookingRequest.nicheAddress,
    name: bookingRequest.name,
    phoneNumber: bookingRequest.phoneNumber,
    formattedCreatedDate: bookingRequest.formattedCreatedDate,
    formattedConfirmationDate: bookingRequest.formattedConfirmationDate,
    status: bookingRequest.status,
  }));

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
      </Box>
      <Box display="flex" justifyContent="center" style={{ width: "100%" }}>
        <Paper
          elevation={3}
          style={{ padding: 20, width: "100%", maxWidth: 1200 }}
        >
          <CenteredTable
            rows={rows}
            columns={columns}
            autoHeight
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
          />
        </Paper>
      </Box>
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
      <DeleteBookingRequestDialog
        open={deleteDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteConfirmed}
      />
      <ConfirmBookingRequestDialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        onConfirm={handleConfirmConfirmed}
      />
    </Box>
  );
};

export default NicheReservationPage;
