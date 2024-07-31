"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ConfirmIcon,
  CancelOutlined as CancelOutlinedIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import AddBookingRequestDialog from "./NicheReservationAdd";
import ViewBookingRequestDialog from "./NicheReservationDetail";
import DeleteBookingRequestDialog from "./NicheReservationDelete";
import ConfirmBookingRequestDialog from "./NicheReservationConfirm";
import viVN from "@/utils/viVN";
import { useNicheReservationContext } from "@/context/NicheReservationContext";
import NicheReservationAPI from "@/services/nicheReservationService";
import { formatISO, parseISO, isWithinInterval } from "date-fns";

// Styled components
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

// Helper functions
const getStatusLabel = (status: string) => {
  switch (status) {
    case "Canceled":
      return "Đã hủy";
    case "Approved":
      return "Đã duyệt";
    case "Rejected":
      return "Đã từ chối";
    case "Signed":
      return "Đã ký HĐ";
    case "Expired":
      return "Đã hết hạn";
    default:
      return "Chờ duyệt";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Canceled":
    case "Expired":
      return "error";
    case "Approved":
    case "Signed":
      return "success";
    default:
      return "warning";
  }
};

const NicheReservationPage = () => {
  const {
    reservations,
    fetchReservations,
    deleteReservation,
    confirmReservation,
  } = useNicheReservationContext();

  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("formattedCreatedDate");
  const [startDateCreated, setStartDateCreated] = useState<string | null>(null);
  const [endDateCreated, setEndDateCreated] = useState<string | null>(null);
  const [startDateConfirmation, setStartDateConfirmation] = useState<
    string | null
  >(null);
  const [endDateConfirmation, setEndDateConfirmation] = useState<string | null>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBookingRequest, setSelectedBookingRequest] = useState<
    any | null
  >(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    setFilteredRequests(reservations);
  }, [reservations]);

  useEffect(() => {
    let filteredData = reservations;

    if (searchText) {
      filteredData = filteredData.filter((request) => {
        if (searchColumn === "all") {
          return Object.values(request).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          );
        } else if (searchColumn === "status") {
          return getStatusLabel(request.status)
            .toLowerCase()
            .includes(searchText.toLowerCase());
        } else {
          return String(request[searchColumn as keyof typeof request])
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }
      });
    }

    if (startDateCreated || endDateCreated) {
      filteredData = filteredData.filter((request) => {
        const createdDate = parseISO(request.formattedCreatedDate);
        return isWithinInterval(createdDate, {
          start: startDateCreated ? parseISO(startDateCreated) : new Date(0),
          end: endDateCreated ? parseISO(endDateCreated) : new Date(),
        });
      });
    }

    if (startDateConfirmation || endDateConfirmation) {
      filteredData = filteredData.filter((request) => {
        const confirmationDate = parseISO(request.formattedConfirmationDate);
        return isWithinInterval(confirmationDate, {
          start: startDateConfirmation
            ? parseISO(startDateConfirmation)
            : new Date(0),
          end: endDateConfirmation ? parseISO(endDateConfirmation) : new Date(),
        });
      });
    }

    setFilteredRequests(filteredData);
  }, [
    searchText,
    searchColumn,
    startDateCreated,
    endDateCreated,
    startDateConfirmation,
    endDateConfirmation,
    reservations,
  ]);

  const handleAddBookingRequest = () => setAddDialogOpen(true);

  const handleViewBookingRequest = async (id: number) => {
    try {
      const response = await NicheReservationAPI.getNicheReservationDetails(id);
      setSelectedBookingRequest(response.data);
      setViewDialogOpen(true);
    } catch (error) {
      toast.error("Lỗi khi xem chi tiết đơn đăng ký đặt chỗ");
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
    fetchReservations();
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    fetchReservations();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    fetchReservations();
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    fetchReservations();
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (selectedBookingRequest) {
        await deleteReservation(selectedBookingRequest.reservationId);
        fetchReservations();
        setDeleteDialogOpen(false);
        setSelectedBookingRequest(null);
      }
    } catch (error) {
      toast.error("Lỗi khi từ chối đơn đăng ký đặt chỗ");
    }
  };

  const handleConfirmConfirmed = async () => {
    try {
      if (selectedBookingRequest) {
        await confirmReservation(selectedBookingRequest.reservationId);
        fetchReservations();
        setConfirmDialogOpen(false);
        setSelectedBookingRequest(null);
      }
    } catch (error) {
      toast.error("Lỗi khi xác nhận đơn đăng ký đặt chỗ");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "reservationCode",
      headerName: "Mã đơn",
      width: 180,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "nicheCode",
      headerName: "Mã ô chứa",
      width: 180,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "name", headerName: "Tên khách hàng", width: 180 },
    {
      field: "formattedCreatedDate",
      headerName: "Ngày tạo",
      width: 180,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "formattedConfirmationDate",
      headerName: "Ngày hẹn",
      width: 200,
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
      width: 150,
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
                params.row.status === "Approved" ||
                params.row.status === "Signed" ||
                params.row.status === "Expired"
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
                params.row.status === "Canceled" ||
                params.row.status === "Signed" ||
                params.row.status === "Expired"
              }
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Tooltip>
        </CenteredCell>
      ),
    },
  ];

  const rows = filteredRequests.map((bookingRequest, index) => ({
    id: bookingRequest.reservationId,
    stt: index + 1,
    reservationId: bookingRequest.reservationId,
    reservationCode: bookingRequest.reservationCode,
    nicheAddress: bookingRequest.nicheAddress,
    name: bookingRequest.name,
    formattedConfirmationDate:
      bookingRequest.formattedConfirmationDate.split(" ")[1],
    formattedCreatedDate:
      bookingRequest.formattedConfirmationDate.split(" ")[1],
    status: bookingRequest.status,
    nicheCode: bookingRequest.nicheCode,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(176, 178, 181)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        style={{ width: "100%", maxWidth: 1200 }}
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
            size="small"
            style={{ marginRight: 8 }}
          >
            <InputLabel>Chọn cột</InputLabel>
            <Select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              label="Chọn cột"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="reservationCode">Mã đơn</MenuItem>
              <MenuItem value="nicheAddress">Địa chỉ ô chứa</MenuItem>
              <MenuItem value="name">Tên khách hàng</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
              <MenuItem value="formattedCreatedDate">Ngày tạo</MenuItem>
              <MenuItem value="formattedConfirmationDate">Ngày hẹn</MenuItem>
            </Select>
          </FormControl>
          {searchColumn === "formattedCreatedDate" ||
          searchColumn === "formattedConfirmationDate" ? (
            <Box display="flex" alignItems="center">
              <TextField
                type="date"
                label="Từ ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={
                  searchColumn === "formattedCreatedDate"
                    ? startDateCreated
                    : startDateConfirmation
                }
                onChange={(e) =>
                  searchColumn === "formattedCreatedDate"
                    ? setStartDateCreated(e.target.value)
                    : setStartDateConfirmation(e.target.value)
                }
                style={{ marginRight: 8 }}
              />
              <TextField
                type="date"
                label="Đến ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={
                  searchColumn === "formattedCreatedDate"
                    ? endDateCreated
                    : endDateConfirmation
                }
                onChange={(e) =>
                  searchColumn === "formattedCreatedDate"
                    ? setEndDateCreated(e.target.value)
                    : setEndDateConfirmation(e.target.value)
                }
                style={{ marginRight: 8 }}
              />
            </Box>
          ) : (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              style={{ marginRight: 8 }}
            />
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Paper
          elevation={3}
          style={{ padding: 4, width: "100%", maxWidth: 1200 }}
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
        onAddSuccess={fetchReservations}
      />
      <ViewBookingRequestDialog
        open={viewDialogOpen}
        bookingRequest={selectedBookingRequest}
        onClose={handleViewDialogClose}
        onConfirmSuccess={fetchReservations}
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
