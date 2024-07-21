"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircleOutlined as ApproveIcon,
  CancelOutlined as RejectIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import VisitViewDialog from "./VisitViewDialog";
import VisitDeleteDialog from "./VisitDeleteDialog";
import VisitApproveDialog from "./VisitApproveDialog";
import VisitAddDialog from "./VisitAddDialog";
import { styled } from "@mui/material/styles";
import viVN from "@/utils/viVN";

interface VisitRegistrationDto {
  visitId: number;
  customerId: number;
  nicheId: number;
  customerName: string;
  staffName: string;
  nicheAddress: string;
  createdDate: string;
  visitDate: string;
  status: string;
  accompanyingPeople: number;
  note: string;
  approvedBy?: number;
  formattedVisitDate: string;
  formattedCreatedDate: string;
}

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

const NoWrapTypography = styled(Typography)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

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
    case "Pending":
      return { label: "Đang chờ", color: "warning" };
    case "Approved":
      return { label: "Đã duyệt", color: "success" };
    default:
      return { label: status, color: "default" };
  }
};

const VisitRegistrationsList: React.FC = () => {
  const [visitRegistrations, setVisitRegistrations] = useState<
    VisitRegistrationDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] =
    useState<VisitRegistrationDto | null>(null);

  useEffect(() => {
    fetchVisitRegistrations();
  }, []);

  const fetchVisitRegistrations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/VisitRegistrations");
      setVisitRegistrations(response.data.$values);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setViewDialogOpen(true);
  };

  const handleApprove = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit); // Set the selected visit
    setApproveDialogOpen(true);
  };

  const handleReject = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit); // Set the selected visit
    setDeleteDialogOpen(true); // Open the delete dialog
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const closeDialogs = () => {
    setViewDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setApproveDialogOpen(false); // Ensure the approve dialog is also closed
    setAddDialogOpen(false);
    setSelectedVisit(null);
    fetchVisitRegistrations();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      width: 80,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "visitId",
      headerName: "Mã đơn",
      width: 80,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
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
      width: 150,
      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    { field: "note", headerName: "Ghi chú", width: 200 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 100,
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
                  params.row.status === "Approved"
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
                  params.row.status === "Approved"
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

  const rows = visitRegistrations.map((visit, index) => ({
    id: index + 1,
    visitId: visit.visitId,
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
