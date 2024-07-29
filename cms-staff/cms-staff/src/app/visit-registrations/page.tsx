"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircleOutlined as ApproveIcon,
  CancelOutlined as RejectIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import VisitViewDialog from "./VisitViewDialog";
import VisitDeleteDialog from "./VisitDeleteDialog";
import VisitApproveDialog from "./VisitApproveDialog";
import VisitAddDialog from "./VisitAddDialog";
import { styled } from "@mui/material/styles";
import viVN from "@/utils/viVN";
import { useVisitRegistrationContext } from "@/context/VisitRegistrationContext";
import { VisitRegistrationDto } from "./interfaces";

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
  const [loading, setLoading] = useState(true); // Initial loading state set to true
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] =
    useState<VisitRegistrationDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState<
    keyof VisitRegistrationDto | "all"
  >("all");

  useEffect(() => {
    const fetchData = async () => {
      await fetchVisitRegistrations();
      setLoading(false); // Set loading to false after fetching
    };
    fetchData();
  }, [fetchVisitRegistrations]);

  useEffect(() => {
    const filtered = visitRegistrations.filter((visit) => {
      if (searchColumn === "all") {
        return Object.values(visit).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        const columnValue = visit[searchColumn];
        return String(columnValue)
          .toLowerCase()
          .includes(searchText.toLowerCase());
      }
    });
    setFilteredVisitRegistrations(filtered);
  }, [searchText, searchColumn, visitRegistrations]);

  const handleView = (visit: VisitRegistrationDto) => {
    console.log("Viewing visit:", visit);
    setSelectedVisit(visit);
    setViewDialogOpen(true);
  };

  const handleApprove = (visit: VisitRegistrationDto) => {
    console.log("Approving visit:", visit);
    setSelectedVisit(visit);
    setApproveDialogOpen(true);
  };

  const handleReject = (visit: VisitRegistrationDto) => {
    console.log("Rejecting visit:", visit);
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
      field: "stt",
      headerName: "STT",
      width: 80,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "visitCode",
      headerName: "Mã đơn",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 150 },
    { field: "staffName", headerName: "Tên nhân viên", width: 150 },
    { field: "nicheAddress", headerName: "Địa chỉ", width: 220 },
    {
      field: "formattedCreatedDate",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "formattedVisitDate",
      headerName: "Ngày viếng thăm",
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "accompanyingPeople",
      headerName: "Số lượng",
      width: 100,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "note", headerName: "Ghi chú", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
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
      width: 150,
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết">
            <IconButton color="primary" onClick={() => handleView(params.row)}>
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
    formattedCreatedDate: visit.formattedCreatedDate,
    formattedVisitDate: visit.formattedVisitDate,
    status: visit.status,
    accompanyingPeople: visit.accompanyingPeople,
    note: visit.note,
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
              <MenuItem value="formattedCreatedDate">Ngày tạo</MenuItem>
              <MenuItem value="formattedVisitDate">Ngày viếng thăm</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
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
                columns: {
                  columnVisibilityModel: {
                    staffName: false,
                    formattedCreatedDate: false,
                    note: false,
                  },
                },
              }}
            />
          </Paper>
        </Box>
      )}

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
