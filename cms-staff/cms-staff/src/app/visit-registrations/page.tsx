"use client";

import { useVisitRegistrationContext } from "@/context/VisitRegistrationContext";
import { viVN } from "@/utils/viVN";
import {
  Add as AddIcon,
  CheckCircleOutlined as ApproveIcon,
  CancelOutlined as RejectIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { isWithinInterval, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { VisitRegistrationDto } from "./interfaces";
import VisitAddDialog from "./VisitAddDialog";
import VisitApproveDialog from "./VisitApproveDialog";
import VisitDeleteDialog from "./VisitDeleteDialog";
import VisitViewDialog from "./VisitViewDialog";

// Helper functions
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const getCurrentMonthStartDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

const getCurrentMonthEndDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate(); // Last day of the current month
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(
    2,
    "0"
  )}`;
};

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
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
      return { label: "Đã hủy", color: "error" };
    case "Expired":
      return { label: "Đã hết hạn", color: "error" };
    case "Pending":
      return { label: "Đang chờ", color: "warning" };
    case "Approved":
      return { label: "Đã duyệt", color: "success" };
    default:
      return { label: status, color: "default" };
  }
};

const VisitRegistrationsList: React.FC = () => {
  const { visitRegistrations, fetchVisitRegistrations } =
    useVisitRegistrationContext();
  const [filteredVisitRegistrations, setFilteredVisitRegistrations] = useState<
    VisitRegistrationDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] =
    useState<VisitRegistrationDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState<
    keyof VisitRegistrationDto | "all"
  >("createdDate");
  const [fromDate, setFromDate] = useState(getCurrentMonthStartDate());
  const [toDate, setToDate] = useState(getCurrentMonthEndDate());

  useEffect(() => {
    const fetchData = async () => {
      await fetchVisitRegistrations();
      setLoading(false);
    };
    fetchData();
  }, [fetchVisitRegistrations]);

  useEffect(() => {
    fetchVisitRegistrations();
    const interval = setInterval(fetchVisitRegistrations, 20000);
    return () => clearInterval(interval);
  }, []);

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  useEffect(() => {
    let filteredData = visitRegistrations;

    // Apply date range filter
    if (
      fromDate &&
      toDate &&
      (searchColumn === "createdDate" || searchColumn === "visitDate")
    ) {
      filteredData = filteredData.filter((visit) => {
        const dateToCheck = parseISO(visit[searchColumn]);
        const from = parseISO(fromDate);
        const to = parseISO(toDate);

        // Adjust the end date to include the entire day
        const adjustedTo = new Date(to.getTime() + 86400000); // Add 24 hours (in milliseconds)

        return isWithinInterval(dateToCheck, { start: from, end: adjustedTo });
      });
    }

    // Apply text search filter
    if (searchText) {
      const normalizedSearchText = removeAccents(searchText.toLowerCase());

      filteredData = filteredData.filter((visit) => {
        if (searchColumn === "all") {
          return Object.values(visit).some((value) =>
            removeAccents(String(value).toLowerCase()).includes(
              normalizedSearchText
            )
          );
        } else if (searchColumn === "status") {
          return removeAccents(
            getStatusLabel(visit.status).label.toLowerCase()
          ).includes(normalizedSearchText);
        } else {
          return removeAccents(
            String(visit[searchColumn]).toLowerCase()
          ).includes(normalizedSearchText);
        }
      });
    }

    setFilteredVisitRegistrations(filteredData);
  }, [searchText, searchColumn, fromDate, toDate, visitRegistrations]);

  //
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Expired":
        return { label: "Đã quá hạn", color: "error" };
      case "Canceled":
        return { label: "Đã hủy", color: "error" };
      case "Approved":
        return { label: "Đã xác nhận", color: "success" };
      case "Pending":
        return { label: "Đang chờ duyệt", color: "warning" };

      default:
        return { label: status, color: "default" };
    }
  };

  const handleView = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setViewDialogOpen(true);
  };

  const handleApprove = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setApproveDialogOpen(true);
  };

  const handleReject = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const closeDialogs = () => {
    setViewDialogOpen(false);
    setDeleteDialogOpen(false);
    setApproveDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedVisit(null);
    fetchVisitRegistrations();
  };

  const columns: GridColDef[] = [
    {
      field: "visitCode",
      headerName: "Mã đơn",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "customerName",
      headerName: "Tên khách hàng",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "staffName",
      headerName: "Tên nhân viên",
      width: 180,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nicheAddress",
      headerName: "Địa chỉ",
      width: 260,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "createdDate",
      headerName: "Ngày tạo",
      width: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>{formatDateToDDMMYYYY(params.value)}</CenteredCell>
      ),
    },
    {
      field: "visitDate",
      headerName: "Ngày hẹn",
      width: 120,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>{formatDateToDDMMYYYY(params.value)}</CenteredCell>
      ),
    },
    {
      field: "accompanyingPeople",
      headerName: "Số lượng",
      headerClassName: "super-app-theme--header",
      width: 100,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const { label, color } = getStatusLabel(params.value);
        return (
          <CenteredCell>
            <Chip
              label={label}
              color={
                color as
                  | "info"
                  | "error"
                  | "primary"
                  | "secondary"
                  | "success"
                  | "warning"
                  | "default"
              }
            />
          </CenteredCell>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết">
            <IconButton color="info" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xác nhận đơn">
            <span>
              <IconButton
                color="success"
                onClick={() => handleApprove(params.row)}
                disabled={
                  params.row.status === "Canceled" ||
                  params.row.status === "Approved" ||
                  params.row.status === "Expired"
                }
              >
                <ApproveIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Từ chối đơn">
            <span>
              <IconButton
                color="error"
                onClick={() => handleReject(params.row)}
                disabled={
                  params.row.status === "Canceled" ||
                  params.row.status === "Approved" ||
                  params.row.status === "Expired"
                }
              >
                <RejectIcon />
              </IconButton>
            </span>
          </Tooltip>
        </CenteredCell>
      ),
    },
  ];

  const rows = filteredVisitRegistrations.map((visit, index) => ({
    id: visit.visitId,
    visitId: visit.visitId,
    stt: index + 1,
    visitCode: visit.visitCode,
    customerName: visit.customerName,
    staffName: visit.staffName,
    nicheAddress: visit.nicheAddress,
    createdDate: visit.createdDate,
    visitDate: visit.visitDate,
    status: visit.status,
    accompanyingPeople: visit.accompanyingPeople,
    note: visit.note,
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
          onClick={handleAdd}
        >
          Thêm đăng ký viếng thăm
        </Button>
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            size="small"
            style={{ marginRight: 8 }}
          >
            <InputLabel id="search-column-label">Chọn cột</InputLabel>
            <Select
              labelId="search-column-label"
              id="search-column"
              value={searchColumn}
              onChange={(e) =>
                setSearchColumn(
                  e.target.value as keyof VisitRegistrationDto | "all"
                )
              }
              label="Chọn cột"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="visitCode">Mã đơn</MenuItem>
              <MenuItem value="customerName">Tên khách hàng</MenuItem>
              <MenuItem value="staffName">Tên nhân viên</MenuItem>
              <MenuItem value="nicheAddress">Địa chỉ</MenuItem>
              <MenuItem value="createdDate">Ngày tạo</MenuItem>
              <MenuItem value="visitDate">Ngày hẹn</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
            </Select>
          </FormControl>
          {searchColumn === "createdDate" || searchColumn === "visitDate" ? (
            <Box display="flex" alignItems="center">
              <TextField
                type="date"
                label="Từ ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ marginRight: 8 }}
              />
              <TextField
                type="date"
                label="Đến ngày"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Box>
          ) : (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            localeText={viVN}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  staffName: false,
                  note: false,
                  accompanyingPeople: false,
                },
              },
            }}
          />
        </Paper>
      </Box>

      <VisitViewDialog
        open={viewDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitDeleteDialog
        open={deleteDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitApproveDialog
        open={approveDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitAddDialog open={addDialogOpen} onClose={closeDialogs} />
    </Box>
  );
};

export default VisitRegistrationsList;
