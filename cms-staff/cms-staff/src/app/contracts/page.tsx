"use client";
import React, { useState, ChangeEvent } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  RestorePage as RestorePageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddContractForm from "./ContractAdd";
import ContractDetailDialog from "./ContractDetail";
import RenewalDialog from "./ContractRenewal";
import ConfirmDialog from "./ContractDelete";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import withAuth from "@/components/withAuth";
import { Contract, FormData } from "./interfaces";

const ContractPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      code: "HD001",
      nicheCode: "N001",
      customerName: "Nguyễn Văn A",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Còn hiệu lực",
    },
    {
      id: 2,
      code: "HD002",
      nicheCode: "N002",
      customerName: "Trần Thị B",
      startDate: "2023-02-01",
      endDate: "2024-02-01",
      status: "Quá hạn",
    },
    {
      id: 3,
      code: "HD003",
      nicheCode: "N003",
      customerName: "Lê Văn C",
      startDate: "2023-03-01",
      endDate: "2024-03-01",
      status: "Chờ duyệt gia hạn",
    },
    {
      id: 4,
      code: "HD004",
      nicheCode: "N004",
      customerName: "Phạm Thị D",
      startDate: "2023-04-01",
      endDate: "2024-04-01",
      status: "Chờ duyệt thanh lý",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Contract>("code");
  const [open, setOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleAddContract = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (
    newContract: Omit<Contract, "id" | "code" | "status">
  ) => {
    const newContractObject: Contract = {
      ...newContract,
      id: contracts.length + 1,
      code: `HD${String(contracts.length + 1).padStart(3, "0")}`,
      status: "Còn hiệu lực",
    };
    setContracts([...contracts, newContractObject]);
    handleClose();
  };

  const handleViewContract = (id: number) => {
    const contract = contracts.find((contract) => contract.id === id);
    if (contract) {
      setSelectedContract(contract);
      setDetailOpen(true);
    }
  };

  const handleRenewContract = (id: number) => {
    const contract = contracts.find((contract) => contract.id === id);
    setSelectedContract(contract ?? null);
    setRenewalOpen(true);
  };

  const handleRenewalSave = (updatedContract: Contract) => {
    const updatedContracts = contracts.map((contract) =>
      contract.id === updatedContract.id ? updatedContract : contract
    );
    setContracts(updatedContracts);
    setRenewalOpen(false);
  };

  const handleTerminateContract = (id: number) => {
    const contract = contracts.find((contract) => contract.id === id);
    setSelectedContract(contract ?? null);
    setConfirmDialogOpen(true);
  };

  const handleConfirmTerminate = () => {
    const updatedContracts = contracts.map((contract) =>
      contract.id === (selectedContract as Contract).id
        ? {
            ...contract,
            status: "Đã thanh lý",
            notes: contract.notes
              ? [...contract.notes, "Hợp đồng đã được thanh lý"]
              : ["Hợp đồng đã được thanh lý"],
          }
        : contract
    );
    setContracts(updatedContracts);
    setConfirmDialogOpen(false);
    setSelectedContract(null);
  };

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value as string);
  };

  const handleRequestSort = (property: keyof Contract) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedContracts = contracts.sort((a, b) => {
    if (orderBy === "code") {
      return order === "asc"
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code);
    } else if (orderBy === "nicheCode") {
      return order === "asc"
        ? a.nicheCode.localeCompare(b.nicheCode)
        : b.nicheCode.localeCompare(a.nicheCode);
    } else if (orderBy === "customerName") {
      return order === "asc"
        ? a.customerName.localeCompare(b.customerName)
        : b.customerName.localeCompare(a.customerName);
    } else if (orderBy === "startDate") {
      return order === "asc"
        ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (orderBy === "endDate") {
      return order === "asc"
        ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    } else if (orderBy === "status") {
      return order === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const filteredContracts = sortedContracts.filter((contract) => {
    if (searchColumn === "all") {
      return (
        contract.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.nicheCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.endDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchColumn === "customerName") {
      return contract.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchColumn === "code") {
      return contract.code.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "nicheCode") {
      return contract.nicheCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchColumn === "startDate") {
      return contract.startDate
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchColumn === "endDate") {
      return contract.endDate.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "status") {
      return contract.status.toLowerCase().includes(searchTerm.toLowerCase());
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
          onClick={handleAddContract}
        >
          Thêm mới hợp đồng
        </Button>
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            sx={{ minWidth: 150, marginRight: 2 }}
          >
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="customerName">Tên khách hàng</MenuItem>
              <MenuItem value="code">Mã Hợp đồng</MenuItem>
              <MenuItem value="nicheCode">Mã Ô chứa</MenuItem>
              <MenuItem value="startDate">Ngày ký hợp đồng</MenuItem>
              <MenuItem value="endDate">Ngày kết thúc</MenuItem>
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
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : undefined}
                  onClick={() => handleRequestSort("id")}
                >
                  Số thứ tự
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "code"}
                  direction={orderBy === "code" ? order : "asc"}
                  onClick={() => handleRequestSort("code")}
                >
                  Mã Hợp đồng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "nicheCode"}
                  direction={orderBy === "nicheCode" ? order : "asc"}
                  onClick={() => handleRequestSort("nicheCode")}
                >
                  Mã Ô chứa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customerName"}
                  direction={orderBy === "customerName" ? order : undefined}
                  onClick={() => handleRequestSort("customerName")}
                >
                  Tên Khách hàng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "startDate"}
                  direction={orderBy === "startDate" ? order : "asc"}
                  onClick={() => handleRequestSort("startDate")}
                >
                  Ngày ký hợp đồng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "endDate"}
                  direction={orderBy === "endDate" ? order : "asc"}
                  onClick={() => handleRequestSort("endDate")}
                >
                  Ngày kết thúc
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
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract, index) => (
              <TableRow key={contract.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contract.code}</TableCell>
                <TableCell>{contract.nicheCode}</TableCell>
                <TableCell>{contract.customerName}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>
                  <Chip
                    label={contract.status}
                    color={
                      contract.status === "Còn hiệu lực"
                        ? "success"
                        : contract.status === "Quá hạn"
                        ? "error"
                        : contract.status === "Chờ duyệt gia hạn" ||
                          contract.status === "Chờ duyệt thanh lý"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewContract(contract.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleRenewContract(contract.id)}
                  >
                    <RestorePageIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleTerminateContract(contract.id)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddContractForm
        open={open}
        handleClose={handleClose}
        handleSave={handleSave}
      />
      <ContractDetailDialog
        open={detailOpen}
        handleClose={() => setDetailOpen(false)}
        contract={selectedContract}
      />
      <RenewalDialog
        open={renewalOpen}
        handleClose={() => setRenewalOpen(false)}
        contract={selectedContract}
        handleSave={handleRenewalSave}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmTerminate}
        title="Xác nhận thanh lý hợp đồng"
        content={`Bạn có chắc chắn muốn thanh lý hợp đồng ${
          selectedContract?.code || ""
        }?`}
      />
    </Box>
  );
};

export default withAuth(ContractPage);
