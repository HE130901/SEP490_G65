"use client";
import React, { useState, useContext, useEffect } from "react";
import {
  Add as AddIcon,
  RestorePage as RestorePageIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddContractForm from "./ContractAdd";
import ConfirmDialog from "./ContractDelete";
import ContractDetailDialog from "./ContractDetail";
import RenewalDialog from "./ContractRenewal";
import ContractContext from "@/context/ContractContext";
import contractService from "@/services/contractService";
import { styled } from "@mui/material/styles";
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
    justifyContent: "center",
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

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Canceled":
      return { label: "Đã thanh lý", color: "error" };
    case "Expired":
      return { label: "Đã hết hạn", color: "error" };
    case "Active":
      return { label: "Còn hiệu lực", color: "success" };
    case "Extended":
      return { label: "Đã gia hạn", color: "success" };
    case "NearlyExpired":
      return { label: "Gần hết hạn", color: "warning" };
    case "PendingRenewal":
      return { label: "Chờ gia hạn", color: "warning" };
    case "PendingCancellation":
      return { label: "Chờ thanh lý", color: "warning" };
    default:
      return { label: status, color: "default" };
  }
};

type SearchableColumns =
  | "all"
  | "contractCode"
  | "customerName"
  | "startDate"
  | "endDate"
  | "status"
  | "daysLeft";

const ContractPage: React.FC = () => {
  const {
    contracts,
    setContracts,
    selectedContractId,
    setSelectedContractId,
    selectedContractCode,
    setSelectedContractCode,
  } = useContext(ContractContext);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState<SearchableColumns>("all");
  const [filteredContracts, setFilteredContracts] = useState(contracts);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await contractService.getAllContracts();
      setContracts(data);
      setFilteredContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [setContracts]);

  useEffect(() => {
    const filtered = contracts.filter((contract) => {
      if (searchColumn === "all") {
        return Object.values(contract).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );
      } else if (searchColumn === "daysLeft") {
        const daysLeft = calculateDaysLeft(contract.endDate);
        return String(daysLeft)
          .toLowerCase()
          .includes(searchText.toLowerCase());
      } else {
        const columnValue = contract[searchColumn as keyof typeof contract];
        return String(columnValue)
          .toLowerCase()
          .includes(searchText.toLowerCase());
      }
    });
    setFilteredContracts(filtered);
  }, [searchText, searchColumn, contracts]);

  const handleAddOpen = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    fetchContracts();
  };

  const handleViewContract = (id: string) => {
    setSelectedContractId(id);
    setDetailOpen(true);
  };

  const handleRenewContract = (id: string) => {
    setSelectedContractId(id);
    setRenewalOpen(true);
  };

  const handleTerminateContract = (id: string) => {
    const contractToTerminate = contracts.find(
      (contract) => contract.contractId === id
    );
    if (contractToTerminate) {
      setSelectedContractCode(contractToTerminate.contractCode);
    }
    setSelectedContractId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmTerminate = async () => {
    if (selectedContractId) {
      await contractService.cancelContract(selectedContractId);
      fetchContracts();
    }
    setConfirmDialogOpen(false);
  };

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(daysLeft, 0);
  };

  const columns: GridColDef[] = [
    {
      field: "contractCode",
      headerName: "Mã Hợp đồng",
      width: 180,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {params.value}
        </Box>
      ),
    },
    { field: "customerName", headerName: "Tên Khách hàng", width: 230 },
    {
      field: "startDate",
      headerName: "Ngày ký hợp đồng",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {formatDateToDDMMYYYY(params.value)}
        </Box>
      ),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {formatDateToDDMMYYYY(params.value)}
        </Box>
      ),
    },
    {
      field: "daysLeft",
      headerName: "Còn lại (ngày)",
      width: 130,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {calculateDaysLeft(params.row.endDate)}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        const { label, color } = getStatusLabel(params.value);
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
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
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="primary"
              onClick={() => handleViewContract(params.row.contractId)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gia hạn hợp đồng">
            <IconButton
              color="success"
              onClick={() => handleRenewContract(params.row.contractId)}
              disabled={params.row.status === "Canceled"}
            >
              <RestorePageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thanh lý hợp đồng">
            <span>
              <IconButton
                color="error"
                onClick={() => handleTerminateContract(params.row.contractId)}
                disabled={params.row.status === "Canceled"}
              >
                <CancelOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
          onClick={handleAddOpen}
        >
          Thêm mới hợp đồng
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
                setSearchColumn(e.target.value as SearchableColumns)
              }
              label="Chọn cột"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="contractCode">Mã Hợp đồng</MenuItem>
              <MenuItem value="customerName">Tên Khách hàng</MenuItem>
              <MenuItem value="startDate">Ngày ký hợp đồng</MenuItem>
              <MenuItem value="endDate">Ngày kết thúc</MenuItem>
              <MenuItem value="daysLeft">Còn lại (ngày)</MenuItem>
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
              rows={filteredContracts.map((contract, index) => ({
                ...contract,
                id: index + 1,
              }))}
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
      )}

      <AddContractForm open={openAddDialog} onClose={handleCloseAdd} />
      <ContractDetailDialog
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        contractId={selectedContractId}
      />
      <RenewalDialog
        open={renewalOpen}
        handleClose={() => {
          setRenewalOpen(false);
          fetchContracts();
        }}
        contractId={selectedContractId}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmTerminate}
        title="Xác nhận thanh lý hợp đồng"
        content={`Bạn có chắc chắn muốn thanh lý hợp đồng ${
          selectedContractCode || ""
        }?`}
      />
    </Box>
  );
};

export default ContractPage;
