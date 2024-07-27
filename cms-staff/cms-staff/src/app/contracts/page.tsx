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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddContractForm from "./ContractAdd";
import ConfirmDialog from "./ContractDelete";
import ContractDetailDialog from "./ContractDetail";
import RenewalDialog from "./ContractRenewal";
import ContractContext from "@/context/ContractContext";
import contractService from "@/services/contractService";

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

  const fetchContracts = async () => {
    try {
      const data = await contractService.getAllContracts();
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [setContracts]);

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
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã Hợp đồng</TableCell>
              <TableCell>Tên Khách hàng</TableCell>
              <TableCell>Ngày ký hợp đồng</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract, index) => (
              <TableRow key={contract.contractId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{contract.contractCode}</TableCell>
                <TableCell>{contract.customerName}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>
                  <Chip
                    label={contract.status}
                    color={
                      contract.status === "Active"
                        ? "success"
                        : contract.status === "Expired"
                        ? "error"
                        : contract.status === "Pending Renewal" ||
                          contract.status === "Pending Termination"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewContract(contract.contractId)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleRenewContract(contract.contractId)}
                  >
                    <RestorePageIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleTerminateContract(contract.contractId)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
