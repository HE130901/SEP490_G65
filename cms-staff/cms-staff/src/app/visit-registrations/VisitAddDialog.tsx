"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import ServiceOrderAPI from "@/services/serviceOrderService";

interface VisitAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const VisitAddDialog: React.FC<VisitAddDialogProps> = ({ open, onClose }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: 0,
    nicheId: 0,
    visitDate: new Date().toISOString().slice(0, 16), // Default to current date and time
    accompanyingPeople: 0,
    note: "",
  });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await ServiceOrderAPI.getAllContracts();
        const contractsData = response.data.$values || response.data;
        setContracts(contractsData);

        if (contractsData.length > 0) {
          const firstContract = contractsData[0];
          setFormData((prevData) => ({
            ...prevData,
            customerId: firstContract.customerId,
            nicheId: firstContract.nicheId,
          }));
        }
      } catch (error) {
        toast.error("Không thể tải danh sách hợp đồng");
      }
    };

    fetchContracts();
  }, []);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContractChange = (event: SelectChangeEvent<number>) => {
    const contractId = event.target.value as number;
    const selectedContract = contracts.find(
      (contract) => contract.contractId === contractId
    );

    if (selectedContract) {
      setFormData((prevData) => ({
        ...prevData,
        customerId: selectedContract.customerId,
        nicheId: selectedContract.nicheId,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const requestData = {
        customerId: formData.customerId,
        nicheId: formData.nicheId,
        visitDate: formData.visitDate,
        accompanyingPeople: formData.accompanyingPeople,
        note: formData.note,
      };

      await axiosInstance.post("/api/VisitRegistrations", requestData);
      toast.success("Đăng ký viếng thăm đã được thêm thành công");
      onClose();
    } catch (error) {
      toast.error("Không thể thêm đăng ký viếng thăm");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm đăng ký viếng thăm</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth margin="normal">
          <InputLabel id="contract-label">Hợp đồng</InputLabel>
          <Select
            labelId="contract-label"
            name="contractId"
            value={formData.customerId}
            onChange={handleContractChange}
            label="Hợp đồng"
          >
            {contracts.map((contract) => (
              <MenuItem key={contract.contractId} value={contract.contractId}>
                {`Mã hợp đồng: ${contract.contractId} (${contract.customerName} - ${contract.nicheAddress})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Ngày viếng thăm"
          type="datetime-local"
          fullWidth
          variant="outlined"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Số lượng người đi cùng"
          type="number"
          fullWidth
          variant="outlined"
          name="accompanyingPeople"
          value={formData.accompanyingPeople}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Ghi chú"
          type="text"
          fullWidth
          variant="outlined"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitAddDialog;
